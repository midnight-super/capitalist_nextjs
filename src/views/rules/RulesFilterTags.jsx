import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Box, Button, Chip, Popover } from '@mui/material'
import { Clear } from '@mui/icons-material'

import RuleFilterForm from './RuleFilterForm'
import moment from 'moment'

export default function RulesFilterTags({ anchorEl, closeRuleFilterForm, setRuleFilter, isSearch, setIsSearch }) {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ mode: 'onChange' })

  const filterFields = [
    { label: 'Name of the rules', field: 'ruleName', type: 'text' },
    { label: 'Type', field: 'objectName', type: 'text' },
    { label: 'Date of creation', field: 'createdAt', type: 'date' },
    {
      label: 'Status',
      field: 'status',
      type: 'option',
      options: [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
      ],
    },
  ]

  const initialRuleFilterModes = {
    ruleName: 'CONTAINS',
    objectName: 'EQUAL',
    createdAt: 'CONTAINS',
    status: 'EQUAL',
  }

  const initialRuleFilterValues = {
    ruleName: '',
    objectName: '',
    createdAt: '',
    status: '',
  }

  const [filterModes, setFilterModes] = useState(initialRuleFilterModes)
  const [filters, setFilters] = useState(initialRuleFilterValues)

  const hasFilters = Object.values(filters).some((value) => value !== '')

  const handleFilterModeChange = (field, value) => {
    setFilterModes((prev) => ({ ...prev, [field]: value }))
  }

  const applyFilter = (filterValues) => {
    const criteria = {}
    for (const { field } of filterFields) {
      if (filterValues[field] && filterModes[field]) {
        criteria[field] = { value: filterValues[field], mode: filterModes[field] }
      }
    }

    setIsSearch(false)
    setRuleFilter(criteria)
    setFilters(filterValues)
    closeRuleFilterForm()
  }

  const clearFilter = () => {
    for (const { field } of filterFields) {
      setValue(field, '')
    }
    setFilters(initialRuleFilterValues)
    setFilterModes(initialRuleFilterModes)
    setRuleFilter(null)
  }

  const clearSpecificFilter = (key) => {
    const updatedValues = { ...getValues(), [key]: '' }
    setValue(key, '')
    applyFilter(updatedValues)
  }

  const formatFilterValue = (key) => {
    const field = filterFields.find((f) => f.field === key)
    const value = filters[key]

    if (!field || !value) return ''

    if (field.type === 'date') {
      return `${moment(value).format('L')}`
    }

    if (field.type === 'option') {
      const selected = field.options.find((opt) => opt.value === value)
      return `${selected?.label || value}`
    }

    return `${value}`
  }

  useEffect(() => {
    if (isSearch === true) clearFilter()
  }, [isSearch])

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
            <Chip
              key={key}
              label={formatFilterValue(key)}
              deleteIcon={<Clear />}
              onDelete={() => clearSpecificFilter(key)}
            />
          )
      )}

      {hasFilters && <Button onClick={clearFilter}>Clear Filter</Button>}

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={closeRuleFilterForm}
        disableScrollLock
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <RuleFilterForm
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
