/**
 * AppMenuBar provides a Catalyst standard application menu. The menu
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
import { withStyles } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles'

const styles = (theme) => ({
  root : {
    height         : theme.layout.header.variant === 'dense' ? '36px' : '64px',
    verticalAlign  : 'middle',
    position       : 'relative',
    zIndex         : theme.zIndex.drawer + 1,
    '@media print' : {
      display : 'none'
    }
  },
  lightNavbar : {
    backgroundColor : 'white',
    borderBottom    : '2px solid ' + theme.palette.primary.main,
    color           : theme.palette.primary.main
  },
  right : {
    textAlign : 'right'
  }
})

const NavigationBar = ({
  logo, logoTo='/',
  children, showChildren=true, rightChildren,
  showContextReset=false,
  LeftGridProps, CenterGridProps, RightGridProps,
  classes, ...props }) => {
  const theme = useTheme()

  if (!rightChildren && theme?.layout?.header?.appMenu) {
    rightChildren = theme.layout.header.appMenu.node
  }

  const linkStyle = { display : 'block', width : '100%' }

  if (logo === undefined) { // then refer to the theme
    if (theme?.layout?.header?.showLogo === false) logo = null
    else {
      const { node, url, altText } = theme?.branding?.header || {}
      if (node) {
        logo = node
        linkStyle.lineHeight = 0
      }
      else if (url) {
        if (url === 'placeholder') {
          logo =
            <Grid container justify="center" alignItems="center"
                style={{
                  backgroundColor : theme.palette.placeholder || "#9e9e9e",
                  height          : '100%' }}>
              <span style={{
                whiteSpace   : 'nowrap',
                overflow     : 'hidden',
                textOverflow : 'ellipsis'}}>
                {altText || 'placeholder'}
              </span>
            </Grid>
        }
        else {
          logo = <img className={classes.logo} src={url} alt={altText} />
          linkStyle.lineHeight = 0
        }
      }
    }
  }

  return (
    <Grid container alignItems="center" {...props}>
      <Grid item container xs={2} wrap="nowrap"
          style={{ alignSelf : 'stretch' }}
          alignItems="stretch" {...LeftGridProps}>
        { logo !== null
          && <Link style={linkStyle} to={logoTo}>{logo}</Link> }
        { showContextReset
          && <ContextReset /> }
      </Grid>
      <Grid item xs={8} {...CenterGridProps}>
        { showChildren && children || theme?.layout?.header?.children }
      </Grid>
      <Grid item xs={2} className={classes.right} {...RightGridProps}>
        {rightChildren}
      </Grid>
    </Grid>
  )
}

if (process.env.NODE_ENV !== 'production') {
  NavigationBar.propTypes = {
    CenterGridProps  : PropTypes.object,
    classes          : PropTypes.object.isRequired,
    children         : PropTypes.node,
    LeftGridProps    : PropTypes.object,
    logo             : PropTypes.node,
    logoTo           : PropTypes.string,
    rightChildren    : PropTypes.node,
    RightGridProps   : PropTypes.object,
    showChildren     : PropTypes.bool,
    showContextReset : PropTypes.bool,
    showLogo         : PropTypes.bool,
  }
}

const AppMenuBar = withStyles(styles, { name : 'AppMenuBar' })(({
  NavigationBarProps, ToolbarProps, classes, children, ...props}) => {
  const theme = useTheme()
  return (
    <AppBar className={classNames(classes.root, classes.lightNavbar)}
        position="fixed" {...props}>
      <Toolbar variant={(theme.layout && theme.layout.header.variant) || 'normal'} {...ToolbarProps}>
        <NavigationBar {...NavigationBarProps} classes={classes}>{children}</NavigationBar>
      </Toolbar>
    </AppBar>
  )
})

export { AppMenuBar }
