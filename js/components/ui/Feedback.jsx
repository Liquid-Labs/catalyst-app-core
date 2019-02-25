import React, { createContext, useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import CloseIcon from '@material-ui/icons/Close'
import Snackbar from '@material-ui/core/Snackbar'
import { TinyIconButton } from '@liquid-labs/mui-extensions'

import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  close : {
    width  : theme.spacing.unit * 4,
    height : theme.spacing.unit * 4,
  },
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

const defaultSnackAnchor = {
  vertical   : 'top',
  horizontal : 'center',
}

const clearMessage = (setMessages, message) =>
  setMessages((prevMsgs) => prevMsgs.filter((msgData) => {
    if (msgData.message !== message) {
      return true
    }
    else {
      clearTimeout(msgData.timer)
      return false
    }
  }))

const MessageLine = ({className, timer, message, setMessages, component}) => {
  <component className={className}
      onClick={(ev) => { clearMessage(setMessages, message); ev.preventDefault()}}>
    {message}
  </component>
}

const Feedback = withStyles(styles)(({children, classes}) => {
  const [ infoMessages, setInfoMessages ] = useState([])
  const [ errorMessages, setErrorMessages ] = useState([])

  const addInfoMessage = useCallback((message, sticky=false) => {
    if (!infoMessages.some((msg) => {
      if (msg.message === message) {
        // then reset the timer
        clearTimeout(msg.timer)
        msg.timer = setTimeout(() => clearMessage(setInfoMessages, message), 3500)
        return true
      }
      return false
    })) {
      infoMessages.push({
        message : message,
        sticky  : sticky,
        type    : 'info',
        timer   : setTimeout(() => clearMessage(setInfoMessages, message), 3500)
      })
      setInfoMessages(infoMessages)
    }
  }, [ infoMessages, setInfoMessages ])

  const addErrorMessage = useCallback((message) => {
    if (!errorMessages.some((msg) => msg.message === message)) {
      errorMessages.push({ message : message, sticky : true, type : 'error' })
      setErrorMessages(errorMessages)
    }
  }, [ errorMessages, setErrorMessages ])

  const feedbackContext = useMemo(() => ({
    addInfoMessage  : addInfoMessage,
    addErrorMessage : addErrorMessage
  }),
  [addInfoMessage, addErrorMessage])

  const clearAllMessages = useCallback(() => {
    setInfoMessages([])
    setErrorMessages([])
  }, [ setInfoMessages, setErrorMessages ])

  const open = Boolean(infoMessages.length > 0 || errorMessages.length > 0)
  const type = errorMessages.length > 0 ? 'error' : 'info'

  const messages = errorMessages.concat(infoMessages)

  let message = null
  if (messages.length > 1) {
    message =
      <ul>
        {messages.map((msg) =>
          <MessageLine component='li' className={`${msg.type}Snack`}
              setMessages={msg.type === 'info' ? setInfoMessages : setErrorMessages}
              {...msg} />)}
      </ul>
  }
  else if (messages.length === 1) {
    message = <MessageLine component="div"
        className={`${messages[0].type}Snack`}
        {...messages[0]} />
  }

  return (
    <FeedbackContext.Provider value={feedbackContext}>
      <Snackbar
          anchorOrigin={defaultSnackAnchor}
          open={open}
          autoHideDuration={null}
          onClose={clearAllMessages}
          ContentProps={{
            'aria-describedby' : 'message-id',
            className          : (type === 'error' && classes.errorSnack) || null
          }}
          message={<span id="message-id">{message}</span>}
          action={
            <TinyIconButton
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={clearAllMessages}
          >
              <CloseIcon />
            </TinyIconButton>
        }
      />
      {children}
    </FeedbackContext.Provider>
  )
})

Feedback.propTypes = {
  children : PropTypes.PropTypes.node
}

export { Feedback, FeedbackContext }
