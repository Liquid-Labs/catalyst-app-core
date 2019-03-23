import React from 'react'
import { withRouter } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import { IconControl,
  CTRL_RANK_PRIMARY, CTRL_RANK_SECONDARY,
  CTRL_DANGER_DANGEROUS, CTRL_DANGER_SAFE } from './IconControl'

import CancelIcon from '@material-ui/icons/CancelOutlined'
import CreateIcon from '@material-ui/icons/AddBox'
import EditIcon from '@material-ui/icons/Edit'
import RestoreIcon from 'mdi-material-ui/Restore'
import SaveIcon from '@material-ui/icons/SaveAlt'

import { resources, resourcesSettings, routes } from '@liquid-labs/catalyst-core-api'
import { useAuthenticationStatus } from '../utils/AuthenticationManager'
import { useItemContextAPI } from '../utils/ItemContext'
import { useValidationContextAPI } from '@liquid-labs/react-validation'

const primaryProps = { rank : CTRL_RANK_PRIMARY }
const secondaryProps = { danger : CTRL_DANGER_SAFE, rank : CTRL_RANK_SECONDARY }
const dangerousSecondary =
  { danger : CTRL_DANGER_DANGEROUS , rank : CTRL_RANK_SECONDARY }

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
  close : () => <CancelIcon />,
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
  unsavedChanges, childrenBefore=false,
  createProps,
  location, history, isValid, children}) => {
  const mode = routes.getRenderMode()
  const from = location.state && location.state.from
  const vcAPI = useValidationContextAPI()
  const icAPI = useItemContextAPI()
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
  const saveLabel = mode === 'create' ? labels['create'] : labels['save']

  const showEdit = isIncluded('edit')
    && mode === 'view'
    && ((from && secondaryProps) || primaryProps)
  const showClose =
    // notice the inclusion flags are 'done' and 'cancel', which are mode
    // dependent. The control, however, is just 'close' because it's the same
    // technical action, even though it carries different connotations for the
    // user.
    (isIncluded('done') && mode === 'view' && primaryProps)
    || (isIncluded('cancel') && mode !== 'view' && dangerousSecondary)
  // Reversion doesn't make sense for 'view' or 'create, only edit'
  const showRevert = isIncluded('revert')
    && mode === 'edit' && dangerousSecondary
  // If we are creating and have from, then 'save and close' makes more sense.
  const showSave = isIncluded('save') && mode !== 'view' && primaryProps

  const hasChange =
    (unsavedChanges === undefined && vcAPI && vcAPI.isChanged())
      || unsavedChanges
  const isValidAndChanged =
    (isValid !== undefined ? isValid : vcAPI.isValid()) && hasChange
  const currPath = window.location.pathname

  // setup the handlers, as necessary
  if (!onClose && showClose) {
    if (process.env.NODE_ENV !== 'production') {
      if (!from) {
        console.error("You must either define 'from' on the 'locataion.state' or provide an explicit 'onClose' handler to support the 'Cancel' control in 'ItemControls.'")
      }
    }
    onClose = () => history.push(from)
  }
  if (!onRevert && vcAPI) onRevert = () => vcAPI.resetData()
  if (!onSave && vcAPI && icAPI && (mode === 'create' || mode === 'edit')) {
    const editItem = icAPI.getItem()
    onSave = async() => {
      icAPI.setIsItemUpdating(true)
      const requestSave = mode === 'create'
        ? async() => {
          const newStruct = resourcesSettings.prepareCreate
            ? resourcesSettings.prepareCreate(editItem.forApi(), createProps)
            : editItem
          return resources.createItem(newStruct, authToken)
        }
        : async() => /* then mode === 'edit' */
          resources.updateItem(editItem.forApi(), authToken)

      const result = await requestSave()
      if (result.errorMessage !== null) {
        icAPI.setItem(null)
        icAPI.setIsItemUpdating(false)
        return // bail out
      }

      // notice afterSave may be synchronous or asynchronous or not
      if (afterSave) await afterSave(result.data)

      icAPI.setItem(result.data)
      icAPI.setIsItemUpdating(false)
    }
  }

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

  return (
    <Grid container justify="center">
      { childrenBefore && children }
      { showEdit && <IconControl {...showEdit} onClick={() => history.push(`${currPath}edit/`, {from : currPath})}>{editLabel(showEdit.rank)}</IconControl> }
      { showClose && <IconControl {...showClose} onClick={onClose}>{closeLabel(showClose.rank)}</IconControl> }
      { showRevert && <IconControl {...showRevert} disabled={!hasChange} onClick={onRevert}>{revertLabel(showRevert.rank)}</IconControl> }
      { showSave && <IconControl {...showSave} disabled={!isValidAndChanged} onClick={onSave}>{saveLabel(showSave.rank)}</IconControl> }
      { !childrenBefore && children }
    </Grid>
  )
})

export { ItemControls }
