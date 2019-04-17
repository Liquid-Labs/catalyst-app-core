import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import classNames from 'classnames'

import AppBar from '@material-ui/core/AppBar'
import { ContextReset } from '../widgets/ContextReset'
import Grid from '@material-ui/core/Grid'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles'

const styles = (theme) => ({
  root : {
    flexGrow       : 1,
    verticalAlign  : 'middle',
    position       : 'relative',
    zIndex         : theme.zIndex.drawer + 1,
    '@media print' : {
      display : 'none'
    }
  },
  lightNavbar : {
    backgroundColor : 'white',
    border          : '2px solid ' + theme.palette.primary.main,
    color           : theme.palette.primary.main
  },
  right : {
    textAlign : 'right'
  }
})

const NavigationBar = ({ classes, children, showChildren=true, showLogo=true, showContextReset=false, rightChildren, logo, logoTo='/', ...remainder }) => {
  const theme = useTheme()

  if (!rightChildren && theme.layout && theme.layout.header && theme.layout.header.appMenu) {
    rightChildren = theme.layout.header.appMenu.node
  }

  if (showLogo && theme.layout && theme.layout.header && theme.layout.header.logo) {
    // TODO: *should* be set on theme, but let's default to visible if not set.
    if (theme.layout.header.logo.visible && !logo) {
      const { node, url, altText } = theme.layout.header.logo
      if (node) logo = node
      else if (url) {
        logo = <img className={classes.logo} src={url} alt={altText} />
      }
    }
    else showLogo = false
  }

  return (
    <Grid container alignItems="center">
      <Grid item container xs={2}>
        { showLogo
          && <Grid item xs style={{flexGrow : 0}}>
              <Link style={{ lineHeight: 0, display : 'block' }} to={logoTo}>{logo}</Link>
             </Grid> }
        { showContextReset
          && <Grid item xs style={{flexGrow : 0}}>
               <ContextReset />
            </Grid> }
      </Grid>
      <Grid item xs={8}>
        { showChildren && children }
      </Grid>
      <Grid item xs={2} className={classes.right}>
        {rightChildren}
      </Grid>
    </Grid>
)}

if (process.env.NODE_ENV !== 'production') {
  NavigationBar.propTypes = {
    classes       : PropTypes.object.isRequired,
    children      : PropTypes.node,
    logoTo        : PropTypes.string,
    rightChildren : PropTypes.node,
    showChildren  : PropTypes.bool,
    showContextReset         : PropTypes.bool,
    showLogo         : PropTypes.bool,
  }
}

const AppNavigation = withStyles(styles, { name : 'AppNavigation' })(({classes, children, ...remainder}) => {
  const theme = useTheme()
  return (
    <AppBar className={classNames(classes.root, classes.lightNavbar)}
        position="static" style={{flex : '0 0 auto'}}>
      <Toolbar variant={ (theme.layout && theme.layout.header.variant) || 'normal' }>
        <NavigationBar {...remainder} classes={classes}>{children}</NavigationBar>
      </Toolbar>
    </AppBar>
  )
})

export { AppNavigation }
