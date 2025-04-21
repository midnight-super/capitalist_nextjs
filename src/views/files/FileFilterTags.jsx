import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Box, Button, Chip, Popover } from '@mui/material'
import { Clear } from '@mui/icons-material'

import FileFilterForm from './FileFilterForm'
import moment from 'moment'

export default function FileFilterTags({ anchorEl, closeFileFilterForm, setFileFilter, setIsSearch }) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })
  const filterFields = [
    { label: 'Filename', field: 'fileName', type: 'text' },
    { label: 'Category / Department', field: 'category', type: 'text' },
    { label: 'Uploaded on', field: 'createdAt', type: 'date' },
    { label: 'Last Modified', field: 'updatedAt', type: 'date' },
    {
      label: 'Flag',
      field: 'tag',
      type: 'option',
      options: [
        {
          value: 'red_flag',
          label: 'Red Flag',
        },
        {
          value: 'yellow_flag',
          label: 'Yellow Flag',
        },
        {
          value: 'green_flag',
          label: 'Green Flag',
        },
        {
          value: 'blue_flag',
          label: 'Blue Flag',
        },
      ],
    },
    {
      label: 'Status',
      field: 'status',
      type: 'option',
      options: [
        {
          value: 'UPLOADED',
          label: 'Uploaded',
        },
        {
          value: 'TRANSCRIBED',
          label: 'Transcribed',
        },
        {
          value: 'ARCHIVED',
          label: 'Archived',
        },
        {
          value: 'DELETED',
          label: 'Deleted',
        },
      ],
    },
  ]
  const initialFileFilterModes = {
    fileName: 'CONTAINS',
    category: 'EQUAL',
    createdAt: 'CONTAINS',
    updatedAt: 'CONTAINS',
    tag: 'CONTAINS',
    status: 'EQUAL',
  }
  const [filterModes, setFilterModes] = useState(initialFileFilterModes)
  const initialFileFilterValues = {
    fileName: '',
    category: '',
    createdAt: '',
    updatedAt: '',
    tag: '',
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

    console.log('setFileFilter', criteria)
    setFileFilter(criteria)

    console.log('setFilters', filterValues)
    setFilters(filterValues)
    closeFileFilterForm()
  }

  function clearFilter() {
    setValue('fileName', '')
    setValue('tag', '')
    setValue('status', '')
    setFilters(initialFileFilterValues)
    setFilterModes(initialFileFilterModes)
    setFileFilter(null)
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
        onClose={closeFileFilterForm}
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
        <FileFilterForm
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
