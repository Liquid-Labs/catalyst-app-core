import { configureStore } from './store/configureStore'

export const config = {}

export const setRootReducer = (rootReducer) => config.reduxStore =
  configureStore(rootReducer)

export const setBaseUrl = (baseUrl) => config.baseUrl = baseUrl

export const setResources = (resources) => config.resources = resources

export const setContexts = (contexts) => config.contexts = contexts
