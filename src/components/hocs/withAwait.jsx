/**
 * Builds off `@liquid-labs/mui-extensions` `withAwait` to use the global app
 * info and error message dispatches.
 */
import React from 'react'
import { connect } from 'react-redux'

import { withAwait as withAwaitBase } from '@liquid-labs/mui-extensions'

import { appActions } from '@liquid-labs/catalyst-core-ui'

const mapDispatchToProps = (dispatch) => ({
  setInfoMessage: (msg, sticky) => { dispatch(appActions.setInfoMessage(msg, sticky)) },
  setErrorMessage: (msg) => { dispatch(appActions.setErrorMessage(msg)) }
})

const withAwait = connect(null, mapDispatchToProps)(withAwaitBase)

export { withAwait }
