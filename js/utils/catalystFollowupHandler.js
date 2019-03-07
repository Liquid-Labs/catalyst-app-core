const catalystFollowupHandler = (
  { addErrorMessage, addWarningMessage, closeMessage },
  theme,
  currMsgKey) =>
  (waiterReport, followupCount, followupMax) => {
    if (currMsgKey.current) {
      closeMessage(currMsgKey.current)
    }
    const newMsg = () => {
      if (waiterReport.errorMessage) {
        currMsgKey.current = addErrorMessage(waiterReport.errorMessage)
      }
      else if (followupCount !== followupMax) {
        currMsgKey.current =
            addWarningMessage(`${waiterReport.name} is taking awhile to resolve...`)
      }
      else {
        currMsgKey.current =
            addWarningMessage(`${waiterReport.name} has not yet resolved. This is the final warning.`,
              { persist : true })
      }
    }
    // Give the previous message time to clear off. Even though the prior message
    // is 'exiting' (not 'entering'), the value is empirically the 'enteringScreen'.
    // TODO: would like to get clarity on the transition duration.
    if (currMsgKey.current) setTimeout(newMsg, theme.transitions.duration.enteringScreen)
    else newMsg()
  }

export { catalystFollowupHandler }
