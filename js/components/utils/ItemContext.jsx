import React, { createContext, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

const MyContext = createContext()

const useItemContextAPI = () => useContext(MyContext)

const ItemContext = ({ item:propItem, children }) => {
  const [ item, setItem ] = useState(propItem)

  const api = useMemo(() => ({
    getItem        : () => item,
    setItem        : (newItem) => setItem(newItem),
    updateItemData : (data) => item && setItem(item.update(data)),
    isItemReady    : () => Boolean(item),
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
