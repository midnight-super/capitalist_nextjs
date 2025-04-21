import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Box, IconButton, Input, InputAdornment, Menu, MenuItem, Paper } from '@mui/material'
import { useRouter } from 'next/router'

const GlobalSearchInput = ({ width, setGlobalSearchedTxt = () => {} }) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedOption, setSelectedOption] = useState('Events')
  const [inputValue, setInputValue] = useState('')

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = (option) => {
    setAnchorEl(null)
    if (option) {
      if (option === 'Users') {
        router.push('/admin/client-users')
      }
      setSelectedOption(option)
    }
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
    if (setGlobalSearchedTxt) {
      setGlobalSearchedTxt(event.target.value)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (setGlobalSearchedTxt) {
        setGlobalSearchedTxt(inputValue)
      }
    }
  }

  return (
    <Paper
      component="form"
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: '4px',
        background: '#ffffff',
        width: width || '543px',
        padding: '5px',
        boxShadow: 'none',
        height: '44px',
      }}
    >
      <Input
        placeholder="Start typing for search"
        fullWidth
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        sx={{
          borderRadius: '4px',
          background: 'inherit',
          color: '#757575',
          backgroundColor: '#F1F3F4',
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '20px',
          height: '44px',
        }}
        disableUnderline
        startAdornment={
          <InputAdornment position="start">
            <Box sx={{ ml: '12px', display: 'flex', alignItems: 'center' }}>
              <Image src="/icons/searchIcon.svg" alt="search" height={20} width={20} style={{ marginRight: '12px' }} />
            </Box>
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end" sx={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                marginRight: '8px',
                color: '#797F8F',
                fontSize: '14px',
                fontWeight: 400,
              }}
            >
              {selectedOption}
            </span>
            <IconButton onClick={handleMenuOpen}>
              <Image src="/icons/arrowDown.svg" alt="menu" height={20} width={20} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => handleMenuClose()}
              PaperProps={{
                style: {
                  borderRadius: '8px',
                  fontSize: '15px',
                  color: '#212121',
                  boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.15)',
                },
              }}
              disableScrollLock={true}
            >
              <MenuItem onClick={() => handleMenuClose('Events')}>Events</MenuItem>
              <MenuItem onClick={() => handleMenuClose('Users')}>Users</MenuItem>
              <MenuItem onClick={() => handleMenuClose('Files')}>Files</MenuItem>
            </Menu>
          </InputAdornment>
        }
      />
    </Paper>
  )
}

export default GlobalSearchInput
