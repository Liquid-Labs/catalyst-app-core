const INITIAL_STATE = {
  infoMessages  : [],
  errorMessages : [],
  sticky        : false
}

const requestFailedRe = /_FAILURE$/

const mergeMessage = (currentState, msg, msgsKey, sticky) => {
  if (currentState[msgsKey].indexOf(msg) > -1) {
    return currentState
  }
  else {
    return {
      ...currentState,
      [msgsKey] : currentState[msgsKey].concat([msg]),
      sticky    : sticky || currentState.sticky
    }
  }
}

const appReducer = (currentState = INITIAL_STATE, action) => {
  const actType = action.type
  if (requestFailedRe.test(actType)) {
    return mergeMessage(currentState, action.errorMessage, 'errorMessages', true)
  }

  // And now specific action affects.
  switch (actType) {
  case ('SET_INFO_MESSAGE'):
    return mergeMessage(currentState, action.infoMessage, 'infoMessages', action.sticky)
  case ('SET_ERROR_MESSAGE'):
    console.error(action.errorMessage) // eslint-disable-line no-console
    return mergeMessage(currentState, action.errorMessage, 'errorMessages', true)
  case ('CLEAR_APP_MESSAGES'):
    return {
      ...currentState,
      infoMessages  : [],
      errorMessages : [],
      sticky        : false
    }
  case ('RESET'):
    return INITIAL_STATE;
  default:
    return currentState;
  }
}

export default appReducer;
