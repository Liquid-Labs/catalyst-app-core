import { connect } from 'react-redux'

import { withAwait as withAwaitBase } from '@liquid-labs/mui-extensions'

import * as appActions from '../../actions/appActions'

/**
 * Builds off `@liquid-labs/mui-extensions` `withAwait` to use the global app
 * info and error message dispatches.
 */

const mapDispatchToProps = (dispatch) => ({
  setInfoMessage  : (msg, sticky) => { dispatch(appActions.setInfoMessage(msg, sticky)) },
  setErrorMessage : (msg) => { dispatch(appActions.setErrorMessage(msg)) }
})

const withAwait = (awaitChecks, isBlocked, completionPropName = 'fulfilled') => (Component) =>
  connect(null, mapDispatchToProps)(withAwaitBase(awaitChecks, isBlocked, completionPropName)(Component))

export { withAwait }
