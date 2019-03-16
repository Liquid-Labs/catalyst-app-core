import React from 'react'
import { withRouter } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import { IconControl } from './IconControl'

import CancelIcon from '@material-ui/icons/Cancel'
import CreateIcon from '@material-ui/icons/AddBox'
import EditIcon from '@material-ui/icons/Edit'
import RestoreIcon from 'mdi-material-ui/Restore'
import SaveIcon from '@material-ui/icons/SaveAlt'

import { routes } from '@liquid-labs/catalyst-core-api'
import { useValidationContextAPI } from '@liquid-labs/react-validation'

const primaryProps = { variant : 'contained', color : 'primary' };
const optionalPrimaryProps = { color : 'primary' };
const secondaryProps = { color : 'primary' };
const dangerousSecondary = { color : 'secondary' };

const defaultInclude = ['edit', 'cancel', 'revert', 'save', 'save and close']
const defaultTextLabels = {
  cancel             : 'Cancel',
  create             : 'Create',
  edit               : 'Edit',
  save               : 'Save',
  revert             : 'Revert',
  'save and close'   : 'Save & close',
  'create and close' : 'Create & close',
}
const defaultIconLabels = {
  cancel : <CancelIcon />,
  create : <CreateIcon />,
  edit   : <EditIcon />,
  save   : <SaveIcon />,
  revert : <RestoreIcon /> // TODO: there are 'restore' and 'undo' icons; 'restore seems the closest'
  /* TODO: not sure what to do for 'save and close' here; part of the reason we're excluding it for now; see 'TODO' note below */
}

// TOOD: add hover-popover that explains why a control is disabled. E.g., because there's no need to save or the data is invalid.
// TODO: at the moment, we only really support default 'icons' style because we render everything in an IconBottun; text should be rendered in Button
const ItemControls = withRouter(({ onDone, onRevert, onSave, // handlers
  include=defaultInclude, exclude, controlStyle='icons', // configurations
  unsavedChanges, childrenBefore=false,
  from, history, isValid, children}) => {
  const mode = routes.getRenderMode()
  const vcAPI = useValidationContextAPI()

  if (exclude) {
    exclude.forEach((exLabel) => include.splice(include.indexOf(exLabel), 1))
  }
  const isIncluded = (label) => include.indexOf(label) !== -1
  const labels = controlStyle === 'icons'
    ? defaultIconLabels
    : defaultTextLabels

  const cancelLabel = labels['cancel']
  const editLabel = labels['edit']
  const revertLabel = labels['revert']
  const saveLabel = mode === 'create' ? labels['create'] : labels['save']

  const showEdit = isIncluded('edit')
    && mode === 'view'
    && ((from && secondaryProps) || optionalPrimaryProps)
  const showCancel /* aka close */ = isIncluded('cancel')
    && from && ((mode === 'view' && primaryProps) || dangerousSecondary)
  // Reversion doesn't make sense for 'view' or 'create, only edit'
  const showRevert = isIncluded('revert')
    && mode === 'edit' && dangerousSecondary
  // If we are creating and have from, then 'save and close' makes more sense.
  const showSave = isIncluded('save')
    && mode !== 'view'
    && ((from && secondaryProps) || primaryProps)

  const hasChange =
    (unsavedChanges === undefined && vcAPI && vcAPI.isChanged())
      || unsavedChanges
  const isValidAndChanged =
    (isValid !== undefined ? isValid : vcAPI.isValid()) && hasChange
  const currPath = window.location.pathname

  return (
    <Grid container justify="center">
      { childrenBefore && children }
      { showEdit && <IconControl {...showEdit} onClick={() => history.push(`${currPath}edit/`, {from : currPath})}>{editLabel}</IconControl> }
      { showCancel && <IconControl {...showCancel} onClick={onDone}>{cancelLabel}</IconControl> }
      { showRevert && <IconControl {...showRevert} disabled={!hasChange} onClick={onRevert}>{revertLabel}</IconControl> }
      { showSave && <IconControl {...showSave} disabled={!isValidAndChanged} onClick={onSave}>{saveLabel}</IconControl> }
      { !childrenBefore && children }
    </Grid>
  )
})

export { ItemControls }
