import React from 'react'
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material'

const CategoryServiceFilter = ({ category, onCategoryChange, service, onServiceChange, categories, services }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 2 }}>
      <FormControl fullWidth>
        <InputLabel>Service Category</InputLabel>
        <Select value={category} onChange={onCategoryChange} label="Service Category">
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.value}>
              {category.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Service</InputLabel>
        <Select value={service} onChange={onServiceChange} label="Service">
          {services.map((service) => (
            <MenuItem key={service.id} value={service.value}>
              {service.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default CategoryServiceFilter
