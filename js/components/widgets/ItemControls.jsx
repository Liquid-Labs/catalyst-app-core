import React, { useRef } from 'react'

import Grid from '@material-ui/core/Grid'
import Collapse from '@material-ui/core/Collapse'
import { IconControl,
  CTRL_RANK_PRIMARY, CTRL_RANK_SECONDARY,
  CTRL_DANGER_DANGEROUS, CTRL_DANGER_SAFE } from './IconControl'

import CancelIcon from '@material-ui/icons/CancelOutlined'
import CreateIcon from '@material-ui/icons/AddBox'
import EditIcon from '@material-ui/icons/Edit'
import RestoreIcon from 'mdi-material-ui/Restore'
import SaveIcon from '@material-ui/icons/SaveAlt'

import { resources, resourcesSettings } from '@liquid-labs/catalyst-core-api'
import * as uiPaths from '@liquid-labs/restful-paths'
import { useAuthenticationStatus } from '../utils/AuthenticationManager'
import { useFeedbackAPI } from './Feedback'
import { useItemContextAPI } from '../contexts/ItemContext'
import { useValidationAPI } from '@liquid-labs/react-validation'

import { withRouter } from 'react-router-dom'

const colorTransition = {
  // TODO: pull the timing from theme. Thats transition.duration.complex
  style : { transition : 'color 375ms linear 0ms, background-color 375ms linear 0ms' }
}

const primaryProps = { rank : CTRL_RANK_PRIMARY, ...colorTransition }
const secondaryProps =
  { danger : CTRL_DANGER_SAFE, rank : CTRL_RANK_SECONDARY, ...colorTransition }
const dangerousSecondary =
  { danger : CTRL_DANGER_DANGEROUS ,
    rank   : CTRL_RANK_SECONDARY,
    ...colorTransition }

const defaultInclude = ['edit', 'cancel', 'revert', 'save', 'save and close']
/* TODO https://github.com/Liquid-Labs/catalyst-core-ui/issues/3
const defaultTextLabels = {
  close              : (primOrSec) => primOrSec === CTRL_RANK_PRIMARY ? 'Done' : 'Cancel',
  create             : () => 'Create',
  edit               : () => 'Edit',
  save               : () => 'Save',
  revert             : () => 'Revert',
  'save and close'   : () => 'Save & close',
  'create and close' : () => 'Create & close',
}*/

const defaultIconLabels = {
  close  : () => <CancelIcon />,
  create : () => <CreateIcon />,
  edit   : () => <EditIcon />,
  save   : () => <SaveIcon />,
  revert : () => <RestoreIcon /> // TODO: there are 'restore' and 'undo' icons; 'restore seems the closest'
  /* TODO: not sure what to do for 'save and close' here; part of the reason we're excluding it for now; see 'TODO' note below */
}

// TOOD: add hover-popover that explains why a control is disabled. E.g., because there's no need to save or the data is invalid.
// TODO: at the moment, we only really support default 'icons' style because we render everything in an IconBottun; text should be rendered in Button
const ItemControls = withRouter(({
  onClose, onRevert, onSave, afterSave, // handlers
  // TODO https://github.com/Liquid-Labs/catalyst-core-ui/issues/3
  include=defaultInclude, exclude, // controlStyle='icons', // configurations
  // TODO: firstControls, lastControls instead of using children
  unsavedChanges, childrenBefore=false,
  createProps,
  location, history, isValid, children}) => {
  const { actionMode } = uiPaths.extractPathInfo()
  const from = location.state && location.state.from
  const vcAPI = useValidationAPI()
  const icAPI = useItemContextAPI()
  const feedbackAPI = useFeedbackAPI()
  const controlsHistory = useRef([])

  // we don't always use the authToken, but need to keep hook calls consistent.
  const { authToken } = useAuthenticationStatus()

  if (exclude) {
    exclude.forEach((exLabel) => include.splice(include.indexOf(exLabel), 1))
  }
  const isIncluded = (label) => include.indexOf(label) !== -1
  const labels = defaultIconLabels
  /* TODO https://github.com/Liquid-Labs/catalyst-core-ui/issues/3
  cost controlStyle === 'icons'
    ? defaultIconLabels
    : defaultTextLabels */

  const closeLabel = labels['close']
  const editLabel = labels['edit']
  const revertLabel = labels['revert']
  const saveLabel = actionMode === uiPaths.ACTION_MODE_CREATE
    ? labels['create']
    : labels['save']

  const hasChange =
    (unsavedChanges === undefined && vcAPI && vcAPI.isChanged())
      || unsavedChanges
  const isValidAndChanged =
    (isValid !== undefined ? isValid : vcAPI.isValid()) && hasChange

  const showEdit = isIncluded('edit')
    && actionMode === uiPaths.ACTION_MODE_VIEW
    && primaryProps
  const showClose =
    // notice the inclusion flags are 'done' and 'cancel', which are actionMode
    // dependent. The control, however, is just 'close' because it's the same
    // technical action, even though it carries different connotations for the
    // user.
    (isIncluded('done')
      && actionMode === uiPaths.ACTION_MODE_VIEW
      && primaryProps)
    || (isIncluded('cancel') && actionMode !== uiPaths.ACTION_MODE_VIEW
        && ((hasChange && dangerousSecondary) || secondaryProps))
  // Reversion doesn't make sense for 'view' or 'create, only edit'
  const showRevert = isIncluded('revert')
    && actionMode === uiPaths.ACTION_MODE_EDIT && dangerousSecondary
  // If we are creating and have from, then 'save and close' makes more sense.
  const showSave = isIncluded('save')
    && actionMode !== uiPaths.ACTION_MODE_VIEW
    && primaryProps
  const fingerprint =
    ((showEdit && 1) || 0)
    | ((showClose && 2) || 0)
    | ((showRevert && 4) || 0)
    | ((showSave && 8) || 0)
  const lastFingerprint = useRef([])

  const currPath = window.location.pathname

  // setup the handlers, as necessary
  if (!onClose && showClose) {
    if (process.env.NODE_ENV !== 'production') {
      if (!from) {
        // eslint-disable-next-line no-console
        console.error("You must either define 'from' on the 'locataion.state' or provide an explicit 'onClose' handler to support the 'Cancel' control in 'ItemControls.'")
      }
    }
    onClose = () => {
      vcAPI.resetData()
      history.push(from)
    }
  }
  if (!onRevert && vcAPI) onRevert = () => vcAPI.resetData()

  if (!onSave
      && vcAPI
      && icAPI
      && (actionMode === uiPaths.ACTION_MODE_CREATE
          || actionMode === uiPaths.ACTION_MODE_EDIT)) {
    onSave = async() => {
      icAPI.setIsItemUpdating(true)
      const getNewItem = () => icAPI.getItem().update(vcAPI.getData())

      const requestSave = actionMode === uiPaths.ACTION_MODE_CREATE
        ? async() => {
          const createItem = getNewItem()
          const newStruct = resourcesSettings.prepareCreate
            ? resourcesSettings.prepareCreate(createItem.forApi(), createProps)
            : createItem.forAPI()
          return resources.createItem(newStruct, authToken)
        }
        : async() => /* then acitonMode === 'edit' */
          resources.updateItem(getNewItem().forApi(), authToken)

      const result = await requestSave()
      if (result.errorMessage !== null) {
        icAPI.setIsItemUpdating(false)
        feedbackAPI.addErrorMessage(`Attempt to save data failed: ${result.errorMessage}`)
        return // bail out
      }

      // notice afterSave may be synchronous or asynchronous
      if (afterSave) await afterSave(result.data)

      icAPI.setItem(result.data)
      icAPI.setIsItemUpdating(false)
    } // default onSave
  } // if (!onSave ...)

  if (process.env.NODE_ENV !== 'production') {
    if (showSave && !onSave) {
      // eslint-disable-next-line no-console
      console.warn(`No 'onSave' available to 'ItemControls' displaying the save-control. Either exclude the control, place controls in 'ItemContext' and 'ValidationContext', or provide explicit 'onSave'.`)
    }
    if (showRevert && !onRevert) {
      // eslint-disable-next-line no-console
      console.warn(`No 'onRevert' available to 'ItemControls' displaying the revert-control. Either exclude the control, place controls in 'ValidationContext', or provide explicit 'onRevert'.`)
    }
  }

  const isIn = { value : true }
  const toggleHide = () => isIn.value = false
  const thisKey = fingerprint !== lastFingerprint.current[0]
    ? `x${Math.random()}`
    : lastFingerprint.current[1]
  const appear = controlsHistory.current.length === 0 ? false : true
  const Controls =
    <Collapse appear={appear} timeout='auto' key={thisKey} in={isIn.value} mountOnEnter unmountOnExit onExit={() => controlsHistory.current.shift()}>
      <Grid container direction='row' justify="center">
        { childrenBefore && children }
        { showEdit && <IconControl {...showEdit} onClick={isIn.value ? (() => history.push(`${currPath}edit/`, {from : currPath})) : null}>{editLabel(showEdit.rank)}</IconControl> }
        { showClose && <IconControl {...showClose} onClick={isIn.value ? onClose : null}>{closeLabel(showClose.rank)}</IconControl> }
        { showSave && <IconControl {...showSave} disabled={!isValidAndChanged} onClick={isIn.value ? onSave : null}>{saveLabel(showSave.rank)}</IconControl> }
        { showRevert && <IconControl {...showRevert} disabled={!hasChange} onClick={isIn.value ? onRevert : null}>{revertLabel(showRevert.rank)}</IconControl> }
        { !childrenBefore && children }
      </Grid>
    </Collapse>

  if (fingerprint !== lastFingerprint.current[0]) {
    controlsHistory.current.forEach(([toggleHide]) => toggleHide())
    controlsHistory.current.push([ toggleHide, Controls ])
  }
  else {
    controlsHistory.current.pop()
    controlsHistory.current.push([ toggleHide, Controls ])
  }
  lastFingerprint.current = [fingerprint, thisKey]

  return controlsHistory.current.map(([x, Controls]) => Controls)
})

export { ItemControls }
