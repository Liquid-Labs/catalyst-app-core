import React from 'react'

import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'

import { withStyles } from '@material-ui/core/styles'

import classNames from 'classnames'

const CTRL_RANK_PRIMARY = 'primary'
const CTRL_RANK_SECONDARY = 'secondary'
const CTRL_DANGER_SAFE = 'safe'
const CTRL_DANGER_DANGEROUS = 'dangerous'

const styles = (theme) => ({
  root : {
    maxWidth  : '84px',
    width     : '100%',
    textAlign : 'center'
  },
  primaryControl : {
    backgroundColor : theme.palette.primary.main,
    color           : theme.palette.primary.contrastText,
    '&:hover'       : {
      backgroundColor : theme.palette.primary.light,
    }
  },
  secondarySafeControl : {
    color : theme.palette.primary.main,
  },
  secondaryDangerousControl : {
    color : theme.palette.dangerous.main,
  },
  disabledPrimary : {
    backgroundColor : theme.palette.action.disabledBackground,
    color           : `${theme.palette.primary.contrastText} !important`,
  },
  disabledSecondary : {
    color : theme.palette.action.disabled,
  }
})

const IconControl = withStyles(styles)(
  ({rank, danger, classes, children, ...props}) =>
    <Grid item className={classes.root}>
      <IconButton
          className={classNames(rank === CTRL_RANK_PRIMARY && classes.primaryControl,
            rank === CTRL_RANK_SECONDARY
                                  && danger === CTRL_DANGER_SAFE
                                  && classes.secondarySafeControl,
            rank === CTRL_RANK_SECONDARY
                                  && danger === CTRL_DANGER_DANGEROUS
                                  && classes.secondaryDangerousControl )}
          classes={{ disabled : rank === CTRL_RANK_PRIMARY
            ? classes.disabledPrimary
            : classes.disabledSecondary }}
          {...props}>
        {children}
      </IconButton>
    </Grid>
)

export {
  IconControl,
  CTRL_RANK_PRIMARY,
  CTRL_RANK_SECONDARY,
  CTRL_DANGER_SAFE,
  CTRL_DANGER_DANGEROUS,
}
