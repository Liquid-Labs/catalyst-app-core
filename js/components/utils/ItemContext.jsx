import React, { createContext, useContext, useMemo, useState } from 'react'

const MyContext = createContext()

const useItemContextAPI = () => useContext(MyContext)

const ItemContext = ({ item:propItem, children }) => {
  const [ item, setItem ] = useState(propItem)

  const api = useMemo(() => ({
    getItem        : () => item,
    updateItemData : (data) => item && setItem(item.update(data)),
    isItemReady    : () => Boolean(item),
  }), [ item ])

  return (
    <MyContext.Provider value={api}>
      {children}
    </MyContext.Provider>
  )
}

export { ItemContext, useItemContextAPI }
