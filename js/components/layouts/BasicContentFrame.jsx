import React from 'react'

import { AppMain } from './AppMain'
import { AppMenuBar } from '../widgets/AppMenuBar'
import Grid from '@material-ui/core/Grid'

import { useTheme } from '@material-ui/styles'

import merge from 'lodash.merge'

// TODO https://github.com/Liquid-Labs/catalyst-core-ui/issues/4
const BasicContentFrame = ({children, AppMenuBarProps={}, ...props}) => {
  const theme = useTheme()
  const menuHeight = theme.layout.header.variant === 'dense' ? 36 : 64
  const navHeight = theme.layout.navigation.visible ? 56 : 0
  const ctrlsHeight = menuHeight + navHeight

  merge(AppMenuBarProps, theme?.layout?.header?.props)

  return (<>
    <AppMenuBar {...AppMenuBarProps}>
      {AppMenuBarProps.children}
    </AppMenuBar>
    <AppMain {...props} style={{ maxHeight: `calc(100vh - ${ctrlsHeight}px)`}}>
      {children}
    </AppMain>
  </>
  )
}

export { BasicContentFrame }
