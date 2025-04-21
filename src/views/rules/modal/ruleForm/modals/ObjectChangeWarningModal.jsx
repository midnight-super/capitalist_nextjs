import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'

const ObjectChangeWarningModal = ({
  open,
  onClose,
  onConfirm,
  title = 'Warning: Changing Rule Object',
  description = 'Changing the rule object will reset all related conditions and actions.',
  confirmText = 'Proceed',
  cancelText = 'Cancel',
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Typography variant="body1">
          This may significantly affect how the rule functions. Are you sure you want to proceed?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} variant="contained" color="warning">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ObjectChangeWarningModal
