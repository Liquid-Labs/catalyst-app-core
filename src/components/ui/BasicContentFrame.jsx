import React from 'react'

import { AppMain } from './AppMain'
import { AppNavigation } from './AppNavigation'

const BasicContentFrame = ({children}) => [
  <AppNavigation key="appNavigation" />,
  <AppMain key="appMain">
    {children}
  </AppMain>
]

export { BasicContentFrame }
