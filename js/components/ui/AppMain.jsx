import React from 'react'
import { compose } from 'recompose'
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

const AppMainBase = ({classes, children, component, className, ...props}) => {
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
}

const AppMain = compose(
  withStyles(styles, { name : 'AppMain' }),
  styleWorkspacePadding(),
)(AppMainBase)

export { AppMain }
