// ** React Imports
import React from 'react'
import Typography from '@mui/material/Typography'
import { Menu, MenuItem } from '@mui/material'
export default function ActionMenu({ anchorEl, closeRowActionMenu, openDetailModal, row }) {
  return (
    <Menu
      keepMounted
      anchorEl={anchorEl}
      open={anchorEl !== null}
      onClose={closeRowActionMenu}
      disableScrollLock={true}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        zIndex: 1,
        // Optional: Add this to prevent position shifting during close
        '& .MuiPaper-root': {
          transition: 'nsone !important',
        },
      }}
    >
      <MenuItem onClick={openDetailModal}>
        <Typography>View Details</Typography>
      </MenuItem>
    </Menu>
  )
}
