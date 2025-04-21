import React from 'react'
import { TextField, InputAdornment, IconButton, Typography, Box, Autocomplete, Checkbox } from '@mui/material'
import Tune from '@mui/icons-material/Tune'
import SearchIcon from '@mui/icons-material/Search'
const SearchWithFilter = ({ filterActive, onFilterClick, staffList, assignedStaff, setAssignedStaff }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
      <Autocomplete
        multiple
        fullWidth
        options={staffList}
        getOptionLabel={(option) => option.fullName}
        value={assignedStaff}
        onChange={(e, newValue) => setAssignedStaff(newValue)}
        disableCloseOnSelect // Keep dropdown open while selecting
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox checked={selected} sx={{ mr: 1 }} />
            {option.fullName}
            {/* Optional: Show current assignments */}
            {option.currentTasks && (
              <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                ({option.currentTasks} tasks)
              </Typography>
            )}
          </li>
        )}
        renderTags={() => (
          <input type="text" value={assignedStaff.map((staff) => staff.fullName).join(', ')} hidden readOnly />
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder={
              assignedStaff.length > 0 ? assignedStaff.map((staff) => staff.fullName).join(', ') : 'Select staff...'
            }
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <IconButton
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: filterActive ? 'primary.main' : 'text.secondary',
        }}
        onClick={onFilterClick}
      >
        <Tune />
        <Typography variant="body1">Filter</Typography>
      </IconButton>
    </Box>
  )
}

export default SearchWithFilter
