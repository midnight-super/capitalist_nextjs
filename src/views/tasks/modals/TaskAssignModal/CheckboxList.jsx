import React from 'react'
import { Box, Typography, Checkbox } from '@mui/material'

const CheckboxList = ({ title, items, selectedItems, onItemToggle, direction = 'column' }) => {
  return (
    <Box>
      <Typography component="div" variant="h3" sx={{ pb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: direction }}>
        {items.map((item) => (
          <Box key={item.id} sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              sx={{ pl: 0, color: 'GrayText' }}
              checked={selectedItems.includes(item.id)}
              onChange={() => onItemToggle(item.id)}
            />
            <Typography>{item.name}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default CheckboxList
