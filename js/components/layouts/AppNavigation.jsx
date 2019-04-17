// TODO: rename 'AppMenu'; 'Then 'BottomAppNavigation' can become 'AppNavigation'
/**
 * AppNavigation provides a Catalyst standard application menu. The menu
 * consistst of there components:
 * - a logo, which by default links to the application root ('/')
 * - content specific controls
 * - a dropdown, application wide menu
 *
 * Properties:
 * - `logo` : A React node or null to supress showing any logo. If undefined,
 *    the settings from the theme will be used, if available.
 */
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

const NavigationBar = ({ classes, children, showChildren=true, showContextReset=false, rightChildren, logo, logoTo='/', ...remainder }) => {
  const theme = useTheme()

  if (!rightChildren && theme?.layout?.header?.appMenu) {
    rightChildren = theme.layout.header.appMenu.node
  }

  if (logo === undefined) { // then refer to the theme
    const { node, url, altText } = theme?.layout?.branding?.header || {}
    if (node) logo = node
    else if (url) {
      console.log('altText: ', altText)
      logo = url === 'placeholder'
        ? <Grid container justify="center" alignItems="center"
              style={{
                backgroundColor : theme.palette.placeholder || "#9e9e9e",
                height: '100%' }}>
            <span style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'}}>
              {altText || 'placeholder'}
            </span>
          </Grid>
        : <img className={classes.logo} src={url} alt={altText} />
    }
  }

  return (
    <Grid container alignItems="center">
      <Grid item container xs={2} wrap="nowrap" style={{ alignSelf: 'stretch' }} alignItems="stretch">
        { logo !== null
          && <Link style={{ display : 'block', width: '100%' }} to={logoTo}>{logo}</Link> }
        { showContextReset
          && <ContextReset /> }
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
