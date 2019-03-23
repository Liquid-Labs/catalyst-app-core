import React, { createContext, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import { Model } from '@liquid-labs/catalyst-core-api'

const MyContext = createContext()

const useItemContextAPI = () => useContext(MyContext)

const ItemContext = ({ item:propItem, children }) => {
  const [ item, setItem ] = useState(propItem)
  const [ isItemUpdating, setIsItemUpdating ] = useState(false)

  const api = useMemo(() => ({
    getItem : () => item,
    setItem : (newItem) => {
      if (process.env.NODE_ENV !== 'production') {
        if (newItem !== null && !(newItem instanceof Model)) {
          // eslint-disable-next-line no-console
          console.error(`'setItem' called with non-null, non-Model item:`, newItem)
          console.trace() // eslint-disable-line no-console
        }
      }
      setItem(newItem)
    },

    isItemUpdating    : () => isItemUpdating,
    setIsItemUpdating : (bool) => setIsItemUpdating(bool),

    isItemReady : () => Boolean(item) && !isItemUpdating,
  }), [ item, setItem ])

  return (
    <MyContext.Provider value={api}>
      {children}
    </MyContext.Provider>
  )
}

if (process.env.NODE_ENV !== 'production') {
  ItemContext.propTypes = {
    item     : PropTypes.object,
    children : PropTypes.node.isRequired,
  }
}

export { ItemContext, useItemContextAPI }
