import React from 'react'

import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'

import { withStyles } from '@material-ui/core/styles'

const styles = {
  IconControl : {
    maxWidth  : '84px',
    width     : '100%',
    textAlign : 'center'
  }
}

const IconControl = withStyles(styles)(
  ({classes, children, ...props}) =>
    <Grid item className={classes.IconControl}>
      <IconButton {...props}>
        {children}
      </IconButton>
    </Grid>
)

export { IconControl }
