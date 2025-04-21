import React from 'react'
import { Box, Button, useTheme } from '@mui/material'
import { Assignment, PostAdd } from '@mui/icons-material'
import { allTasksHaveSameAssignee } from './TasksValidate'

export default function TopActionBar({
  setAddTaskModalOpen,
  disabled,
  setIsTaskAssignModalOpen,
  selectedTasks,
  setError,
}) {
  const theme = useTheme()
  const handleAssignClick = () => {
    if (selectedTasks.length === 1) {
      // If only one task is selected, directly open the modal and pass the assignees array
      const assignees = selectedTasks[0]?.assignees || [] // Ensure it's an array
      setIsTaskAssignModalOpen(true, assignees)
    } else if (allTasksHaveSameAssignee(selectedTasks)) {
      // If multiple tasks, validate same assignee
      setIsTaskAssignModalOpen(true)
    } else {
      setError('Selected tasks must have the same assignee.')
    }
  }
  return (
    <Box
      sx={{
        display: 'flex',
        gap: theme.spacing(3), // Use theme spacing for better responsiveness
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing(7.5), // Margin using theme spacing
      }}
    >
      <Button variant="outlined" startIcon={<PostAdd />} onClick={() => setAddTaskModalOpen(true)}>
        Add Task
      </Button>

      <Button variant="contained" startIcon={<Assignment />} disabled={disabled} onClick={handleAssignClick}>
        Assign Staff
      </Button>
    </Box>
  )
}
