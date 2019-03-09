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
import { resources } from '@liquid-labs/catalyst-core-api'
import { Person } from '@liquid-labs/catalyst-persons-api'

const initialAuthentiactionStatus = {
  person    : null,
  authUser  : null,
  authToken : null,
  claims    : [],
  resolved  : false,
  error     : null
}

const AuthenticationStatusContext =
  React.createContext(initialAuthentiactionStatus)
const useAuthenticationStatus = () => useContext(AuthenticationStatusContext)

const AuthenticationAPIContext = React.createContext()
const useAuthenticationAPI = () => useContext(AuthenticationAPIContext)

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

const handlePostAuthError = (userMsg, devMsg, authError, setAuthenticationStatus, addErrorMessage) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(devMsg, 'Auth error: ', authError) // eslint-disable-line no-console
  }
  addErrorMessage(userMsg)
  if (authError) {
    setAuthenticationStatus({
      ...initialAuthentiactionStatus,
      resolved : true,
      error    : authError
    })
  }
}

// After authentication with firebase, we need to pull the 'Person' data from
// the main database.
const postAuthentication = async(authUser, setAuthenticationStatus, addErrorMessage) => {
  console.log("In postAuthentication")
  try {
    const tokenInfo = await authUser.getIdTokenResult()
    const authToken = tokenInfo.token
    const authId = authUser.uid

    try {
      console.log("trying fetch")
      // TODO: we really want the status here because if it's not 404/NOT_FOUND, then we'll want to handle differently
      // see https://github.com/Liquid-Labs/catalyst-core-api/issues/2
      // TODO: potentially treat 'null' as 404 indicator? as a bridge?
      let { data:person } = resources.fetchItemBySource(`/persons/auth-id-${authId}/`, authToken)
      console.log("got: ", person)
      // This is expected if the user was just created
      if (!person) {
        console.log('creating person based on authUser: ', authUser)
        const newPersonModel = new Person({
          displayName : authUser.displayName,
          authId : authId,
          email  : authUser.email
        })
        try {
          const { errorMessage, ...rest } = await
            resources.createItem(newPersonModel, authToken)
          console.log('rest: ', rest)
          if (errorMessage) {
            handlePostAuthError(
              'User partially created. Try logging in again. Contact customer support if problems persist.',
              `Error creating 'persons' record: ${errorMessage}`,
              null, setAuthenticationStatus, addErrorMessage)
          }
        }
        catch (error) {
          handlePostAuthError(
            'User partially created. Try logging in again. Contact customer support if problems persist.',
            'Error getting authentication token',
            error, setAuthenticationStatus, addErrorMessage)
          return
        }
      }

      setAuthenticationStatus({
        ...initialAuthentiactionStatus,
        person    : person,
        authUser  : authUser,
        authToken : authToken,
        claims    : tokenInfo.claims,
        resolved  : true,
      })
    }
    catch (error) { // We treat this as coming from the 'fetchItemBySource'
      handlePostAuthError(
        'Could not retrieve user data. Check your network connection and try logging in again.',
        'Error (most likely) while fetching person data.',
        error, setAuthenticationStatus, addErrorMessage)
    }
  }
  catch(error) {
    handlePostAuthError(
      'Could not get token info; login invalidated.',
      'Error getting authentication token',
      error, setAuthenticationStatus, addErrorMessage)
  }
}

const AuthenticationManager = ({children, ...props}) => {
  const { addErrorMessage } = useContext(FeedbackContext)
  const [ authenticationStatus, setAuthenticationStatus ] =
    useState(initialAuthentiactionStatus)
  const api = {
    logOut        : () => fireauth.logOut(),
    setAuthPerson : (person) =>
      setAuthenticationStatus(Object.assign(
        {}, authenticationStatus, { authPerson : person}))
  }

  // We set up the listener on mount.
  useEffect(() => {
    fireauth.onAuthStateChanged((authUser) => {
      if (authUser) {
        postAuthentication(authUser, setAuthenticationStatus, addErrorMessage)
      }
      else {
        setAuthenticationStatus({
          ...initialAuthentiactionStatus,
          resolved : true
        })
      }
    })
  }, [])

  return (
    <AuthenticationStatusContext.Provider value={authenticationStatus}>
      <AuthenticationAPIContext.Provider value={api}>
        <Waiter name="Authentication verification"
            checks={checks} checkProps={authenticationStatus} {...props}>
          { typeof children === 'function' ? children(props) : children }
        </Waiter>
      </AuthenticationAPIContext.Provider>
    </AuthenticationStatusContext.Provider>
  )
}

if (process.env.NODE_ENV !== 'production') {
  AuthenticationManager.propTypes = {
    children : PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired
  }
}

export { AuthenticationManager, useAuthenticationStatus, useAuthenticationAPI }
