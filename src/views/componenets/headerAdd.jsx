import { Menu, MenuItem } from '@mui/material';
import React from 'react';

const HeaderAdd = ({ anchorEl, handleClose, userOpen, eventOpen }) => {
  const open = Boolean(anchorEl);

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        disablePortal
        sx={{
          '& .MuiPaper-root': {
            width: '160px',
            fontSize: '15px',
            color: '#212121',
            boxShadow: ' 0px 0px 4px 0px rgba(0, 0, 0, 0.15)',
          },
        }}
        disableScrollLock={true}
      >
        <MenuItem onClick={userOpen}>Create User</MenuItem>
        <MenuItem onClick={eventOpen}>Create Event</MenuItem>
      </Menu>
    </>
  );
};

export default HeaderAdd;
