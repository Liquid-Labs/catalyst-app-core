import React from 'react'

import { AppMain } from './AppMain'
import { AppNavigation } from './AppNavigation'

// TODO https://github.com/Liquid-Labs/catalyst-core-ui/issues/4
const BasicContentFrame = ({children, navChildren, navLogoTo, navRightChildren, navShowChildren, AppNavigationProps, ...remainder}) => [
  <AppNavigation key="appNavigation"
      showChildren={navShowChildren}
      logoTo={navLogoTo}
      rightChildren={navRightChildren}
      {...AppNavigationProps}>
    {navChildren || AppNavigationProps.children}
  </AppNavigation>,
  <AppMain key="appMain" {...remainder}>
    {children}
  </AppMain>
]

export { BasicContentFrame }
