export const signIn = (authUser, tokenInfo) => ({
  type: 'SIGN_IN',
  authUser: authUser,
  tokenInfo: tokenInfo
})

export const signOut = () => ({ type: 'SIGN_OUT' })
