import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import { compose } from 'recompose'
import classNames from 'classnames'

import AppBar from '@material-ui/core/AppBar'
import { CenteredProgress } from '@liquid-labs/mui-extensions'
import { ContextReset } from './ContextReset'
import Grid from '@material-ui/core/Grid'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import { withContext } from '../hocs/withContext'

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
    border          : '2px solid ' + theme.palette.primary.main
  },
  right : {
    textAlign : 'right'
  }
})

const logoStyle = {
  logo : {
    height : '42px'
  }
}

const AppNavigationBase = ({contextSet, contextError, classes, children, ...remainder}) => {
  return (
    <AppBar className={classNames(classes.root, classes.lightNavbar)}
        position="static" style={{flex : '0 0 auto'}}>
      <Toolbar>
        { !(contextSet || contextError)
          ? <CenteredProgress />
          : <NavigationBar {...remainder} classes={classes}>{children}</NavigationBar>
        }
      </Toolbar>
    </AppBar>
  )
}

const LogoLink = withStyles(logoStyle)(({to, url, description, classes}) =>
  <Link to={to}>
    { url
    && <img className={classes.logo} src={url} alt="{description} Logo" />}
    { !url
      && <Typography variant="headline">{description}</Typography> }
  </Link>
)

const LogoAndContext = ({
  to,
  logoUrl, logoDescription,
  noContextLogoUrl, noContextLogoDescription,
  contextStore, contextServiceLocation
}) => {
  const justLogo = !contextStore && !contextServiceLocation
  const { url, description } =
    logoUrl && { logoUrl, logoDescription }
    || (
      (contextStore && {
        url         : contextStore.logoUrl,
        description : contextStore.name
      })
      || (contextServiceLocation && {
        url         : contextServiceLocation.logoUrl,
        description : contextServiceLocation.name
      })
      || { url : noContextLogoUrl, description : noContextLogoDescription }
    )
  const addGridProps = {}
  if (!justLogo) {
    addGridProps.container = true
    addGridProps.justify = "flex-start"
  }

  return (<React.Fragment>
    { justLogo
    && <LogoLink to={to} url={url} description={description} /> }
    { !justLogo
    && <Grid container>
      <Grid item xs style={{flexGrow : 0}}>
        <LogoLink to={to} url={url} description={description} />
      </Grid>
      <Grid item xs style={{flexGrow : 0}}>
        <ContextReset />
      </Grid>
    </Grid>}
  </React.Fragment>)
}

LogoAndContext.propTypes = {
  // TODO: use URL regex
  to                       : PropTypes.string,
  logoUrl                  : PropTypes.string,
  logoDescription          : PropTypes.string,
  noContextLogoUrl         : PropTypes.string,
  noContextLogoDescription : PropTypes.string,
  contextStore             : PropTypes.object,
  contextServiceLocation   : PropTypes.object
}

const NavigationBar = ({ classes, children, rightChildren, logoTo, ...remainder }) =>
  <Grid container>
    <Grid item xs={2}>
      <LogoAndContext to={logoTo} {...remainder} />
    </Grid>
    <Grid item xs={8}>
      { children }
    </Grid>
    <Grid item xs={2} className={classes.right}>
      {rightChildren}
    </Grid>
  </Grid>

AppNavigationBase.propTypes = {
  classes : PropTypes.object.isRequired,
}

const AppNavigation = compose(
  withStyles(styles),
  withContext,
)(AppNavigationBase)

export { AppNavigation }
