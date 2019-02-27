import React, { createContext, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CloseIcon from '@material-ui/icons/Close'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import { SnackbarProvider, withSnackbar } from 'notistack'
import { TinyIconButton } from '@liquid-labs/mui-extensions'
import WarningIcon from '@material-ui/icons/Warning'

import { withStyles } from '@material-ui/core/styles'

const dismissStyles = (theme) => ({
  close : {
    width  : theme.spacing.unit * 4,
    height : theme.spacing.unit * 4,
  }
})

const styles = theme => ({
  // allow our snackbars to take up most of the space
  snackItemRoot : {
    flex                         : '0 0 auto',
    maxWidth                     : 'none',
    [theme.breakpoints.up('sm')] : {
      maxWidth : '90vw'
    },
    [theme.breakpoints.up('md')] : {
      maxWidth : '80vw'
    },
    [theme.breakpoints.up('xl')] : {
      maxWidth : '60vw'
    },
  }
})

const FeedbackContext = createContext()

const FeedbackProvider = withSnackbar(
  ({autoHideDuration, warningHideFactor, enqueueSnackbar, closeSnackbar, children}) => {
    // 'enqueueSnackbar' changes with ever render. Which means we can't rely on
    // it as an indicator when to recalculate the 'addInfoMessage', etc.
    // Luckily, it appears that we don't have to.
    const addInfoMessage = useCallback((message, options) =>
      enqueueSnackbar(message, Object.assign(
        { persist : false, variant : 'info', autoHideDuration : autoHideDuration },
        options)),
    [ /* enqueueSnackbar */ ])
    const addConfirmMessage = useCallback((message, options) =>
      enqueueSnackbar(message, Object.assign(
        { persist : false, variant : 'success', autoHideDuration : autoHideDuration },
        options)),
    [ /* enqueueSnackbar */ ])
    const addWarningMessage = useCallback((message, options) =>
      enqueueSnackbar(message, Object.assign(
        { persist          : false,
          variant          : 'warning',
          autoHideDuration : autoHideDuration * warningHideFactor },
        options)),
    [ /* enqueueSnackbar */ ])
    const addErrorMessage = useCallback((message, options) =>
      enqueueSnackbar(message, Object.assign(
        { persist : true, variant : 'error' },
        options)),
    [ /* enqueueSnackbar */ ])
    const closeMessage = useCallback((key) => closeSnackbar(key), [])
    const feedbackAPI = useMemo(() => ({
      addInfoMessage,
      addConfirmMessage,
      addWarningMessage,
      addErrorMessage,
      closeMessage,
    }), [ /* addInfoMessage, addConfirmMessage, addWarningMessage, addErrorMessage */ ])

    return (
      <FeedbackContext.Provider value={feedbackAPI}>
        {children}
      </FeedbackContext.Provider>
    )
  }
)

const defaultAutoHideDuration = 2000 // miliseconds

const defaultWarningHideFactor = 1.5

const defaultSnackAnchor = {
  vertical   : 'top',
  horizontal : 'center',
}

const DismissButton = withStyles(dismissStyles, { name : 'DismissButton' })(
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

const iconStyle = {
  marginRight : '0.25em',
  height      : '0.8em'
}

// use standard material icons
const iconVariant = {
  success : <CheckCircleIcon style={iconStyle} />,
  info    : <InfoIcon style={iconStyle} />,
  error   : <ErrorIcon style={iconStyle} />,
  warning : <WarningIcon style={iconStyle} />
}

const Feedback = withStyles(styles, { name : 'Feedback' })(({
  id='appMessages',
  autoHideDuration=defaultAutoHideDuration,
  anchorOrigin=defaultSnackAnchor,
  warningHideFactor=defaultWarningHideFactor,
  children, classes, ...props}) => {
  return (
    <SnackbarProvider
        action={snackbarActions}
        anchorOrigin={anchorOrigin}
        iconVariant={iconVariant}
        ContentProps={{ classes : { root : classes.snackItemRoot } }}
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
