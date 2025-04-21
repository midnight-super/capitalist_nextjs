import { useAuth } from '@/hooks/useAuth';
import { Menu, MenuItem } from '@mui/material';
import React from 'react';

const LogoutModal = ({ anchorEl, handleClose }) => {
  const { logout } = useAuth();

  const open = Boolean(anchorEl);
  const handleLogout = () => {
    logout();
    handleClose & handleClose();
  };
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
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default LogoutModal;
