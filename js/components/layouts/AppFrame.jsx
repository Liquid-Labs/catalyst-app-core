/*
* `AppFrame` provides a standard, top-level application layout consisting of a
* fixed menu bar on top, a fixed navigation bar on bottom, and a content area
* in between.
*/
import React from 'react'
import PropTypes from 'prop-types'

import { AppMenuBar } from '../widgets/AppMenuBar'
import { AppNavigationBar } from '../widgets/AppNavigationBar'
import Grid from '@material-ui/core/Grid'

import { useTheme } from '@material-ui/styles'

import classNames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { mainPaddingStyles } from '@liquid-labs/react-viewport-context'

const mainStyles = (theme) => ({
  root : {
    flexGrow  : 1,
    overflowY : 'auto',
    overflowX : 'hidden',
    position  : 'relative', // make this the container for position elements
  }
})

const useMainStyles = makeStyles(mainStyles)
const useMainPaddingStyles = makeStyles(mainPaddingStyles)

const AppMain = ({children, className, ...props}) => {
  const mainClasses = useMainStyles()
  const paddingClasses = useMainPaddingStyles()

  className = classNames(
    mainClasses.root,
    paddingClasses.mainPaddingSides,
    paddingClasses.mainPaddingTop,
    paddingClasses.mainPaddingBottom,
    className)

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

if (process.env.NODE_ENV !== 'production') {
  AppMain.propTypes = {
    children  : PropTypes.node.isRequired,
    className : PropTypes.string
  }
}

// TODO https://github.com/Liquid-Labs/catalyst-core-ui/issues/4
const AppFrame = ({ContentRouter, ...props}) => {
  const theme = useTheme()
  const headerProps = theme?.layout?.header?.props || {}

  //<div style={{ minHeight : '100vh' }} {...props}>
  return (
    <Grid container id="appRootFrame" style={{ minHeight : '100vh' }} spacing={0} direction="column" {...props}>
      <AppMenuBar {...headerProps} />
      <AppMain>
        <ContentRouter />
      </AppMain>
      <AppNavigationBar />
    </Grid>
  )
}

if (process.env.NODE_ENV !== 'production') {
  AppFrame.propTypes = {
    ContentRouter : PropTypes.func.isRequired
  }
}

export { AppFrame }
