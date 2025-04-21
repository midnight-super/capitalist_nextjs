import React, { useState, useRef } from 'react'
import {
  TextField,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid2 as Grid,
  Box,
  Chip,
  InputAdornment,
} from '@mui/material'
import { inputDropdownStyles } from '@/styles/input-dropdown-styles'
import Image from 'next/image'

const MultiSelectField = ({ value = [], onChange, label, options = [], error }) => {
  const {
    mainContainer,
    menuContainer,
    closeIcon,
    boxContainer,
    chipContent,
    chipMoreContent,
    dropdownIcon,
    dropdownIconContainer,
  } = inputDropdownStyles
  const [anchorEl, setAnchorEl] = useState(null)
  const textFieldRef = useRef(null)
  const open = Boolean(anchorEl)
  const [showAll, setShowAll] = useState(false)

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = (chipToDelete) => {
    const updatedValue = value?.filter((v) => v !== chipToDelete)
    onChange(updatedValue)
    if (updatedValue.length <= 3) {
      setShowAll(false)
    }
  }

  const handleCheckboxChange = (optionValue, isChecked) => {
    const updatedValue = Array.isArray(value) ? [...value] : []
    if (isChecked) {
      updatedValue?.push(optionValue)
    } else {
      const index = updatedValue.indexOf(optionValue)
      if (index !== -1) updatedValue.splice(index, 1)
    }
    onChange(updatedValue)
  }

  return (
    <>
      <TextField
        ref={textFieldRef}
        label={label}
        value={value.length === 0 ? 'Without Designation' : ''}
        onClick={handleOpen}
        error={!!error}
        variant="outlined"
        InputProps={{
          readOnly: true,
          startAdornment: (
            <Box sx={boxContainer}>
              {value.length > 0 &&
                (showAll ? value : value?.slice(0, 3))?.map((val, index) => (
                  <Chip
                    key={index}
                    label={options?.find((opt) => opt?.value === val)?.label || val}
                    onClick={(e) => e.stopPropagation()}
                    onDelete={(e) => {
                      e.stopPropagation()
                      handleDelete(val)
                    }}
                    deleteIcon={
                      <span>
                        <img src="/icons/removeIcon.svg" alt="remove" />
                      </span>
                    }
                    sx={{
                      ...chipContent,
                      '&:hover': {
                        backgroundColor: '#E9F0FD',
                      },
                    }}
                  />
                ))}
              {value.length > 3 && !showAll && (
                <Chip
                  label={`+${value.length - 3} more`}
                  clickable
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowAll(true)
                  }}
                  sx={{
                    ...chipMoreContent,
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                />
              )}
            </Box>
          ),
          endAdornment: (
            <InputAdornment position="end" onClick={handleOpen} style={dropdownIconContainer}>
              <img src="/icons/arrowPage.svg" alt="dropdown icon" style={dropdownIcon} />
            </InputAdornment>
          ),
        }}
        sx={{
          ...mainContainer,
          '& .MuiOutlinedInput-input': {
            display: value.length > 3 ? 'none' : 'block',
            width: 'fit-content',
          },
        }}
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { menuContainer },
          style: {
            width: textFieldRef.current ? textFieldRef.current.offsetWidth : 'auto',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ ...closeIcon, top: '10px' }} onClick={handleClose}>
          <Image src="/icons/crossIcon.svg" alt="cross" width={15} height={15} />
        </Box>
        <Grid container spacing={2} sx={{ padding: '10px' }}>
          {options?.length > 0 ? (
            options.map((option) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={option.value}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <MenuItem
                  disableGutters
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    padding: 0,
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Array.isArray(value) && value?.includes(option.value)}
                        onChange={(event) => handleCheckboxChange(option.value, event.target.checked)}
                      />
                    }
                    label={option.label}
                  />
                </MenuItem>
              </Grid>
            ))
          ) : (
            <p style={{ padding: '10px', textAlign: 'center' }}>No options available</p>
          )}
        </Grid>
      </Menu>
      {error && <FormHelperText sx={{ color: 'error.main' }}>{error.message}</FormHelperText>}
    </>
  )
}

export default MultiSelectField
