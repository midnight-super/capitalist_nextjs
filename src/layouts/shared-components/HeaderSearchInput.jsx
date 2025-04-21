import React from 'react'
import { Box, Input, InputAdornment, Paper } from '@mui/material'

const HeaderSearchInput = ({ isSmall, searchQuery, setSearchQuery = () => {} }) => {
  return (
    <Paper
      component="form"
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: '4px',
        width: isSmall ? '100%' : '285px',
        padding: !isSmall ? '5px' : '',
        boxShadow: 'none',
        height: '44px',
      }}
    >
      <Input
        placeholder="Search..."
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          borderRadius: '4px',
          background: 'inherit',
          color: '#757575',
          border: '1px solid #DEE0E4',
          backgroundColor: '#ffffff',
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '20px',
          height: '44px',
        }}
        disableUnderline
        startAdornment={
          <InputAdornment position="start">
            <Box sx={{ ml: '12px', display: 'flex', alignItems: 'center' }}>
              <img src="/icons/searchIcon.svg" alt="search" height={20} width={20} style={{ marginRight: '12px' }} />
            </Box>
          </InputAdornment>
        }
      />
    </Paper>
  )
}

export default HeaderSearchInput
