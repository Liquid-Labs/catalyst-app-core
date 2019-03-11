import React from 'react'
import PropTypes from 'prop-types'

import { BasicWaiterDisplay, CompactWaiterDisplay } from '@liquid-labs/react-waiter'
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
    marginBottom : '1.5rem'
  },
  tinyWaiterContainer : {
    display        : 'flex',
    flexDirection  : 'row',
    flex           : '1 1 auto',
    placeSelf      : '',
    alignItems     : 'center',
    justifyContent : 'flex-start'
  },
  tinyWaiterIcon : {
    marginRight: '0.65em'
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
  ({icon, report, tiny, reportClass, classes}) => {
    const Icon = icon
    // note, the 'size' is not transmitted to the underlying 'ErrorIcon', only
    // the 'CiruclarProgress component.'
    const size = tiny ? 15 : undefined
    const [ containerClass, iconClass, ReportDisplay ] = tiny
      ? [ classes.tinyWaiterContainer,
          classes.tinyWaiterIcon,
          CompactWaiterDisplay ]
      : [ classes.waiterContainer, classes.waiterIcon, BasicWaiterDisplay ]

    return (
      <div className={containerClass}>
        <div className={iconClass}>
          <Icon size={size} outerclasses={classes} />
        </div>
        <div className={classes[reportClass]}>
          <ReportDisplay report={report} />
        </div>
      </div>
    )
  }
)

const CatalystSpinner = ({report, tiny}) =>
  <CatalystWaiterDisplay
    icon={CircularProgress}
    report={report}
    tiny={tiny}
    reportClass="report" />

const CatalystBlocker = ({report, tiny}) =>
  // tried '<ErrorIcon color="error" .../>, but it was ineffective for whatever reason.'
  <CatalystWaiterDisplay
      icon={({outerclasses}) => <ErrorIcon className={outerclasses.errorIcon} fontSize="large" />}
      report={report}
      tiny={tiny}
      reportClass="errorReport" />

if (process.env.NODE_ENV !== 'production') {
  CatalystSpinner.propTypes = {
    report : PropTypes.object.isRequired,
    tiny   : PropTypes.bool,
  }

  CatalystBlocker.propTypes = {
    report : PropTypes.object.isRequired,
    tiny   : PropTypes.bool,
  }
}

export { CatalystSpinner, CatalystBlocker }
