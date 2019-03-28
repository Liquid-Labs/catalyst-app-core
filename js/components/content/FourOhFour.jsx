import React from 'react'
import PropTypes from 'prop-types'

import { Link, withRouter } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'

const FourOhFour = withRouter(({noAuthRedirect, history}) => {
  // TODO: make slick with countdown
  const waitTime = 5 // seconds

  if (noAuthRedirect) {
    setTimeout(() => history.push(noAuthRedirect), waitTime * 1000)
  }

  return noAuthRedirect
    ? <div>
      <Typography variant="h5">404!</Typography>
      <Typography>
          The URL you entered is not available. You will be automatically redirected
          to <code><Link to={noAuthRedirect}>{noAuthRedirect}</Link></code> in {waitTime} seconds.
      </Typography>
    </div>
    : <Typography component="div" color="error">No such resource available.</Typography>
})

FourOhFour.propTypes = {
  noAuthRedirect : PropTypes.string,
  history        : PropTypes.object.isRequired,
}

export { FourOhFour }
