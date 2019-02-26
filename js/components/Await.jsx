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
  const { addErrorMessage, addInfoMessage } = useContext(FeedbackContext)
  const followupHandler = useCallback((awaitReport) => {
    if (awaitReport.errorMessage) {
      addErrorMessage(awaitReport.errorMessage)
    }
    else {
      addInfoMessage(`${awaitReport.name} is taking awhile to resolve...`)
    }
  }, [addErrorMessage])

  return (
    <AwaitBase
        spinner={DefaultSpinner}
        blocked={DefaultBlocked}
        followupHandler={followupHandler}
        {...props} />
  )
}

export { Await }
