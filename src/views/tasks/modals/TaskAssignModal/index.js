import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material'
import ModalHeader from '@/components/customModalHeader'
import SearchWithFilter from './SearchWithFilter'
import CategoryServiceFilter from './CategoryServiceFilter'
import CheckboxList from './CheckboxList'
import FilterActions from './FilterActions'
import SelectedTaskItem from './SelectedTaskItem'
import AssignedStaffItem from './AssignedStaffItem'
import { handleTaskAssign } from '@/services/task.service'

const TaskAssignmentModal = ({
  open,
  close,
  selectedTasks,
  staffList,
  fetchTaskLists,
  serviceCategoryList,
  serviceList,
  addonList,
  taskTypeList,
}) => {
  const [category, setCategory] = useState('')
  const [service, setService] = useState('')
  const [assignedStaff, setAssignedStaff] = useState([])
  const [filterClicked, setFilterClicked] = useState(false)
  const [selectedAddons, setSelectedAddons] = useState([])
  const [selectedTaskTypes, setSelectedTaskTypes] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [filteredAddons, setFilteredAddons] = useState([])
  const [filteredTaskTypes, setFilteredTaskTypes] = useState([])
  const [filteredStaffList, setFilteredStaffList] = useState([]) // New state for filtered staff list

  useEffect(() => {
    if (open) {
      const assignedIds = selectedTasks.flatMap((task) => task.assignees.map((assignee) => assignee.assigneeId))
      const filteredStaff = staffList.filter((staff) => assignedIds.includes(staff.staffId))
      setAssignedStaff(filteredStaff)
      setFilteredStaffList(staffList) // Initialize filtered staff list with all staff
    }
  }, [open, selectedTasks, staffList])

  // Filter services based on selected category
  useEffect(() => {
    if (category) {
      const servicesForCategory = serviceList.filter((service) => service.serviceCategoryId === category)
      setFilteredServices(servicesForCategory)
      setService('') // Reset service when category changes
    } else {
      setFilteredServices([])
      setService('')
    }
  }, [category, serviceList])

  // Filter addons and task types based on selected service
  useEffect(() => {
    if (service) {
      const addonsForService = addonList.filter((addon) => addon.serviceId === service)
      const taskTypesForService = taskTypeList.filter((taskType) => taskType.serviceId === service)
      setFilteredAddons(addonsForService)
      setFilteredTaskTypes(taskTypesForService)
      setSelectedAddons([])
      setSelectedTaskTypes([])
    } else {
      setFilteredAddons([])
      setFilteredTaskTypes([])
    }
  }, [service, addonList, taskTypeList])

  const handleAssignTask = async () => {
    const payload = selectedTasks.map((task) => ({
      ...task,
      assignees: assignedStaff.map((staff) => ({
        assigneeId: staff.staffId,
        assigneeName: staff.fullName,
        assigneeEmail: staff.email,
      })),
    }))
    try {
      const result = await handleTaskAssign(payload)
      if (result === 'OPERATION_SUCCESS') fetchTaskLists()
    } catch (err) {
      console.error('Failed to assign tasks:', err)
    } finally {
      close()
    }
  }

  const handleRemoveStaff = (staffId) => {
    setAssignedStaff((prev) => prev.filter((staff) => staff.staffId !== staffId))
  }

  const handleFilterClick = () => {
    const toggled = !filterClicked
    setFilterClicked(toggled)
    if (!toggled) {
      setCategory('')
      setService('')
      setSelectedAddons([])
      setSelectedTaskTypes([])
      setFilteredStaffList(staffList) // Reset filtered staff list when filters are closed
    }
  }

  const handleAddonToggle = (addonId) => {
    setSelectedAddons((prev) => (prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]))
  }

  const handleTaskTypeToggle = (taskTypeId) => {
    setSelectedTaskTypes((prev) =>
      prev.includes(taskTypeId) ? prev.filter((id) => id !== taskTypeId) : [...prev, taskTypeId]
    )
  }

  const handleClearAll = () => {
    setSelectedAddons([])
    setSelectedTaskTypes([])
    setFilteredStaffList(staffList) // Reset filtered staff list when clearing filters
  }

  const handleApplyFilters = () => {
    if (!service) return // Need at least a service selected

    // Filter the staff list based on selected criteria
    const filteredStaff = staffList.filter((staff) => {
      // Check if staff has the selected service skill
      const hasServiceSkill = staff.skillServices?.some((skill) => skill.serviceId === service)

      // Check if staff has all selected addon skills
      const hasAddonSkills =
        selectedAddons.length === 0 ||
        selectedAddons.every((addonId) => staff.skillAddons?.some((skill) => skill.addonId === addonId))

      // Check if staff has all selected task type skills
      const hasTaskTypeSkills =
        selectedTaskTypes.length === 0 ||
        selectedTaskTypes.every((taskTypeId) => staff.skillTaskTypes?.some((skill) => skill.taskTypeId === taskTypeId))

      return hasServiceSkill && hasAddonSkills && hasTaskTypeSkills
    })

    // Update the filtered staff list (this will affect the dropdown)
    setFilteredStaffList(filteredStaff)
  }

  const showCheckboxes = category.length && service.length && filterClicked
  const showActionButtons = selectedAddons.length > 0 || selectedTaskTypes.length > 0

  return (
    <Dialog open={open} onClose={close} maxWidth="md" fullWidth>
      <ModalHeader title="Task Assign" onClose={close} />

      <DialogContent sx={{ px: '43px', mt: '52px', height: '1000px' }}>
        <SearchWithFilter
          assignedStaff={assignedStaff}
          setAssignedStaff={setAssignedStaff}
          filterActive={filterClicked}
          onFilterClick={handleFilterClick}
          staffList={filteredStaffList} // Use filtered staff list for dropdown
        />

        {filterClicked && (
          <CategoryServiceFilter
            category={category}
            onCategoryChange={(e) => setCategory(e.target.value)}
            service={service}
            onServiceChange={(e) => setService(e.target.value)}
            categories={serviceCategoryList.map((cat) => ({
              value: cat.serviceCategoryId,
              label: cat.serviceCategoryName,
            }))}
            services={filteredServices.map((serv) => ({
              value: serv.serviceId,
              label: serv.serviceName,
            }))}
          />
        )}

        {showCheckboxes ? (
          <Box sx={{ mt: 3 }}>
            <Box display="flex" flexDirection="row" gap={20} justifyContent="flex-start">
              <CheckboxList
                title="Add-ons"
                items={filteredAddons.map((addon) => ({
                  id: addon.addonId,
                  name: addon.addonName,
                }))}
                selectedItems={selectedAddons}
                onItemToggle={handleAddonToggle}
              />
              <CheckboxList
                title="Task Types"
                items={filteredTaskTypes.map((taskType) => ({
                  id: taskType.taskTypeId,
                  name: taskType.taskTypeName,
                }))}
                selectedItems={selectedTaskTypes}
                onItemToggle={handleTaskTypeToggle}
              />
            </Box>

            <FilterActions
              onApply={handleApplyFilters}
              onClear={handleClearAll}
              showActionButtons={showActionButtons}
            />
          </Box>
        ) : null}

        <Typography component="div" variant="h3" sx={{ mt: '24px' }}>
          Selected Tasks
        </Typography>
        {selectedTasks?.map((task) => (
          <SelectedTaskItem key={task.id} task={task} />
        ))}

        <Typography component="div" variant="h3" sx={{ mt: '40px', mb: '20px' }}>
          Assigned Staff
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'space-between',
            alignContent: 'flex-start',
          }}
        >
          {assignedStaff?.map((staff) => (
            <AssignedStaffItem key={staff.staffId} staff={staff} onRemove={handleRemoveStaff} />
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: '60px', justifyContent: 'center' }}>
        <Button variant="outlined" onClick={close}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleAssignTask}>
          Assign Task
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TaskAssignmentModal
