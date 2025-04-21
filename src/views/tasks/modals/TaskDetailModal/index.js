import React from 'react'
import ModalHeader from '@/components/customModalHeader'
import { Dialog, DialogContent } from '@mui/material'
import BasicTaskInfo from './BasicTaskInfo'
import DatasetAndDeadlines from './DatasetAndDeadlines'
import PeopleInvolved from './PeopleInvolved'
import AttachmentsAndLinks from './AttachmentsAndLinks'
import ActivityLog from './ActivityLog'
import customTheme from '@/theme/theme'
const TaskDetailModal = ({ open, close, task }) => {
  const taskData = task
  const theme = customTheme
  return (
    <Dialog
      fullWidth
      open={open}
      onClose={close}
      maxWidth="md"
      backdrop={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.2)' } }}
      disableScrollLock={true}
    >
      <ModalHeader title="Task Details" onClose={close} />
      <DialogContent sx={{ p: '32px', m: 0 }}>
        <BasicTaskInfo
          title={taskData.taskTitle}
          description={taskData.staffInstruction}
          id={taskData.taskId}
          status={taskData.status}
          theme={theme}
        />
        <DatasetAndDeadlines
          createdOn={taskData.createdAt}
          dueDate={taskData.dueDate}
          lastUpdated={taskData.updatedAt}
          completedOn={'N/A'}
          theme={theme}
        />
        <PeopleInvolved createdBy={taskData.auditTrail[0].executorId} assignedTo={taskData.assignees} theme={theme} />
        <AttachmentsAndLinks attachments={taskData.files} theme={theme} />
        <ActivityLog log={taskData.auditTrail} theme={theme} />
      </DialogContent>
    </Dialog>
  )
}

export default TaskDetailModal
