import React, { createContext, useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import CloseIcon from '@material-ui/icons/Close'
import Snackbar from '@material-ui/core/Snackbar'
import { SnackbarProvider, withSnackbar } from 'notistack'
import { TinyIconButton } from '@liquid-labs/mui-extensions'

import { withStyles } from '@material-ui/core/styles'

const dismissStyles = (theme) => ({
  close : {
    width  : theme.spacing.unit * 4,
    height : theme.spacing.unit * 4,
  }
})

const styles = theme => ({
  infoSnack  : {},
  errorSnack : {
    background : theme.palette.error.light,
    color      : theme.palette.error.contrastLight,
    border     : `1px solid ${theme.palette.error.dark}`
  },
  warnSnack : {
    background : theme.palette.warn.light,
    color      : theme.palette.warn.contrastLight,
    border     : `1px solid ${theme.palette.warn.dark}`
  },
  confirmSnack : {
    background : theme.palette.confirm.light,
    color      : theme.palette.confirm.contrastLight,
    border     : `1px solid ${theme.palette.confirm.dark}`
  },
})

const FeedbackContext = createContext()

const FeedbackProvider = withSnackbar(
  ({autoHideDuration, warningHideFactor, enqueueSnackbar, children}) => {
    // 'enqueueSnackbar' changes with ever render. Which means we can't rely on
    // it as an indicator when to recalculate the 'addInfoMessage', etc.
    // Luckily, it appears that we don't have to.
    const addInfoMessage = useCallback((message, options) =>
      enqueueSnackbar(message, Object.assign(
        { persist: false, variant: 'info', autoHideDuration: autoHideDuration },
        options)),
      [ /* enqueueSnackbar */ ])
    const addConfirmMessage = useCallback((message, options) =>
      enqueueSnackbar(message, Object.assign(
        { persist: false, variant: 'success', autoHideDuration: autoHideDuration },
        options)),
      [ /* enqueueSnackbar */ ])
    const addWarningMessage = useCallback((message, options) =>
      enqueueSnackbar(message, Object.assign(
        { persist: false,
          variant: 'warning',
          autoHideDuration: autoHideDuration * warningHideFactor },
        options)),
      [ /* enqueueSnackbar */ ])
    const addErrorMessage = useCallback((message, options) =>
      enqueueSnackbar(message, Object.assign(
        { persist: true, variant: 'error' },
        options)),
      [ /* enqueueSnackbar */ ])
    const feedbackAPI = useMemo(() => ({
      addInfoMessage,
      addConfirmMessage,
      addWarningMessage,
      addErrorMessage
    }), [ /* addInfoMessage, addConfirmMessage, addWarningMessage, addErrorMessage */ ])

    return (
      <FeedbackContext.Provider value={ feedbackAPI }>
        {children}
      </FeedbackContext.Provider>
    )
  }
)

const defaultAutoHideDuration = 3500 // miliseconds

const defaultWarningHideFactor = 1.5

const defaultSnackAnchor = {
  vertical   : 'top',
  horizontal : 'center',
}

const DismissButton = withStyles(dismissStyles, { name: 'DismissButton' })(
  ({classes}) =>
    <TinyIconButton
      aria-label="Close"
      color="inherit"
      className={classes.close}
    >
      <CloseIcon />
    </TinyIconButton>
)

const snackbarActions = [ <DismissButton key="dismissButton" /> ]

const Feedback = withStyles(styles, { name: 'Feedback' })(({
  id='appMessages',
  autoHideDuration=defaultAutoHideDuration,
  anchorOrigin=defaultSnackAnchor,
  warningHideFactor=defaultWarningHideFactor,
  children, classes, ...props}) => {
  return (
    <SnackbarProvider
        action={snackbarActions}
        anchorOrigin={anchorOrigin}
        preventDuplicate={true}
        {...props}>
      <FeedbackProvider autoHideDuration={autoHideDuration}
          warningHideFactor={warningHideFactor}>
        {children}
      </FeedbackProvider>
    </SnackbarProvider>
  )
})

Feedback.propTypes = {
  children             : PropTypes.PropTypes.node,
  infoAutoHideDuration : PropTypes.number,
  anchorOrigin         : PropTypes.object,
}

export { Feedback, FeedbackContext }
