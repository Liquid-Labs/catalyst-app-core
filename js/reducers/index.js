import appReducer from './appReducer'
import contextReducer from './contextReducer'
import resourceReducer from './resourceReducer'

export const coreReducers = {
  appState      : appReducer,
  contextState  : contextReducer,
  resourceState : resourceReducer,
}
