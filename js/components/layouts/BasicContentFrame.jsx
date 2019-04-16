import React from 'react'

import { AppMain } from './AppMain'
import { AppNavigation } from './AppNavigation'

// TODO https://github.com/Liquid-Labs/catalyst-core-ui/issues/4
const BasicContentFrame = ({children, AppNavigationProps, ...remainder}) => [
  <AppNavigation key="appNavigation" {...AppNavigationProps}>
    {AppNavigationProps.children}
  </AppNavigation>,
  <AppMain key="appMain" {...remainder}>
    {children}
  </AppMain>
]

export { BasicContentFrame }
