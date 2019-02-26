import React, { useCallback, useContext } from 'react'

import { Await as AwaitBase, defaultReportDisplay } from '@liquid-labs/react-await'
import { Centered } from '@liquid-labs/mui-extensions'
import CircularProgress from '@material-ui/core/CircularProgress'
import ErrorIcon from '@material-ui/icons/Error'
import { FeedbackContext } from './ui/Feedback'

const DefaultSpinner = (report) =>
  <Centered method="flex">
    <CircularProgress /><br />
    { defaultReportDisplay(report) }
  </Centered>

const DefaultBlocked = (report) =>
  <Centered method="flex">
    <ErrorIcon fontSize="large" /><br />
    { defaultReportDisplay(report) }
  </Centered>

const Await = (props) => {
  const { addErrorMessage, addWarningMessage } = useContext(FeedbackContext)
  const followupHandler = useCallback((awaitReport, followupCount, followupMax) => {
    if (awaitReport.errorMessage) {
      addErrorMessage(awaitReport.errorMessage)
    }
    else if (followupCount !== followupMax) {
      addWarningMessage(`${awaitReport.name} is taking awhile to resolve...`)
    }
    else {
      addWarningMessage(`${awaitReport.name} has not yet resolved. This is the final warning.`,
        { persist : true })
    }
  }, [addErrorMessage, addWarningMessage])

  return (
    <AwaitBase
        spinner={DefaultSpinner}
        blocked={DefaultBlocked}
        followupHandler={followupHandler}
        {...props} />
  )
}

export { Await }
