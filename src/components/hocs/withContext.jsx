import React from 'react'
import { branch, compose, lifecycle, renderNothing, renderComponent } from 'recompose'
import { connect } from 'react-redux';

import { config } from '../../config'

import * as appActions from '../../actions/appActions'
import * as contextActions from '../../actions/contextActions'
import * as resourceActions from '../../actions/resourceActions'
import * as uiRoutes from '../../uiRoutes'

import { CenteredProgress } from '@liquid-labs/mui-extensions'

import camelCase from 'lodash.camelcase'
import upperFirst from 'lodash.upperfirst'

const withContext = (appAdminClaim, resolveDefaultContext) => (Component) => {
  function determineContext() {
    // Since we require authentication must settle before context is resolved
    // it's not necessary to wait on authentication.
    const { authUser, claims, // auth props
      contextResolved, contextError, // context
      // context setting dispatches
      setNoContext, setContextError, setAdminContext, setContext,
      fetchSingleServiceLocation, fetchSingleStore, // single-list fetch dispatches
      setErrorMessage
    } = this.props;

    if (!contextError && !contextResolved) {
      const processResult = (resAction) => {
        if (resAction === null) { return } // Fetch not executed for whatever reason, e.g., already fetching.
        else if (resAction.type.endsWith('SUCCESS')) {
          setContext(resAction.data[0])
        }
        else {
          setErrorMessage("Error determining application context.") // TODO: be more helpful
          setContextError()
        }
      }

      if (resolveDefaultContext) {
        resolveDefaultContext(authUser, claims).then(processResult)
      }
      else {
        setContext(authUser) // authUser may be null; that's OK
      }
    }
  }

  const mapStateToProps = (state, ownProps) => {
    const { contextState } = state
    const props = {
      context         : Object.assign({}, contextState),
      contextResolved : contextState.contextResolved,
      contextError    : contextState.contextError,
    }
    config.contexts
      && config.contexts.ordering
      && config.contexts.ordering.forEach(contextInfo => {
        const itemName = camelCase(contextInfo[1]);
        props[`context${upperFirst(itemName)}`] = contextState[itemName];
      })

    return props
  }

  const mapDispatchToProps = (dispatch) => ({
    setErrorMessage            : (errorMsg) => dispatch(appActions.setErrorMessage(errorMsg)),
    setContext                 : (context) => dispatch(contextActions.setContext(context)),
    setContextError            : () => dispatch(contextActions.setContextError())
  })

  return compose(
    // expects auth to be resolved and to receive auth props, as from
    // withAuthInfo; wrapped from App, so no need to wrap here
    connect(mapStateToProps, mapDispatchToProps),
    lifecycle({
      componentDidMount  : determineContext,
      componentDidUpdate : determineContext}),
    branch(({contextError}) => Boolean(contextError),
      renderNothing),
    branch(({contextResolved}) => !contextResolved,
      renderComponent(() => <CenteredProgress />))
  )(Component);
}

export { withContext }
