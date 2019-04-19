import React from 'react'

import { AppMain } from './AppMain'
import { AppMenuBar } from '../widgets/AppMenuBar'

// TODO https://github.com/Liquid-Labs/catalyst-core-ui/issues/4
const BasicContentFrame = ({children, AppMenuBarProps={}, ...remainder}) => {
  return (<>
      <AppMenuBar {...AppMenuBarProps}>
        {AppMenuBarProps.children}
      </AppMenuBar>
      <AppMain {...remainder}>
        {children}
      </AppMain>
    </>
)
}

export { BasicContentFrame }
