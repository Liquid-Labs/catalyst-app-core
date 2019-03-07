/**
 * The AuthenticationManager establishes the authentication status of the user.
 * The AM displays either a loading screen, error message, or the `children`
 * render prop if authentication status is respectivel pending, blocked, or
 * resolved.
 */
import React, { useEffect, useState, useContext } from 'react'
import PropTypes from 'prop-types'

import { FeedbackContext } from '../ui/Feedback'

import { Waiter, waiterStatus } from '@liquid-labs/react-waiter'

import { fireauth } from '@liquid-labs/catalyst-firewrap'

const initialAuthenticationState = {
  authUser  : null,
  authToken : null,
  claims    : [],
  resolved  : false,
  error     : null,
  logOut    : () => fireauth.signOut()
}

const AuthenticationContext = React.createContext(initialAuthenticationState)

const statusCheck = ({resolved, error}) =>
  error !== null
    ? { status  : waiterStatus.BLOCKED,
      summary : "is blocked on error form auth provider (firebase). Ensure you have a good network connection." }
    : resolved
      ? { status  : waiterStatus.RESOLVED,
        summary : "has received response from auth provider (firebase)." }
      : { status  : waiterStatus.WAITING,
        summary : "is waiting on response from auth provider (firebase)..." }

const checks = [statusCheck]

const AuthenticationManager = ({children, ...props}) => {
  const { addErrorMessage } = useContext(FeedbackContext)
  const [ authenticationStatus, setAuthenticationStatus ] =
    useState(initialAuthenticationState)

  // We set up the listener on mount.
  useEffect(() => {
    fireauth.onAuthStateChanged((authUser) => {
      if (authUser) {
        authUser.getIdTokenResult().then(function(tokenInfo) {
          setAuthenticationStatus({
            ...initialAuthenticationState,
            authUser  : authUser,
            authToken : tokenInfo.token,
            claims    : tokenInfo.claims,
            resolved  : true,
          })
        })
          .catch(function(error) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn('Error getting authentication token', error) // eslint-disable-line no-console
            }
            addErrorMessage("Could not get token info; login invalidated.")
            setAuthenticationStatus({
              ...initialAuthenticationState,
              resolved : true,
              error    : error
            })
          })
      }
      else {
        setAuthenticationStatus({
          ...initialAuthenticationState,
          resolved : true
        })
      }
    })
  }, [])

  return (
    <AuthenticationContext.Provider value={authenticationStatus}>
      <Waiter name="Authentication verification"
          checks={checks} checkProps={authenticationStatus} {...props}>
        { typeof children === 'function' ? children(props) : children }
      </Waiter>
    </AuthenticationContext.Provider>
  )
}

if (process.env.NODE_ENV !== 'production') {
  AuthenticationManager.propTypes = {
    children : PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired
  }
}

export { AuthenticationManager, AuthenticationContext }
