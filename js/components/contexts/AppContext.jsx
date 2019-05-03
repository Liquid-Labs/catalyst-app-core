/**
* `AppContext` sets up the standard contexts available to Catalyst applications.
* This includes contexts providing information and/or control for routing, user
* context, app-header controls, viewport, theme, authentication, and redux.
*
* We also set up support for basic feedback using the `Feedback` combined widget
* and context component, put everything in a `Typography` context, and set the
* `CssBaseline`. The latter two actions are not strictly 'contextual' in the
* sense of a "context component", but this is a convenient place for them.
*/
import React from 'react'
import PropTypes from 'prop-types'
import { Provider as ReduxProvider } from 'react-redux'

import { AppControlsContext } from './AppControlsContext'
import { AppNavigationBar } from '../widgets/AppNavigationBar'
import { AuthenticationManager } from '../utils/AuthenticationManager'
import { Contextualizer } from '../utils/Contextualizer'
import CssBaseline from '@material-ui/core/CssBaseline'
import { Feedback } from '../widgets/Feedback'
import { BrowserRouter } from 'react-router-dom'
import { ThemeContext } from './ThemeContext'
import Typography from '@material-ui/core/Typography'
import { ViewportContext, mainPaddingPlugin, widthPlugin } from '@liquid-labs/react-viewport-context'

import { makeStyles } from '@material-ui/styles'

const styles = (theme) => ({
  root : {
    height         : '100vh',
    minWidth       : '100%',
    '@media print' : {
      display : 'none',
    }
  }
})
const useMyStyles = makeStyles(styles)

const viewportInfoPlugins = [ mainPaddingPlugin, widthPlugin ]

// TODO https://github.com/Liquid-Labs/catalyst-core-ui/issues/7
// TODO https://github.com/Liquid-Labs/catalyst-core-ui/issues/8
const AppContext = ({themeRouter, reduxStore, children}) => {
  const classes = useMyStyles()
  return (
    <BrowserRouter>
      <ThemeContext themeRouter={themeRouter}>
        <ViewportContext plugins={viewportInfoPlugins}>
          <Typography component="div" className={classes.root}>
            <CssBaseline />
            <Feedback>
              <AuthenticationManager>
                <Contextualizer>
                  <AppControlsContext>
                    <ReduxProvider store={reduxStore}>
                     {children}
                    </ReduxProvider>
                  </AppControlsContext>
                </Contextualizer>
              </AuthenticationManager>
            </Feedback>
          </Typography>
        </ViewportContext>
      </ThemeContext>
    </BrowserRouter>
  )
}

if (process.env.NODE_ENV !== 'production') {
  AppContext.propTypes = {
    children    : PropTypes.node.isRequired,
    reduxStore  : PropTypes.object.isRequired,
    themeRouter : PropTypes.array.isRequired
  }
}

export { AppContext }
