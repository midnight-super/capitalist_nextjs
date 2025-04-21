import React from 'react'
import moment from 'moment'
import { Controller } from 'react-hook-form'
import { Box, Button, FormControl, Grid } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import CustomFilterInput from '@/components/customFilterInput'
import CustomFilterList from '@/components/customFilterList'
import DropdownWithCustomStyle from '@/components/CustomFilterDropdown'

export default function TaskFilterForm({
  control,
  filterFields,
  filterModes,
  setFilterModes,
  clearFilter,
  handleFilterModeChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit}>
      <Box sx={{ width: '300px', padding: 4 }}>
        <Grid container spacing={2.5}>
          {filterFields.map(({ field, label, type, options }) => (
            <Grid key={field} sx={{ width: '100%' }}>
              {type === 'text' && (
                <FormControl fullWidth sx={{ mb: '6px' }}>
                  <Controller
                    name={field}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CustomFilterInput
                        value={value}
                        onChange={onChange}
                        label={`Filter by ${label}`}
                        handleClear={() => clearFilter(field)}
                      />
                    )}
                  />
                </FormControl>
              )}

              {type === 'option' && (
                <FormControl fullWidth sx={{ mb: '6px' }}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CustomFilterList
                        value={options.find((option) => option.value === value)}
                        setValue={(newValue) => onChange(newValue?.value || null)}
                        option={options}
                        placeHolder={`Filter by ${label}`}
                        width={'100%'}
                      />
                    )}
                  />
                </FormControl>
              )}

              {type === 'date' && (
                <FormControl fullWidth sx={{ mb: '6px' }}>
                  <Controller
                    name={field}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        label={`Filter by ${label}`}
                        placeholder={`Filter by ${label}`}
                        value={value ? moment(value) : null}
                        onChange={(moment) => onChange(moment.format('YYYY-MM-DD'))}
                      />
                    )}
                  />
                </FormControl>
              )}

              <DropdownWithCustomStyle
                field={field}
                filterValue={(value) => handleFilterModeChange(field, value)}
                setFilterModes={setFilterModes}
                filterModes={filterModes}
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '12px' }}>
          <Button type="submit" variant="contained">
            Apply Filter
          </Button>
        </Box>
      </Box>
    </form>
  )
}
