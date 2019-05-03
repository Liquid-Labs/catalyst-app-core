import React, { useContext } from 'react'

import { userUserContext } from '../contexts/UserContext'

import IconButton from '@material-ui/core/IconButton'
import RestoreIcon from 'mdi-material-ui/Restore'

/**
 * Displays icon control to reset the current context. This is used by Admins
 * and Coordinators.
 */
const ContextReset = () => {
  const { resetContext } = useUserContext()

  return (<IconButton onClick={resetContext}><RestoreIcon /></IconButton>)
}

export { ContextReset }
