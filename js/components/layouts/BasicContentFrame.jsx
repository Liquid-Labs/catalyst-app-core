import React from 'react'

import { AppMain } from './AppMain'
import { AppNavigation } from './AppNavigation'

// TODO: handle 'navLogoTo' in 'AppNavigation' via settings. This is not
// something we need to handle changing constantly.
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
