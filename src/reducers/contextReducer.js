const INITIAL_STATE = {
  contextSet: false,
  serviceLocation: null,
  store: null,
  contextError: false
}

const contextReducer = (currentState = INITIAL_STATE, action) => {
  switch (action.type) {
    case ('SET_SERVICE_LOCATION_CONTEXT'):
      return {
        ...currentState,
        contextSet: true,
        serviceLocation: action.serviceLocation,
        store: null,
        contextError: false
      };
    case ('SET_STORE_CONTEXT'):
      return {
        ...currentState,
        contextSet: true,
        serviceLocation: null,
        store: action.store,
        contextError: false
      };
    case ('SET_GLOBAL_CONTEXT'):
    case ('SET_NO_CONTEXT'):
      return {
        ...currentState,
        contextSet: true,
        serviceLocation: null,
        store: null,
        contextError: false
      }
    case ('SET_CONTEXT_ERROR'):
      return {
        ...INITIAL_STATE,
        contextError: true
      };
    case ('RESET'):
    case ('RESET_CONTEXT'): // TODO: this is used both on SignIn (which should completely) and ContextReset, which should reset back to base state; can optimize for second
    case ('SIGN_IN'): // Actions from the session state; a change in auth status necessrily resets the context
    case ('SIGN_OUT'):
      return INITIAL_STATE;
    default:
      return currentState;
   }
}

export default contextReducer;
