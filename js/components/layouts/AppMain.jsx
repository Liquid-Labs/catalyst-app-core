import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Grid from '@material-ui/core/Grid'

import { withStyles } from '@material-ui/core/styles'
import { styleWorkspacePadding } from '../hocs/styleWorkspacePadding'

const styles = (theme) => ({
  root : {
    flexGrow  : 1,
    overflowY : 'auto',
    overflowX : 'hidden',
    position  : 'relative', // make this the container for position elements
  }
})

const AppMain = withStyles(styles, { name : 'AppMain' })(styleWorkspacePadding()(
  ({classes, children, className, ...props}) => {
    className = classNames(classes.root, className)

    return (
      <Grid id="main"
          container
          direction="column"
          wrap="nowrap"
          className={className}
          {...props}>
        { children }
      </Grid>
    )
  }))

if (process.env.NODE_ENV !== 'production') {
  AppMain.propTypes = {
    children  : PropTypes.node.isRequired,
    className : PropTypes.string
  }
}

export { AppMain }
