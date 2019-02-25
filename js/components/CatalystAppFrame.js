/**
 * Component to provide feedback to user. Uses a Snackbar component to display
 * user feedback in a dismissable box. Currently displays all messages in a
 * single element, though future versions will display (and style) messages
 * individually.
 *
 * We setup the header and bottom navigation as fixed elements using flexbox.
 * This can probably be replicated using 'Grid's and the fact that the header
 * is rendered as part of the AppSwitch result is not idea... but it's how we
 * get the top toolbar to match up with the main content. The techinque is
 * based off this: https://codepen.io/anthonyLukes/pen/DLBeE by Anthony Lukes
 *
 * Any child components will be rendered beneath the BottomNavigation component.
 * In practice, this is primarily intended for dialog components that are
 * are either hidden or rendered absolutely.
 */
import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Provider as ReduxProvider } from 'react-redux'

import { AuthenticationManager } from './util/AuthenticationManager'
import { Contextualizer } from './util/Contextualizer'
import CssBaseline from '@material-ui/core/CssBaseline'
import { Feedback } from './ui/Feedback'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { BrowserRouter, Route } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'

import { withStyles } from '@material-ui/core/styles'

const styles = (theme) => ({
  root : {
    height         : '100vh',
    minWidth       : '100%',
    '@media print' : {
      display : 'none',
    }
  }
})

const CatalystAppFrame = withStyles(styles)(({classes, theme, ContentSwitch, BottomNavigation, reduxStore}) => {
  const renderFrame = useCallback(() =>
    <div style={{display : 'flex', flexDirection : 'column', height : '100%'}}>
      <div style={{flex : '1 1 auto', display : 'flex', flexDirection : 'column'}}>
        <ContentSwitch />
      </div>
      <div style={{flex : '0 0 auto'}}>
        <BottomNavigation />
      </div>
    </div>,
  [ ContentSwitch, BottomNavigation ])

  return (
    <MuiThemeProvider theme={theme}>
      <Typography component="div" className={classes.root}>
        <CssBaseline />
        <Feedback>
          <BrowserRouter>
            <AuthenticationManager>
              <Contextualizer>
                <ReduxProvider store={reduxStore}>
                  <Route path="/" render={renderFrame} />
                </ReduxProvider>
              </Contextualizer>
            </AuthenticationManager>
          </BrowserRouter>
        </Feedback>
      </Typography>
    </MuiThemeProvider>
  )
})

if (process.env.NODE_ENV !== 'production') {
  CatalystAppFrame.propTypes = {
    BottomNavigation : PropTypes.func.isRequired,
    ContentSwitch    : PropTypes.func.isRequired,
    reduxStore       : PropTypes.object.isRequired,
    theme            : PropTypes.object.isRequired
  }
}

export { CatalystAppFrame }
