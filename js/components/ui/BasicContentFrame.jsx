import React from 'react'

import { AppMain } from './AppMain'
import { AppNavigation } from './AppNavigation'

// TODO: put navChildren, rightNav, and logoTo on 'AppNavigationProps'
const BasicContentFrame = ({children, navChildren, AppNavigationProps, ...remainder}) => [
  <AppNavigation key="appNavigation" {...AppNavigationProps}>
    {navChildren || AppNavigationProps.children}
  </AppNavigation>,
  <AppMain key="appMain" {...remainder}>
    {children}
  </AppMain>
]

export { BasicContentFrame }
