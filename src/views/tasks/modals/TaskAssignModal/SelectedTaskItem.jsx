import React from 'react'
import { Box, Typography, Checkbox } from '@mui/material'

const SelectedTaskItem = ({ task }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: '20px', gap: '3px' }}>
      <Checkbox checked={true} disabled sx={{ py: 0, pl: 0, pr: '12px' }} />
      <Typography component="div">#{task.id.slice(-6)} - </Typography>
      <Typography component="div" color="primary">
        {task.taskTitle}
      </Typography>
      <Typography component="div">
        {' | ' +
          task.files.length +
          ' files | ' +
          (task.audioHours > 0 ? `${task.audioHours} hours audio` : 'No audio')}
      </Typography>
    </Box>
  )
}

export default SelectedTaskItem
