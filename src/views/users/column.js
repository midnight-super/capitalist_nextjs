// ** React Imports
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import OnlineIcon from '@/menu-icons/online';
import { Menu, MenuItem } from '@mui/material';
import { SuccessModal } from '@/views/componenets/successModal';
import UserAddModal from '@/views/users/modal/addModal';
import EmailSend from '@/views/users/modal/emailModa';
import CustomSwitch from '@/components/CustomSwitch';
import CustomTableHeaderTitle from '@/components/CustomTableHeaderTitle';
import { activate, deactivate, remove } from '@/services/client.service';
import toast from 'react-hot-toast';
import ChangePassword from './modal/changePassword';
import DeleteModal from '../componenets/deleteModal';

export const getColumns = ({
  colSorting,
  setColSorting,
  fetchClientUsers,
  clientUsers,
  pageNo,
  pageSize,
}) => {
  const RowOptions = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const rowOptionsOpen = Boolean(anchorEl);
    const [emailModal, setEmailModal] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isChecked, setIsChecked] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isView, setIsView] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    // API Calls
    const handleDeactivateUser = async (userId) => {
      const res = await deactivate(userId);
      if (res === 'OPERATION_SUCCESS') {
        toast.success('Client De-Activeted Successfully.');
        fetchClientUsers();
      }
    };
    const handleActivateeUser = async (userId) => {
      const res = await activate(userId);
      if (res === 'OPERATION_SUCCESS') {
        toast.success('Client Activated Successfully.');
        fetchClientUsers();
      }
    };
    const handleDeleteUser = async () => {
      handleRowOptionsClose();
      const res = await remove(row?.userId);
      if (res === 'OPERATION_SUCCESS') {
        toast.success('Client Deleted Successfully.');
        fetchClientUsers();
      }
    };

    const passwordModalOpen = (id) => {
      setPasswordOpen(true);
      setSelectedItem(id);
      setAddOpen(false);
    };
    const passwordModalClose = () => {
      setPasswordOpen(false);
      setSelectedItem(null);
    };

    const handleRowOptionsClick = (event) => {
      setAnchorEl(event.currentTarget);
      event.stopPropagation();
    };

    const handleRowOptionsClose = () => {
      setAnchorEl(null);
    };

    const handleAddOpen = (id) => {
      setAddOpen(true);
      setSelectedItem(id);
      handleRowOptionsClose();
    };
    const handleAddClose = () => {
      setAddOpen(false);
      setSelectedItem(null);
      setIsView(false);
    };

    const handleEmailOpen = () => {
      setEmailModal(true);
      handleRowOptionsClose();
    };
    const handleEmailClose = () => {
      setEmailModal(false);
    };
    const handleDeleteOpen = () => {
      handleRowOptionsClose();
      setOpenDelete(true);
    };
    const handleDeleteClose = () => {
      setOpenDelete(false);
    };
    const handleSwitchChange = (isChecked, userId) => {
      // setIsChecked(event.target.checked);
      if (isChecked === true) {
        handleActivateeUser(userId);
      } else {
        handleDeactivateUser(userId);
      }
      handleRowOptionsClose();
    };
    useEffect(() => {
      const handleResize = () => {
        handleRowOptionsClose();
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    useEffect(() => {
      if (success) {
        const timer = setTimeout(() => {
          setSuccess(false);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }, [success]);
    useEffect(() => {
      const handleScroll = () => {
        const scrollHeight = window.scrollY;
        if (scrollHeight > 0) {
          handleRowOptionsClose();
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
      <>
        <Typography
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          onClick={handleRowOptionsClick}
        >
          <img src="/icons/actionIcon.svg" alt="action" />
        </Typography>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          open={rowOptionsOpen}
          onClose={handleRowOptionsClose}
          disableScrollLock={true}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            zIndex: 1,
            mt: '10px',
            '& .MuiPaper-root': {
              width: '207px',
              fontSize: '15px',
              color: '#212121',
              boxShadow: ' 0px 0px 4px 0px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          <MenuItem
            sx={{ '& svg': { mr: 2 }, mb: '6px' }}
            onClick={() => {
              handleAddOpen(row?.userId), setIsView(true);
            }}
          >
            <Typography
              sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}
            >
              View Details
            </Typography>
          </MenuItem>
          <MenuItem
            sx={{ '& svg': { mr: 2 }, mb: '0px' }}
            onClick={() => handleAddOpen(row?.userId)}
          >
            <Typography
              sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}
            >
              Edit User
            </Typography>
          </MenuItem>
          <MenuItem sx={{ '& svg': { mr: 2 }, mb: '6px' }}>
            <Typography
              sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}
            >
              {row?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
            </Typography>
            <CustomSwitch
              checked={row?.status === 'ACTIVE'}
              onChange={() =>
                handleSwitchChange(row?.status !== 'ACTIVE', row?.userId)
              }
              inputProps={{ 'aria-label': 'controlled' }}
              sx={{
                ml: '10px',
              }}
            />
          </MenuItem>
          <MenuItem
            sx={{ '& svg': { mr: 2 }, mb: '0px' }}
            onClick={() => handleDeleteOpen()}
          >
            <Typography
              sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}
            >
              Delete
            </Typography>
          </MenuItem>
        </Menu>
        {success && (
          <SuccessModal open={success} close={() => setSuccess(false)} />
        )}
        {addOpen && (
          <UserAddModal
            passwordModalOpen={passwordModalOpen}
            fetchClientUsers={fetchClientUsers}
            isView={isView}
            editId={selectedItem}
            open={addOpen}
            close={handleAddClose}
            email={handleEmailOpen}
          />
        )}
        {emailModal && (
          <EmailSend
            open={emailModal}
            close={handleEmailClose}
            setSuccess={setSuccess}
            text={
              'An email will be sent to user inviting to create a new password'
            }
          />
        )}
        {passwordOpen && (
          <ChangePassword
            selectedItem={selectedItem}
            open={passwordOpen}
            close={passwordModalClose}
          />
        )}
        {openDelete && (
          <DeleteModal
            text={'user'}
            open={openDelete}
            close={handleDeleteClose}
            deleteClick={handleDeleteUser}
          />
        )}
      </>
    );
  };
  const columns = [
    {
      flex: 0.1,
      minWidth: 50,
      field: 'id',
      headerName: '#',
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: (params) => {
        const rowIndex = clientUsers?.findIndex((row) => row.id === params.id);
        return pageNo * pageSize + rowIndex + 1;
      },
    },
    {
      flex: 1,
      minWidth: 120,
      field: 'nameTitle',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Name'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const { nameTitle } = row;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* <Tooltip title={nameTitle} arrow placement="top"> */}
            <Typography variant="body1">{nameTitle}</Typography>
            {/* </Tooltip> */}
          </Box>
        );
      },
    },
    {
      flex: 1,
      minWidth: 150,
      field: 'email',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Email'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const { email } = row;

        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            <Typography variant="body1">{email}</Typography>
          </Box>
        );
      },
    },

    {
      flex: 0.5,
      minWidth: 120,
      field: 'status',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Status'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const { status } = row;
        const statusColor =
          status === 'ACTIVE'
            ? '#0FAA58'
            : status === 'INACTIVE'
              ? '#FF8477'
              : '#C4C4C4';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <OnlineIcon color={statusColor} />
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 400,
                color: statusColor,
                ml: '12px',
              }}
            >
              {status === 'ACTIVE' ? 'ACTIVE' : 'De-Activated'}
            </Typography>
          </Box>
        );
      },
    },
    {
      flex: 0.5,
      minWidth: 70,
      maxWidth: 70,
      sortable: false,
      field: 'actions',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Actions',
      renderCell: ({ row }) => <RowOptions row={row} />,
    },
  ];

  return columns;
};
