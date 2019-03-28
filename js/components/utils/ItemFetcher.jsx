import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { resources, resourcesCache } from '@liquid-labs/catalyst-core-api'
import * as uiPaths from '@liquid-labs/restful-paths'

import { useAuthenticationStatus } from './AuthenticationManager'
import { useItemContextAPI } from '../contexts/ItemContext'
import { Waiter, waiterStatus } from '@liquid-labs/react-waiter'

import upperFirst from 'lodash.upperfirst'

const waiterChecks = [ ({item, errorMessage, url}) =>
  errorMessage
    ? {
      status       : waiterStatus.BLOCKED,
      summary      : `Error encountered retrieving '${url}': '${errorMessage}'`,
      errorMessage : errorMessage
    }
    : item
      ? { status : waiterStatus.RESOLVED }
      : {
        status  : waiterStatus.WAITING,
        summary : `Waiting on response from '${url}'...`
      }
]

const resolveItem = async(resourceName, pubID, itemUrl, authToken, setCheckProps) => {
  const { data:item, errorMessage } = await resources.fetchItem(resourceName, pubID, authToken)
  setCheckProps({ item, errorMessage, url : itemUrl })
}

// TODO: itemUrl -> itemPath
const ItemFetcher = ({itemUrl, itemKey='item', children, ...props}) => {
  const waiterName = `${upperFirst(itemKey)} fetch`
  const { resourceName, pubID } = uiPaths.extractPathInfo(itemUrl)
  // TODO: handle bad URL: if (!resourceName || !pubID)
  // We check the cache synchronously to avoid blinking.
  const initialCheckProps = {item : null, errorMessage : null, url : itemUrl}
  const { permanentError } = resourcesCache.getFreshSourceData(itemUrl)
  if (permanentError) initialCheckProps.errorMessage = permanentError.message
  else initialCheckProps.item = resourcesCache.getFreshCompleteItem(pubID)

  const { authToken } = useAuthenticationStatus()
  const [ checkProps, setCheckProps ] = useState(initialCheckProps)
  const itemContextAPI = useItemContextAPI()
  if (itemContextAPI) {
    itemContextAPI.setItem(checkProps.item)
  } // else we're not in an ItemContext, and that's OK.

  useEffect(() => {
    if (!checkProps.item) resolveItem(resourceName, pubID, itemUrl, authToken, setCheckProps)
  }, [ itemUrl, itemKey, authToken ])

  // this isn't always used, but no need to memo-ize
  const childProps = {
    [itemKey] : checkProps.item
  }

  return (
    <Waiter checks={waiterChecks} checkProps={checkProps} name={waiterName} {...props}>
      { () => typeof children === 'function' ? children(childProps) : children }
    </Waiter>
  )
}

if (process.env.NODE_ENV !== 'production') {
  ItemFetcher.propTypes = {
    itemUrl     : PropTypes.string.isRequired,
    itemKey     : PropTypes.string,
    waiterProps : PropTypes.object,
    children    : PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  }
}

export { ItemFetcher }
