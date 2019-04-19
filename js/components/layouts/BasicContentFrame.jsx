import React from 'react'

import { AppMain } from './AppMain'
import { AppMenu } from '../widgets/AppMenu'

// TODO https://github.com/Liquid-Labs/catalyst-core-ui/issues/4
const BasicContentFrame = ({children, AppMenuProps={}, ...remainder}) => {
  return (<>
      <AppMenu {...AppMenuProps}>
        {AppMenuProps.children}
      </AppMenu>
      <AppMain {...remainder}>
        {children}
      </AppMain>
    </>
)
}

export { BasicContentFrame }
