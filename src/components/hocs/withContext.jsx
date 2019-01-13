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
    // Since the App does not render this until authentication is settled, we
    // don't have to wait on authentication to settle here.
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

      if (!resolveDefaultContext) {
        defaultDefaultContextResolver(authUser, claims[appAdminClaim])
        if (authUser && claims[appAdminClaim]) {
          setAdminContext()
        }
      }

      if (!authUser) {
        setNoContext()
      }
      else if (claims[appAdminClaim]) {
        setAdminContext()
      }
      else if (claims.coordinator) {
        fetchSingleServiceLocation(
          uiRoutes.getContextListRouteFor({type : 'users', id : 'self'}, 'service-locations'))
          .then(processResult)
      }
      else if (claims.clerk) {
        fetchSingleStore(
          uiRoutes.getContextListRouteFor({type : 'users', id : 'self'}, 'stores'))
          .then(processResult)
      }
      else {
        /*setErrorMessage("Authenticated user has no authorized 'role'. Contact support.");
        setContextError();*/
        setNoContext() // TODO: set self-context
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
    fetchSingleServiceLocation : (source) => dispatch(resourceActions.fetchSingleFromList(source)),
    fetchSingleStore           : (source) => dispatch(resourceActions.fetchSingleFromList(source)),
    setErrorMessage            : (errorMsg) => dispatch(appActions.setErrorMessage(errorMsg)),
    setContext                 : (context) => dispatch(contextActions.setStoreContext(context)),
    setAdminContext           : () => dispatch(contextActions.setAdminContext()),
    setNoContext               : () => dispatch(contextActions.setNoContext()),
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
