import React from 'react'
import PropTypes from 'prop-types'

import { BasicWaiterDisplay } from '@liquid-labs/react-waiter'
import CircularProgress from '@material-ui/core/CircularProgress'
import ErrorIcon from '@material-ui/icons/Error'

import { withStyles } from '@material-ui/core/styles'

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

const CatalystWaiterDisplay = withStyles(styles, { name : 'CatalystWaiterDisplay' })(
  ({icon, report, reportClass, classes}) => {
    const Icon = icon
    return (
      <div className={classes.waiterContainer}>
        <div className={classes.waiterIcon}>
          <Icon outerclasses={classes} />
        </div>
        <div className={classes[reportClass]}>
          <BasicWaiterDisplay report={report} />
        </div>
      </div>
    )
  }
)

const CatalystSpinner = ({report}) =>
  <CatalystWaiterDisplay icon={CircularProgress} report={report} reportClass="report" />

const CatalystBlocker = ({report}) =>
  // tried '<ErrorIcon color="error" .../>, but it was ineffective for whatever reason.'
  <CatalystWaiterDisplay
      icon={({outerclasses}) => <ErrorIcon className={outerclasses.errorIcon} fontSize="large" />}
      report={report}
      reportClass="errorReport" />

if (process.env.NODE_ENV !== 'production') {
  CatalystSpinner.propTypes = {
    report : PropTypes.object.isRequired
  }

  CatalystBlocker.propTypes = {
    report : PropTypes.object.isRequired
  }
}

export { CatalystSpinner, CatalystBlocker }
