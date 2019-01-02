export const setServiceLocationContext = (serviceLocation) => ({
  type            : 'SET_SERVICE_LOCATION_CONTEXT',
  serviceLocation : serviceLocation
})

export const setStoreContext = (store) => ({
  type  : 'SET_STORE_CONTEXT',
  store : store
})

export const setGlobalContext = () => ({ type : 'SET_GLOBAL_CONTEXT' })

export const setNoContext = () => ({ type : 'SET_NO_CONTEXT' })

export const resetContext = () => ({ type : 'RESET_CONTEXT' })

export const setContextError = (message) =>
  ({ type : 'SET_CONTEXT_ERROR', message : message })
