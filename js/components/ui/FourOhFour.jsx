import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import Typography from '@material-ui/core/Typography'

const FourOhFourBase = ({noAuthRedirect, history}) => {
  // TODO: make slick with countdown
  const waitTime = 5 // seconds

  if (noAuthRedirect) {
    setTimeout(() => history.push(noAuthRedirect), waitTime * 1000)
  }

  return noAuthRedirect
    ? <div>
      <Typography variant="headline">404!</Typography>
      <Typography>
          The URL you entered is not available. You will be automatically redirected
          to <code><Link to={noAuthRedirect}>{noAuthRedirect}</Link></code> in {waitTime} seconds.
      </Typography>
    </div>
    : <Typography component="div" color="error">No such resource available.</Typography>
}

FourOhFourBase.propTypes = {
  noAuthRedirect : PropTypes.string,
  history        : PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  authUser : state.sessionState.authUser,
});

const FourOhFour = compose(
  connect(mapStateToProps),
  withRouter
)(FourOhFourBase)

export { FourOhFour }
