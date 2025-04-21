import React from 'react'
import { Box, Button } from '@mui/material'

const FilterActions = ({ onApply, onClear, showActionButtons }) => {
  return (
    showActionButtons && (
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          size="small"
          color="primary"
          sx={{ maxHeight: '35px', maxWidth: '100px' }}
          onClick={onApply}
        >
          Apply Filters
        </Button>
        <Button sx={{ textDecoration: 'underline', maxHeight: '35px', maxWidth: '100px' }} onClick={onClear}>
          Clear All
        </Button>
      </Box>
    )
  )
}

export default FilterActions
