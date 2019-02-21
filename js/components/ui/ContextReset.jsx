import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { connect } from 'react-redux'

import IconButton from '@material-ui/core/IconButton'
// import { withStyles } from '@material-ui/core/styles'

import RestoreIcon from 'mdi-material-ui/Restore'

import * as contextActions from '../../actions/contextActions'

/**
 * Displays icon control to reset the current context. This is used by Admins
 * and Coordinators.
 */
const ContextResetBase = ({resetContext}) =>
  <IconButton onClick={resetContext}><RestoreIcon /></IconButton>

ContextResetBase.propTypes = {
  resetContext : PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  resetContext : () => dispatch(contextActions.setNoContext())
})

const ContextReset = compose(
  connect(null, mapDispatchToProps)
)(ContextResetBase)

export { ContextReset }
