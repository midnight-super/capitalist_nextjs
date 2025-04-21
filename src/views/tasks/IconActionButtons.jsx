import { Box, IconButton, Tooltip } from '@mui/material'
import { Assignment, CloudDownload, PostAdd, Share, Visibility } from '@mui/icons-material'
import { allTasksHaveSameAssignee } from './TasksValidate'

export default function IconActionButtons({
  setAddTaskModalOpen,
  setIsTaskAssignModalOpen,
  disabled,
  selectedTasks,
  setError,
}) {
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
    <Box>
      <Tooltip title="Add Task">
        <span>
          <IconButton aria-label="Add Task" onClick={() => setAddTaskModalOpen(true)}>
            <PostAdd />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Assign Staff">
        <span>
          <IconButton aria-label="Assign Staff" onClick={handleAssignClick} disabled={disabled}>
            <Assignment />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  )
}
