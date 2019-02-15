import React from 'react'

import * as appActions from '../actions/appActions'
import { connect } from 'react-redux'

import { Await as AwaitBase, defaultReportDisplay } from '@liquid-labs/react-await'
import { Centered } from '@liquid-labs/mui-extensions'
import CircularProgress from '@material-ui/core/CircularProgress'
import ErrorIcon from '@material-ui/icons/Error'

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

const mapDispatchToProps = (dispatch) => ({
  followupHandler : (msg) => dispatch(appActions.setInfoMessage(msg))
})

const Await = connect(null, mapDispatchToProps)(
  (props) =>
    <AwaitBase spinner={DefaultSpinner} blocked={DefaultBlocked} {...props} />
)

export { Await }
