import {createStore, compose, applyMiddleware} from 'redux'
import followupActionMiddleware from '@liquid-labs/redux-followup'
import thunk from 'redux-thunk'

import rootReducer from '../reducers'

export default function configureStore(initialState) {
  let middlewares = [
    thunk, // TODO: do we use thunk?
    followupActionMiddleware
  ]
  if (process.env.NODE_ENV !== 'production') {
      // const { logger } = require('redux-logger')
      // middlewares = [ ...middlewares, logger ]
  }
  const store = createStore(rootReducer, initialState, compose(
      applyMiddleware(...middlewares),
      window.devToolsExtension ? window.devToolsExtension() : f => f // add support for Redux dev tools
    ))
  if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('../reducers', () => {
        const nextReducer = require('../reducers').default // eslint-disable-line global-require
        store.replaceReducer(nextReducer)
      })
    }
  return store
}
