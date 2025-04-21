import { useState } from 'react'
import { Box, IconButton } from '@mui/material'
import { Add } from '@mui/icons-material'
import TaskAssignModal from '../modals/TaskAssignModal'
import AssigneesDisplay from './AssigneesDisplay'
import { handleOrderUpdateTask } from '@/services/task.service'

const TaskAssigneesOptions = ({
  row,
  staffList,
  fetchTaskLists,
  serviceCategoryList,
  serviceList,
  addonList,
  taskTypeList,
}) => {
  const [taskAssignModal, setTaskAssignModal] = useState(false)
  const { assignees = [] } = row

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          size="small"
          onClick={() => staffList.length > 0 && setTaskAssignModal(true)}
          sx={{
            bgcolor: 'primary.main',
            width: 24,
            height: 24,
            borderRadius: '50%',
            '&:hover': {
              bgcolor: 'primary.light',
            },
          }}
        >
          <Add sx={{ color: 'common.white' }} />
        </IconButton>

        <AssigneesDisplay assignees={assignees} staffList={staffList} onClick={() => setTaskAssignModal(true)} />
      </Box>

      {taskAssignModal && (
        <TaskAssignModal
          open={taskAssignModal}
          close={() => setTaskAssignModal(false)}
          staffList={staffList}
          selectedTasks={[row]}
          fetchTaskLists={fetchTaskLists}
          serviceCategoryList={serviceCategoryList}
          serviceList={serviceList}
          addonList={addonList}
          taskTypeList={taskTypeList}
        />
      )}
    </>
  )
}

export default TaskAssigneesOptions
