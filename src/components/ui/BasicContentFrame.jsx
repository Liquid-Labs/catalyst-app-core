import React from 'react'

import { AppMain } from './AppMain'
import { AppNavigation } from './AppNavigation'

const BasicContentFrame = ({logoTo, navChildren, children}) => [
  <AppNavigation logoTo={logoTo} key="appNavigation">
    {navChildren}
  </AppNavigation>,
  <AppMain key="appMain">
    {children}
  </AppMain>
]

export { BasicContentFrame }
