// TODO: want the following, but tried https://babeljs.io/docs/en/babel-plugin-transform-export-extensions/ and had trouble getting it working.
// export * as config from './config'
// Or (maybe better) find way enable path-based importing relative to dist... not sure
import * as config from './config'
export { config }

import * as store from './store'
export { store }

import * as uiRoutes from './uiRoutes'
export { uiRoutes }

import * as appActions from './actions/appActions'
import * as contextActions from './actions/contextActions'
import * as resourceActions from './actions/resourceActions'
import * as sessionActions from './actions/sessionActions'
export { appActions, contextActions, resourceActions, sessionActions }

export * from './CommonResourceConf'
