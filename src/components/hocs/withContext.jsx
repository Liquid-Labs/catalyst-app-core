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

const withContext = (Component) => {
  function determineContext() {
    // Since the App does not render this until authentication is settled, we
    // don't have to wait on authentication to settle here.
    const { authUser, claims, // auth props
      contextSet, contextError, // context
      // context setting dispatches
      setNoContext, setContextError, setGlobalContext,
      setServiceLocationContext, setStoreContext,
      fetchSingleServiceLocation, fetchSingleStore, // single-list fetch dispatches
      setErrorMessage
    } = this.props;

    const processResult = (successDispatch) => (resAction) => {
      if (resAction === null) {return;} // Fetch not executed for whatever reason, e.g., already fetching.
      else if (resAction.type.endsWith('SUCCESS')) {successDispatch(resAction.data[0]);}
      else setContextError();
    }

    if (!contextError && !contextSet) {
      if (!authUser) {
        setNoContext()
      }
      else if (claims.admin) {
        setGlobalContext();
      }
      else if (claims.coordinator) {
        fetchSingleServiceLocation(
          uiRoutes.getContextListRouteFor({type : 'users', id : 'self'}, 'service-locations'))
          .then(processResult(setServiceLocationContext));
      }
      else if (claims.clerk) {
        fetchSingleStore(
          uiRoutes.getContextListRouteFor({type : 'users', id : 'self'}, 'stores'))
          .then(processResult(setStoreContext));
      }
      else {
        setErrorMessage("Authenticated user has no authorized 'role'. Contact support.");
        setContextError();
      }
    }
  }

  const mapStateToProps = (state, ownProps) => {
    const { contextState } = state;
    const props = {
      context      : Object.assign({}, contextState),
      contextSet   : contextState.contextSet,
      contextError : contextState.contextError,
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
    setStoreContext            : (store) => dispatch(contextActions.setStoreContext(store)),
    setServiceLocationContext  : (serviceLocation) => dispatch(contextActions.setServiceLocationContext(serviceLocation)),
    setGlobalContext           : () => dispatch(contextActions.setGlobalContext()),
    setNoContext               : () => dispatch(contextActions.setNoContext()),
    setContextError            : () => dispatch(contextActions.setContextError())
  })

  return compose(
    // expects auth to be resolved and to receive auth props, as from
    // withAuthInfo; wrapped from App, so no need to wrap here
    connect(mapStateToProps, mapDispatchToProps),
    lifecycle({componentDidMount : determineContext}),
    branch(({contextError}) => Boolean(contextError),
      renderNothing),
    branch(({contextSet}) => !contextSet,
      renderComponent(() => <CenteredProgress />))
  )(Component);
}

export { withContext }
