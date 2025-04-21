import React, { useEffect, useState } from 'react'
import { Menu, MenuItem, Box, Typography } from '@mui/material'

export default function CustomDropdownTextField({
  field,
  client = true,
  filterValue,
  setFilterModes,
  filterModes = {},
}) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedValue, setSelectedValue] = useState(filterModes[field] || 'CONTAINS') // Default to "CONTAINS" if no filter mode exists
  const [isFirstLoad, setIsFirstLoad] = useState(true) // Flag to track the first load

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  // Effect to set default value for "status" field when client is true, but only once
  // useEffect(() => {
  //     if (field === "status" && client === true && isFirstLoad===true) {
  //         setSelectedValue("EQUAL");
  //         setFilterModes((prev) => ({ ...prev, [field]: "EQUAL" }));
  //         setIsFirstLoad(false); // Set flag to false after first load
  //     }
  // }, [field, client, isFirstLoad, setFilterModes]);

  const handleSelect = (value) => {
    setSelectedValue(value)
    setFilterModes((prev) => ({ ...prev, [field]: value }))
    filterValue && filterValue(value) // Pass selected mode to parent or callback
    handleCloseMenu()
    setIsFirstLoad(false)
  }

  const iconStyle = {
    transition: 'transform 0.3s ease',
    transform: anchorEl ? 'rotate(180deg)' : 'rotate(0deg)',
  }

  const selectedItemStyle = {
    backgroundColor: '#4489FE',
    color: 'white',
  }

  const hoverStyle = {
    '&:hover': {
      color: 'black',
    },
  }

  return (
    <>
      <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={handleOpenMenu}>
        <img src="/icons/arrowDown.svg" alt="arrow" style={iconStyle} />
        <Typography
          component="div"
          sx={{
            textAlign: 'right',
            color: '#898989',
            fontSize: '12px',
            fontWeight: 400,
          }}
        >
          {`Filter Mode: ${selectedValue}`}
        </Typography>
      </Box>
      {anchorEl !== null && (
        <Menu
          anchorEl={anchorEl}
          disableScrollLock={true}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          slotProps={{
            paper: {
              sx: {
                zIndex: 1,
                boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.15)',
                borderRadius: '4px',
                marginTop: '6px',
              },
            },
          }}
        >
          <MenuItem
            onClick={() => handleSelect('CONTAINS')}
            sx={{
              ...hoverStyle,
              ...(selectedValue === 'CONTAINS' ? selectedItemStyle : {}),
            }}
          >
            Contains
          </MenuItem>
          <MenuItem
            onClick={() => handleSelect('NOT_CONTAINS')}
            sx={{
              ...hoverStyle,
              ...(selectedValue === 'NOT_CONTAINS' ? selectedItemStyle : {}),
            }}
          >
            Not-Contains
          </MenuItem>
          <MenuItem
            onClick={() => handleSelect('EQUAL')}
            sx={{
              ...hoverStyle,
              ...(selectedValue === 'EQUAL' ? selectedItemStyle : {}),
            }}
          >
            Equals
          </MenuItem>
          <MenuItem
            onClick={() => handleSelect('NOT_EQUAL')}
            sx={{
              ...hoverStyle,
              ...(selectedValue === 'NOT_EQUAL' ? selectedItemStyle : {}),
            }}
          >
            Not-Equals
          </MenuItem>
        </Menu>
      )}
    </>
  )
}
