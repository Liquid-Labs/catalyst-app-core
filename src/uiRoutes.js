import { uuidRe } from '@liquid-labs/regex-repo'
import { config } from './config'

const splitPath = (path) => {
  const [pathName, query] = path.split('?')
  const bits = pathName.split('/')
  // Canonical path names work start with '/'
  if (bits[0] === '') {
    bits.splice(0, 1)
  }
  else {
    throw new Error(`Cannot extract resource from a non-canonical path: '${path}''.`)
  }

  return { bits, query }
}

export const isListView = (path) => {
  const { bits } = splitPath(path)
  return Boolean((bits.length === 1 && config.resources[bits[0]])
    || (bits.length === 3
        && config.resources[bits[0]]
        && uuidRe.test(bits[1])
        && config.resources[bits[2]]))
}

export const isItemRoute = (path) => {
  const { bits } = splitPath(path)
  return uuidRe.test(bits[1])
    && (bits.length === 2 || (bits.length === 3 && bits[2] === 'edit'))
}

/**
 * Extracts the final (displayed) resource from a UI path based on soley on
 * structure. In particular, does not check whether the resource is valid for
 * the app.
 */
export const extractResource = (path) => {
  const { bits } = splitPath(path)

  if (bits.length === 1 // global list
      || (bits.length === 2
          && (bits[1] === 'create' || uuidRe.test(bits[1]))) // create  or veiew item
      || (bits.length === 3 && bits[2] === 'edit')) { // edit item
    return bits[0]
  }
  else if (bits.length === 3 // context access
    // valid entity IDs
    && (uuidRe.test(bits[1]) || (bits[0] === 'users' && bits[1] === 'self'))) {
    return bits[2]
  }
  else return null
}

export const extractListContext = (path) => {
  const { bits } = splitPath(path)

  if (bits.length === 1 // global list
      || (bits.length === 2
          && (bits[1] === 'create' || uuidRe.test(bits[1]))) // create  or veiew item
      || (bits.length === 3 && bits[2] === 'edit')) { // edit item
    return null
  }
  else if (bits.length === 3 && uuidRe.test(bits[1])) { // context list
    return bits[0]
  }
  else return null
}
