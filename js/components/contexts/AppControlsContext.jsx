import React, { createContext, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

const MyContext = createContext()

const useAppControlsAPI = () => useContext(MyContext)

const AppControlsContext = ({children}) => {
  const [ controls, setControls ] = useState(null)
  const [ data, setData ] = useState(null)

  const api = useMemo(() => ({
    setControls : (node) => setControls(node),
    getControls : () => data,
    setData     : (refresh) => setData(refresh),
    getData     : () => data
  }), [ controls, setControls, data, setData ])

  return (
    <MyContext.Provider value={api}>
      {children}
    </MyContext.Provider>
  )
}

if (process.env.NODE_ENV !== 'production') {
  AppControlsContext.propTypes = {
    children : PropTypes.node.isRequired,
  }
}

export { AppControlsContext, useAppControlsAPI }
