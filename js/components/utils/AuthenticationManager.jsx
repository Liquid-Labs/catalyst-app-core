/**
 * The AuthenticationManager establishes the authentication status of the user.
 * The AM displays either a loading screen, error message, or the `children`
 * render prop if authentication status is respectivel pending, blocked, or
 * resolved.
 */
import React, { useEffect, useState, useContext } from 'react'
import PropTypes from 'prop-types'

import { useFeedbackAPI } from '../widgets/Feedback'

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

// Initially registering the user will cause the user to be logged in, which
// will change the auth state. But, the reg process may have more to do (like
// updating the new user with a 'dislay name'), and so we track 'postAuthGates'.
const postAuthGates = []

// After authentication with firebase, we need to pull the 'Person' data from
// the main database.
const postAuthentication = async(authUser, setAuthenticationStatus, addInfoMessage, addErrorMessage) => {
  try {
    const tokenInfo = await authUser.getIdTokenResult()
    const authToken = tokenInfo.token
    const authId = authUser.uid

    try {
      await Promise.all(postAuthGates) // see note on 'postAuthGates'
      // TODO: we really want the status here because if it's not 404/NOT_FOUND,
      // then we'll want to handle differently
      // see https://github.com/Liquid-Labs/catalyst-core-api/issues/2
      let { data:person } = await resources.fetchItemBySource(`/persons/auth-id-${authId}/`, authToken)
      // This is expected if the user was just created
      if (!person) {
        const newPersonModel = new Person({
          displayName : authUser.displayName,
          active      : true,
          authId      : authId,
          email       : authUser.email
        })
        try {
          const { errorMessage, data:newPerson } = await
          resources.createItem(newPersonModel, authToken)
          if (newPerson) person = newPerson
          else {
            handlePostAuthError(
              'User partially created. Try logging in again. Contact customer support if problems persist.',
              `Error creating 'persons' record: ${errorMessage || "Hmm... no error message provided (fishy)."}`,
              null, setAuthenticationStatus, addErrorMessage)
          }
        }
        catch (error) {
          handlePostAuthError(
            'User partially created. Try logging in again. Contact customer support if problems persist.',
            'Error getting authentication token',
            error, setAuthenticationStatus, addErrorMessage)
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
      addInfoMessage(`Logged in as '${authUser.email}'.`)
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
  const { addErrorMessage, addInfoMessage } = useFeedbackAPI()
  const [ authenticationStatus, setAuthenticationStatus ] =
    useState(initialAuthentiactionStatus)

  const api = {
    logOut : async() => {
      try {
        await fireauth.logOut()
        addInfoMessage('Logout successful.')
      }
      catch (err) {
        addErrorMessage(`Error while logging out: ${err}`)
      }
    },
    setAuthPerson : (person) =>
      setAuthenticationStatus(Object.assign(
        {}, authenticationStatus, { authPerson : person })),
    // TODO: should 'synhronize' these
    addPostAuthGate    : (promise) => postAuthGates.push(promise),
    removePostAuthGate : (promise) => {
      const i = postAuthGates.indexOf()
      if (i === -1) return false
      else {
        postAuthGates.splice(i, 1)
        return true
      }
    }
  }

  // We set up the listener on mount.
  useEffect(() => {
    fireauth.onAuthStateChanged((authUser) => {
      if (authUser) {
        postAuthentication(authUser, setAuthenticationStatus, addInfoMessage, addErrorMessage)
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
