export const blockUx = (source) => ({
  type: 'BLOCK_UX',
  source: source,
})

export const releaseUx = (source) => ({
  type: 'RELEASE_UX',
  source: source,
})

export const setInfoMessage = (infoMessage, sticky=false) => ({
  type: 'SET_INFO_MESSAGE',
  infoMessage: infoMessage,
  sticky: sticky
})

export const setErrorMessage = (errorMessage) => ({
  type: 'SET_ERROR_MESSAGE',
  errorMessage: errorMessage
})

export const clearAppMessages = () => ({ type: 'CLEAR_APP_MESSAGES' });

export const reset = () => ({ type: 'RESET' })
