import { combineReducers } from 'redux';
import appReducer from './appReducer';
import contextReducer from './contextReducer'
import resourceReducer from './resourceReducer'
import sessionReducer from './sessionReducer'

export default combineReducers(
  Object.assign(
    {
      appState :              appReducer,
      contextState :          contextReducer,
      sessionState :          sessionReducer,
      resourceState:          resourceReducer,
    }
  )
);
