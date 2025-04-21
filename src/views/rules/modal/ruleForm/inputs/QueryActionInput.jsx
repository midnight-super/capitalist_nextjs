import { Button } from '@mui/material'
import { TextField50 } from './TextField50'

export const QueryActionInput = ({
  isView,
  action,
  selectedObject,
  queryActionValues,
  handleOpenFolderModal,
  handleOpenFileModal,
  handleOpenFileTypeModal,
  handleOpenFileDurationModal,
  handleQueryActionInputChange,
}) => {
  const actionId = action?.actionId
  const actionName = action?.actionName
  const value = queryActionValues[actionId] || ''

  if (selectedObject?.objectName === 'FILE') {
    switch (actionName) {
      case 'FOLDER_NAME':
        return (
          <Button variant="outlined" onClick={() => handleOpenFolderModal(actionId)}>
            {value || 'Select Folder'}
          </Button>
        )
      case 'FILE_NAME':
        return (
          <Button variant="outlined" onClick={() => handleOpenFileModal(actionId)} disabled={isView}>
            {value || 'Select File'}
          </Button>
        )
      case 'FILE_TYPE':
        return (
          <Button variant="outlined" onClick={() => handleOpenFileTypeModal(actionId)} disabled={isView}>
            {value || 'Select File Type'}
          </Button>
        )
      case 'FILE_DURATION':
        return (
          <Button variant="outlined" onClick={() => handleOpenFileDurationModal(actionId)} disabled={isView}>
            {value || 'Set Duration'}
          </Button>
        )
      case 'FILE_SIZE':
        return (
          <TextField50
            value={value}
            onChange={(e) => handleQueryActionInputChange(actionId, e.target.value)}
            placeholder="Enter size in bytes"
            label="Value"
            disabled={isView}
          />
        )
      default:
        return (
          <TextField50
            value={value}
            onChange={(e) => handleQueryActionInputChange(actionId, e.target.value)}
            placeholder="Enter value"
            label="Value"
            disabled={isView}
          />
        )
    }
  }

  return (
    <TextField50
      value={value}
      onChange={(e) => handleQueryActionInputChange(actionId, e.target.value)}
      placeholder="Enter value"
      label="Value"
      disabled={isView}
    />
  )
}
