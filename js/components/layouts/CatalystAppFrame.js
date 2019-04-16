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
import React from 'react'
import PropTypes from 'prop-types'
import { Provider as ReduxProvider } from 'react-redux'

import { AuthenticationManager } from '../utils/AuthenticationManager'
import { Contextualizer } from '../utils/Contextualizer'
import CssBaseline from '@material-ui/core/CssBaseline'
import { Feedback } from '../widgets/Feedback'
import { BrowserRouter } from 'react-router-dom'
import { ThemeContext } from '../contexts/ThemeContext'
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

const CatalystAppFrame = withStyles(styles)(({classes, themeRouter, ContentSwitch, BottomNavigation, reduxStore}) =>
  <BrowserRouter>
    <ThemeContext themeRouter={themeRouter}>
      <Typography component="div" className={classes.root}>
        <CssBaseline />
        <Feedback>
          <div id="appRootFrame" style={{display : 'flex', flexDirection : 'column', height : '100%'}}>
            <AuthenticationManager>
              <Contextualizer>
                <ReduxProvider store={reduxStore}>
                  <div id="appMainFrame" style={{flex : '1 1 auto', display : 'flex', flexDirection : 'column'}}>
                    <ContentSwitch />
                  </div>
                  <div id="appNavFrame" style={{flex : '0 0 auto'}}>
                    <BottomNavigation />
                  </div>
                </ReduxProvider>
              </Contextualizer>
            </AuthenticationManager>
          </div>
        </Feedback>
      </Typography>
    </ThemeContext>
  </BrowserRouter>
)

if (process.env.NODE_ENV !== 'production') {
  CatalystAppFrame.propTypes = {
    BottomNavigation : PropTypes.func.isRequired,
    ContentSwitch    : PropTypes.func.isRequired,
    reduxStore       : PropTypes.object.isRequired,
    themeRouter      : PropTypes.array.isRequired
  }
}

export { CatalystAppFrame }
