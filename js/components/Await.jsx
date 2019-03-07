import React, { useCallback, useContext, useRef } from 'react'

import { Waiter as WaiterBase, BasicWaiterDisplay } from '@liquid-labs/react-waiter'
import CircularProgress from '@material-ui/core/CircularProgress'
import ErrorIcon from '@material-ui/icons/Error'
import { FeedbackContext } from './ui/Feedback'

import { withStyles } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles'

const styles = (theme) => ({
  waiterContainer : {
    display        : 'flex',
    flexDirection  : 'column',
    flex           : '1 1 auto',
    placeSelf      : 'center',
    alignItems     : 'center',
    justifyContent : 'center'
  },
  waiterIcon : {
    bottomMargin : '1.5rem'
  },
  errorIcon : {
    color : theme.palette.error.main
  },
  report : {
    color     : theme.palette.primary.main,
    fontStyle : 'oblique'
  },
  errorReport : {
    color      : theme.palette.error.dark,
    fontWeight : 'bold'
  }
})

const WaiterContent = withStyles(styles, { name : 'WaiterContent' })(
  ({Icon, report, reportClass, classes}) =>
    <div className={classes.waiterContainer}>
      <div className={classes.waiterIcon}>
        <Icon outerclasses={classes} />
      </div>
      <div className={classes[reportClass]}>
        <BasicWaiterDisplay report={report} />
      </div>
    </div>
)

const DefaultSpinner = ({report}) =>
  <WaiterContent Icon={CircularProgress} report={report} reportClass="report" />

const DefaultBlocked = ({report}) =>
  // tried '<ErrorIcon color="error" .../>, but it was ineffective for whatever reason.'
  <WaiterContent
      Icon={({outerclasses}) => <ErrorIcon className={outerclasses.errorIcon} fontSize="large" />}
      report={report}
      reportClass="errorReport" />

const Waiter = (props) => {
  const { addErrorMessage, addWarningMessage, closeMessage } = useContext(FeedbackContext)
  const theme = useTheme()
  const currMsgKey = useRef()
  const followupHandler = useCallback((waiterReport, followupCount, followupMax) => {
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
  }, [addErrorMessage, addWarningMessage, closeMessage])

  return (
    <WaiterBase
        spinner={DefaultSpinner}
        blocker={DefaultBlocked}
        followupHandler={followupHandler}
        {...props} />
  )
}

export { Waiter }
