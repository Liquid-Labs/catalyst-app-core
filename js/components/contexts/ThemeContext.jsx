import React from 'react'

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { ThemeProvider } from '@material-ui/styles'

import { withRouter } from 'react-router-dom'

const ThemeContext = withRouter(({location, themeRouter, children}) => {
  const theme = themeRouter.find(([pathMatcher]) =>
    pathMatcher.test(location.pathname))[1]

  if (!theme) {
    throw new Error(`No theme for path '${location.pathname}'`)
  }

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </MuiThemeProvider>
  )
})

export { ThemeContext }
