// ** React Imports
import React from 'react'
import Typography from '@mui/material/Typography'
import { Link, Menu, MenuItem } from '@mui/material'

const baseURL = process.env.NEXT_PUBLIC_BASE_URL

export default function ActionMenu({
  anchorEl,
  closeRowActionMenu,
  openDetailModal,
  openFlagModal,
  openShareModal,
  row,
}) {
  return (
    <Menu
      keepMounted
      anchorEl={anchorEl}
      open={anchorEl !== null}
      onClose={closeRowActionMenu}
      disableScrollLock={true}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ zIndex: 1, marginTop: 10 }}
    >
      <MenuItem onClick={openDetailModal}>View Details</MenuItem>

      <MenuItem>
        <Link
          rel="noopener noreferrer"
          target="_blank"
          // get the accessToken late, so it is rendered in the browser context
          href={`${baseURL}/restricted/preview/${row?.fileId}?token=${localStorage.getItem('accessToken')}`}
        >
          Preview
        </Link>
      </MenuItem>

      <MenuItem onClick={openFlagModal}>Flag</MenuItem>

      <MenuItem onClick={openShareModal}>Share</MenuItem>

      <MenuItem>
        <Link
          rel="noopener noreferrer"
          target="_blank"
          // get the accessToken late, so it is rendered in the browser context
          href={`${baseURL}/restricted/downloads/${row?.fileId}?token=${localStorage.getItem('accessToken')}`}
        >
          Download
        </Link>
      </MenuItem>
    </Menu>
  )
}
