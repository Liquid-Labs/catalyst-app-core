import React, { useCallback, useContext, useRef } from 'react'

import { Await as AwaitBase, defaultReportDisplay } from '@liquid-labs/react-await'
import CircularProgress from '@material-ui/core/CircularProgress'
import ErrorIcon from '@material-ui/icons/Error'
import { FeedbackContext } from './ui/Feedback'

import { withStyles } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles'

const styles = (theme) => ({
  awaitContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    placeSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  awaitIcon: {
    bottomMargin: '1.5rem'
  },
  errorIcon: {
    color: theme.palette.error.main
  },
  report : {
    color: theme.palette.primary.main,
    fontStyle: 'oblique'
  },
  errorReport: {
    color: theme.palette.error.dark,
    fontWeight: 'bold'
  }
})

const AwaitContent = withStyles(styles, { name: 'AwaitContent' })(
  ({Icon, report, reportClass, classes}) =>
    <div className={classes.awaitContainer}>
      <div className={classes.awaitIcon}>
        <Icon outerclasses={classes} />
      </div>
      <div className={classes[reportClass]}>
        { defaultReportDisplay(report) }
      </div>
    </div>
)

const DefaultSpinner = (report) =>
  <AwaitContent Icon={CircularProgress} report={report} reportClass="report" />

const DefaultBlocked = (report) =>
  // tried '<ErrorIcon color="error" .../>, but it was ineffective for whatever reason.'
  <AwaitContent
    Icon={({outerclasses}) => <ErrorIcon className={outerclasses.errorIcon} fontSize="large" />}
    report={report}
    reportClass="errorReport" />

const Await = (props) => {
  const { addErrorMessage, addWarningMessage, closeMessage } = useContext(FeedbackContext)
  const theme = useTheme()
  const currMsgKey = useRef()
  const followupHandler = useCallback((awaitReport, followupCount, followupMax) => {
    if (currMsgKey.current) {
      closeMessage(currMsgKey.current)
    }
    const newMsg = () => {
      if (awaitReport.errorMessage) {
        currMsgKey.current = addErrorMessage(awaitReport.errorMessage)
      }
      else if (followupCount !== followupMax) {
        currMsgKey.current =
          addWarningMessage(`${awaitReport.name} is taking awhile to resolve...`)
      }
      else {
        currMsgKey.current =
          addWarningMessage(`${awaitReport.name} has not yet resolved. This is the final warning.`,
                            { persist : true })
      }
    }
    // Give the previous message time to clear off. Even though the prior message
    // is 'exiting' (not 'entering'), the value is empirically the 'enteringScreen'.
    // TODO: would like to get clarity on the transition duration.
    if (currMsgKey.current) setTimeout(newMsg, theme.transitions.duration.enteringScreen)
    else newMsg()
  }, [addErrorMessage, addWarningMessage, closeMessage])

  return (
    <AwaitBase
        spinner={DefaultSpinner}
        blocked={DefaultBlocked}
        followupHandler={followupHandler}
        {...props} />
  )
}

export { Await }
