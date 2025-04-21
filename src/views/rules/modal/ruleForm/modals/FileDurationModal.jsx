import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, Button, Box, TextField, MenuItem } from '@mui/material'

const FileDurationModal = ({ open, onClose, onSelect }) => {
  const [duration, setDuration] = useState('')
  const [unit, setUnit] = useState('seconds')

  const units = [
    { value: 'seconds', label: 'Seconds' },
    { value: 'minutes', label: 'Minutes' },
    { value: 'hours', label: 'Hours' },
  ]

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Set File Duration</DialogTitle>
      <DialogContent>
        <Box sx={{ minWidth: 300, p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              label="Duration"
              inputProps={{ min: 0 }}
            />
            <TextField
              select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              label="Unit"
              sx={{ minWidth: 120 }}
            >
              {units.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                onSelect(`${duration} ${unit}`)
                onClose()
              }}
              disabled={!duration}
            >
              Select
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default FileDurationModal
