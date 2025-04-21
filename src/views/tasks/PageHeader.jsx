import React, { useState, useEffect } from 'react'
import { Alert, Box, Button, Snackbar, Typography, useMediaQuery, useTheme } from '@mui/material'
import { Sort as FilterIcon } from '@mui/icons-material'

import HeaderSearchInput from '@/layouts/shared-components/HeaderSearchInput'
import IconActionButtons from './IconActionButtons'
import TopActionButtons from './TopActionButtons'
import TaskFilterTags from './TaskFilterTags'
import AddTaskModal from './modals/AddTaskModal'
import TaskAssignModal from './modals/TaskAssignModal'
export default function PageHeader({
  globalSearchedTxt,
  setIsSearch,
  setTaskFilter,
  staffList,
  selectedTasks,
  fetchTaskLists,
  serviceCategoryList,
  serviceList,
  addonList,
  taskTypeList,
}) {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchedTxt, setSearchedTxt] = useState('')
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false)
  const [isTaskAssignModalOpen, setIsTaskAssignModalOpen] = useState(false)
  const isSmall = useMediaQuery('(max-width:720px)')

  const openFileFilterForm = (event) => setAnchorEl(event.currentTarget)
  const closeTaskFilterForm = () => setAnchorEl(null)
  const [error, setError] = useState(null)
  // Handle scroll behavior
  useEffect(() => {
    const onScroll = () => {
      const pageY = window.scrollY
      setIsScrolled((isSmall && pageY > 50) || (!isSmall && pageY > 150))
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [isSmall])

  // Handle search text changes
  useEffect(() => {
    const value = `${searchedTxt || globalSearchedTxt}`.trim()
    const hasValue = value.length > 0

    setIsSearch(hasValue)
    setTaskFilter(
      hasValue
        ? {
            orderId: { value, mode: 'CONTAINS' },
            jobId: { value, mode: 'CONTAINS' },
            taskTitle: { value, mode: 'CONTAINS' },
          }
        : {}
    )
  }, [searchedTxt, globalSearchedTxt])

  useEffect(() => {
    const handleResize = () => closeTaskFilterForm()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (
    <>
      <Box
        sx={
          isScrolled
            ? {
                position: 'fixed',
                top: 70,
                left: 0,
                right: 0,
                zIndex: 1000,
                backgroundColor: '#fff',
                padding: '16px 40px',
                marginLeft: '110px',
              }
            : {
                backgroundColor: '#fff',
                marginLeft: 0,
              }
        }
      >
        {!isScrolled && (
          <TopActionButtons
            disabled={!selectedTasks.length}
            setAddTaskModalOpen={setAddTaskModalOpen}
            setIsTaskAssignModalOpen={setIsTaskAssignModalOpen}
            selectedTasks={selectedTasks}
            setError={setError}
          />
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: isScrolled ? 1.25 : 0, // 10px = 1.25 * 8
          }}
        >
          <Typography variant="h1">Tasks List</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isScrolled && (
              <IconActionButtons
                setAddTaskModalOpen={setAddTaskModalOpen}
                setIsTaskAssignModalOpen={setIsTaskAssignModalOpen}
                disabled={!selectedTasks.length}
                selectedTasks={selectedTasks}
                setError={setError}
              />
            )}
            <HeaderSearchInput isSmall={isSmall} setSearchedTxt={setSearchedTxt} />
            <Button variant="text" color="secondary" endIcon={<FilterIcon />} onClick={openFileFilterForm}>
              Filter
            </Button>
          </Box>
        </Box>
      </Box>

      <TaskFilterTags
        anchorEl={anchorEl}
        closeTaskFilterForm={closeTaskFilterForm}
        setTaskFilter={setTaskFilter}
        setIsSearch={setIsSearch}
      />

      {addTaskModalOpen && (
        <AddTaskModal
          open={addTaskModalOpen}
          close={() => setAddTaskModalOpen(false)}
          staffList={staffList}
          fetchTaskLists={fetchTaskLists}
        />
      )}

      {isTaskAssignModalOpen && (
        <TaskAssignModal
          open={isTaskAssignModalOpen}
          close={() => setIsTaskAssignModalOpen(false)}
          staffList={staffList}
          selectedTasks={selectedTasks}
          fetchTaskLists={fetchTaskLists}
          serviceCategoryList={serviceCategoryList}
          serviceList={serviceList}
          addonList={addonList}
          taskTypeList={taskTypeList}
        />
      )}
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  )
}
