/*
* `AppFrame` provides a standard, top-level application layout consisting of a
* fixed menu bar on top, a fixed navigation bar on bottom, and a content area
* in between.
*/
import React from 'react'
import PropTypes from 'prop-types'

import { AppMain } from './AppMain'
import { AppMenuBar } from '../widgets/AppMenuBar'
import { AppNavigationBar } from '../widgets/AppNavigationBar'

import { useTheme } from '@material-ui/styles'

// TODO https://github.com/Liquid-Labs/catalyst-core-ui/issues/4
const AppFrame = ({ContentRouter, ...props}) => {
  const theme = useTheme()
  const headerProps = theme?.layout?.header?.props || {}

  //<div style={{ minHeight : '100vh' }} {...props}>
  return (
    <div id="appRootFrame" style={{ minHeight : '100vh', display : 'flex' }} {...props}>
      <AppMain>
        <AppMenuBar {...headerProps} />
        <ContentRouter />
      </AppMain>
      <AppNavigationBar />
    </div>
  )
}

if (process.env.NODE_ENV !== 'production') {
  AppFrame.propTypes = {
    ContentRouter : PropTypes.element.isRequired
  }
}

export { AppFrame }
