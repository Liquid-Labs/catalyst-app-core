export const setContext = (context) => ({
  type    : 'SET_CONTEXT',
  context : context
})

export const setAdminContext = () => ({ type : 'SET_ADMIN_CONTEXT' })

export const setNoContext = () => ({ type : 'SET_NO_CONTEXT' })

export const resetContext = () => ({ type : 'RESET_CONTEXT' })

export const setContextError = (message) =>
  ({ type : 'SET_CONTEXT_ERROR', message : message })
