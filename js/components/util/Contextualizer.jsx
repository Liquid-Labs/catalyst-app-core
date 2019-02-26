import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

// TODO: use this to verify that the context selected is valid
// import { contextConfig } from '@liquid-labs/catalyst-core-api'

import { awaitStatus } from '@liquid-labs/react-await'
import { Await } from '../Await'
import { AuthenticationContext } from './AuthenticationManager'
import { FeedbackContext } from '../ui/Feedback'

const initialAppContextState = {
  appContext : undefined,
  error      : null
}

const AppContext = createContext(initialAppContextState.appContext)

const statusCheck = ({appContext, error}) =>
  error !== null
    ? { status  : awaitStatus.BLOCKED,
      summary : "is blocked on error while resolving application context." }
    : appContext !== null
      ? { status  : awaitStatus.RESOLVED,
        summary : "has resolved application context." }
      : { status  : awaitStatus.WAITING,
        summary : "is waiting to resolve application context..." }

const checks = [statusCheck]

const Contextualizer = ({children, resolveDefaultContext, ...props}) => {
  const [ appContextState, setAppContextState ] = useState(initialAppContextState)
  const { addErrorMessage } = useContext(FeedbackContext)
  const { authUser, claims } = useContext(AuthenticationContext)

  useEffect(() => {
    if (!appContextState.error && appContextState.appContext === undefined) {
      if (resolveDefaultContext) {
        resolveDefaultContext(authUser, claims)
          .then(({appContext, error}) => {
            if (error) {
              addErrorMessage(error)
              setAppContextState({...appContextState, error : error})
            }
            else {
              setAppContextState({...appContextState, appContext : appContext})
            }
          })
      }
      else {
        // authUser may be null
        setAppContextState({...appContextState, appContext : authUser})
      }
    }
  }, [appContextState, authUser, claims])

  const contextApi = useMemo(() => ({
    appContext    : appContextState.appContext,
    resetContext  : () => setAppContextState({appContext : null, ...appContextState}),
    setAppContext : (appContext) =>
      setAppContextState({appContext : appContext, ...appContextState})
  }))

  return (
    <AppContext.Provider value={contextApi}>
      <Await name="Contextualizer"
          checks={checks} checkProps={appContextState} {...props}>
        { typeof children === 'function' ? children(props) : children }
      </Await>
    </AppContext.Provider>
  )
}

if (process.env.NODE_ENV !== 'production') {
  Contextualizer.propTypes = {
    children              : PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    resolveDefaultContext : PropTypes.func
  }
}

export { Contextualizer, AppContext }
