import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Box, Button, Chip, Popover } from '@mui/material'
import { Clear } from '@mui/icons-material'
import { statusOptions } from './OrderStatus'
import TaskFilterForm from './TaskFilterForm'

export default function TaskFilterTags({ anchorEl, closeTaskFilterForm, setTaskFilter, setIsSearch }) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })
  const filterFields = [
    { label: 'Order Id', field: 'orderId', type: 'text' },
    { label: 'Job Id', field: 'jobId', type: 'text' },
    { label: 'Task Title', field: 'taskTitle', type: 'text' },
    { label: 'Created on', field: 'createdAt', type: 'date' },
    { label: 'Due Date', field: 'dueDate', type: 'date' },
    {
      label: 'Status',
      field: 'status',
      type: 'option',
      options: statusOptions,
    },
  ]
  const initialFileFilterModes = {
    orderId: 'CONTAINS',
    jobId: 'CONTAINS',
    taskTitle: 'CONTAINS',
    createdAt: 'CONTAINS',
    dueDate: 'CONTAINS',
    status: 'EQUAL',
  }
  const [filterModes, setFilterModes] = useState(initialFileFilterModes)
  const initialFileFilterValues = {
    orderId: '',
    jobId: '',
    taskTitle: '',
    createdAt: '',
    dueDate: '',
    status: '',
  }
  const [filters, setFilters] = useState(initialFileFilterValues)
  const hasFilters = Object.values(filters).some((value) => value !== '')

  function handleFilterModeChange(field, value) {
    setFilterModes((prev) => ({
      ...prev,
      [field]: value, // Update mode for the respective field
    }))
  }

  function applyFilter(filterValues) {
    const criteria = {}
    for (const { field } of filterFields) {
      if (filterValues[field] && filterModes[field]) {
        criteria[field] = { value: filterValues[field], mode: filterModes[field] }
      }
    }
    setIsSearch(false)
    setTaskFilter(criteria)
    setFilters(filterValues)
    closeTaskFilterForm()
  }

  function clearFilter() {
    setValue('orderId', '')
    setValue('jobId', '')
    setValue('taskTitle', '')
    setValue('createdAt', '')
    setValue('dueDate', '')
    setValue('status', '')
    setFilters(initialFileFilterValues)
    setFilterModes(initialFileFilterModes)
    setTaskFilter(null)
  }
  function clearSpecificFilter(key) {
    const updatedFilters = { ...filters }

    delete updatedFilters[key]
    applyFilter(updatedFilters)
  }

  function formatFilterValue(key) {
    const field = filterFields.find((field) => field.field === key)
    const value = filters[key]

    if (field?.type === 'date') {
      const dateValue = moment(value)
      return `${field.label} ${dateValue.format('L')}`
    }

    return value
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'end',
        alignItems: 'center',
        my: '16px',
        gap: '8px',
      }}
    >
      {Object.keys(filters).map(
        (key) =>
          filters[key] && (
            <Chip label={formatFilterValue(key)} deleteIcon={<Clear />} onDelete={() => clearSpecificFilter(key)} />
          )
      )}
      {hasFilters && <Button onClick={clearFilter}>Clear Filter</Button>}

      <Popover
        open={anchorEl !== null}
        anchorEl={anchorEl}
        onClose={closeTaskFilterForm}
        disableScrollLock={true}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <TaskFilterForm
          {...{
            control,
            filterFields,
            filterModes,
            setFilterModes,
            clearFilter,
            handleFilterModeChange,
            onSubmit: handleSubmit(applyFilter),
          }}
        />
      </Popover>
    </Box>
  )
}
