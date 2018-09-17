const INITIAL_STATE = {
  authResolved: false,
  authUser: null,
  authToken: null,
  claims: []
};

function sessionReducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case 'SIGN_IN' :
      return {
        ...state,
        authResolved: true,
        authUser: action.authUser,
        authToken: action.tokenInfo.token,
        claims: action.tokenInfo.claims
      }
    case ('SIGN_OUT'):
      return {
        ...state,
        authResolved: true,
        authUser: null,
        authToken: null,
        claims: []
      }
    case ('RESET'):
      return INITIAL_STATE;
    default : return state;
  }
}

export default sessionReducer;
