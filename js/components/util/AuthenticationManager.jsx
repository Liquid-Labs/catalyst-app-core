/**
 * The AuthenticationManager establishes the authentication status of the user.
 * The AM displays either a loading screen, error message, or the `children`
 * render prop if authentication status is respectivel pending, blocked, or
 * resolved.
 */
import React, { useEffect, useState, useContext } from 'react'
import PropTypes from 'prop-types'

import { FeedbackContext } from '../ui/Feedback'

import { Await } from '../Await'
import { awaitStatus } from '@liquid-labs/react-await'

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
    ? { status  : awaitStatus.BLOCKED,
      summary : "is blocked on error form auth provider (firebase). Ensure you have a good network connection." }
    : resolved
      ? { status  : awaitStatus.RESOLVED,
        summary : "has received response from auth provider (firebase)." }
      : { status  : awaitStatus.WAITING,
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
      <Await name="Authentication manager"
          checks={checks} checkProps={authenticationStatus} {...props}>
        { typeof children === 'function' ? children(props) : children }
      </Await>
    </AuthenticationContext.Provider>
  )
}

if (process.env.NODE_ENV !== 'production') {
  AuthenticationManager.propTypes = {
    children : PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired
  }
}

export { AuthenticationManager, AuthenticationContext }
