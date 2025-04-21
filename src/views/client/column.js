// ** React Imports
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Avatar, Menu, MenuItem, Chip, Link } from '@mui/material';
import CustomSwitch from '@/components/CustomSwitch';
import CustomTableHeaderTitle from '@/components/CustomTableHeaderTitle';
import { tableColumnStyles } from '@/styles/table-styles';
import { deleteClient } from '@/services/client.service';
import { deleteStaff, blockStaff, unblockStaff } from '@/services/staff.service';
import toast from 'react-hot-toast';
import AddServiceModal from '../services/modal/addServiceModal';
import AddClientModal from './modal/addClientModal';
import OnlineIcon from '@/menu-icons/online';
import moment from 'moment';
import AddSubUserModal from './modal/addSubUserModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import SubUsersModal from './modal/subUsersModal';
import Image from 'next/image';

// First, create a separate component for the sub-users cell
const SubUsersCell = ({ row, fetchClientData }) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (!row.isMainUser) {
    return (
      <Typography variant="body2">
        0 Sub-users
      </Typography>
    );
  }

  const subUserCount = row.subUsers?.length || 0;
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        {subUserCount > 0 ? (
          <Link
            href="#"
            sx={{ textDecoration: 'underline', color: '#4489FE', cursor: 'pointer' }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setModalOpen(true);
            }}
          >
            {subUserCount} {subUserCount === 1 ? 'Sub-user' : 'Sub-users'}
          </Link>
        ) : (
          <Typography variant="body2">
            0 Sub-users
          </Typography>
        )}
      </Box>
      {modalOpen && subUserCount > 0 && (
        <SubUsersModal
          open={modalOpen}
          close={() => setModalOpen(false)}
          subUsers={row.subUsers || []}
          clientName={row.admin?.fullName || row.company?.title || 'Unknown Client'}
          fetchClientData={fetchClientData}
        />
      )}
    </>
  );
};

export const getColumns = ({
  colSorting,
  setColSorting,
  isMobile,
  fetchClientData,
  clients,
  pageNo,
  pageSize,
  fetchClients,
  router,
}) => {
  const { actionIcon, menuContainer, menuItemText } = tableColumnStyles;
  const RowOptions = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isActive, setIsActive] = useState(row.status === 'ACTIVE');

    const handleRowOptionsClick = (event) => {
      setAnchorEl(event.currentTarget);
      event.stopPropagation();
    };

    const handleRowOptionsClose = () => {
      setAnchorEl(null);
    };

    const handleViewDetails = () => {
      handleRowOptionsClose();
      const id = row.isMainUser ? row.admin.staffId : row.staffId;
      router.push(`/user-management/staff/${id}?clientUser=true`);
    };

    const handleDeleteClick = () => {
      handleRowOptionsClose();
      setConfirmOpen(true);
    };

    const handleStatusChange = async () => {
      try {
        let staffId;

        if (row.isMainUser && row.admin) {
          staffId = row.admin.staffId;
        } else if (row.staffId) {
          staffId = row.staffId;
        } else {
          toast.error('Unable to find user ID');
          return;
        }

        if (!staffId) {
          toast.error('Invalid user ID');
          return;
        }

        const response = row.status === 'ACTIVE' ?
          await blockStaff(staffId) :
          await unblockStaff(staffId);

        if (response === 'OPERATION_SUCCESS') {
          setIsActive(!isActive);
          toast.success(`User ${row.status === 'ACTIVE' ? 'deactivated' : 'activated'} successfully`);
          fetchClients(); // Refresh the data
        } else {
          toast.error('Failed to update status');
        }
      } catch (error) {
        console.error('Error updating status:', error);
        toast.error('Failed to update status');
      }
      handleRowOptionsClose();
    };

    const handleDeleteConfirm = async () => {
      try {
        let res;

        if (row.isMainUser) {
          // Delete client (main user)
          res = await deleteClient(row?.clientId);

          if (res === 'OPERATION_SUCCESS') {
            toast.success('Client Deleted Successfully.');
            fetchClients();
          } else if (res === 'OPERATION_FAILURE') {
            toast.error('Cannot delete client. Client may have active projects or tasks.');
          } else {
            toast.error('Failed to delete client. Please try again later.');
          }
        } else {
          // Delete sub-user using staff delete API
          res = await deleteStaff(row.staffId);

          if (res === 'OPERATION_SUCCESS') {
            toast.success('Sub-user Deleted Successfully.');
            fetchClients();
          } else {
            toast.error('Failed to delete sub-user. Please try again later.');
          }
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(`An error occurred while deleting the ${row.isMainUser ? 'client' : 'sub-user'}.`);
      } finally {
        setConfirmOpen(false);
      }
    };

    // Update isActive state when row status changes
    useEffect(() => {
      setIsActive(row.status === 'ACTIVE');
    }, [row.status]);

    // Handle window resize
    useEffect(() => {
      const handleResize = () => {
        handleRowOptionsClose();
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    // Handle scroll
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
        <Typography sx={{
          ...actionIcon,
          '& img': {
            width: '16px', // Adjust size of three dots
            height: 'auto'
          }
        }} onClick={handleRowOptionsClick}>
          <img src="/icons/actionIcon.svg" alt="action" />
        </Typography>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
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
          sx={menuContainer}
        >
          <MenuItem onClick={handleViewDetails}>
            <Typography sx={menuItemText}>View Details</Typography>
          </MenuItem>
          <MenuItem>
            <Typography sx={{ ...menuItemText, mr: '10px' }}>
              {/* Show the opposite action */}
              {row.status === 'ACTIVE' ? 'Inactive' : 'Active'}
            </Typography>
            <CustomSwitch
              // Switch should be ON when we want to apply the displayed action
              checked={false} // Always false since we're showing the opposite action
              onChange={handleStatusChange}
            />
          </MenuItem>
          <MenuItem onClick={handleDeleteClick}>
            <Typography sx={menuItemText}>Delete</Typography>
          </MenuItem>
        </Menu>

        <ConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Confirm Delete"
          content={`Are you sure you want to delete this ${row.isMainUser ? 'client' : 'sub-user'}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </>
    );
  };
  const columns = [
    {
      flex: 1.2,
      minWidth: 250,
      field: 'fullName',
      renderHeader: () => (
        <CustomTableHeaderTitle
          title="Name"
          colSorting={colSorting}
          setColSorting={setColSorting}
          colDef={{ field: 'fullName' }}
          onSortModelChange={router.onSortModelChange}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: true,
      hideSortIcons: true,
      renderCell: ({ row }) => {
        const { admin, company } = row;
        const initials = row.fullName
          ?.split(' ')
          ?.map((name) => name[0])
          ?.join('')
          ?.substring(0, 2)
          ?.toUpperCase() || '';

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#4489FE',
                color: '#fff',
                fontSize: '16px',
              }}
            >
              {initials}
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#212121',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '20px',
                  }}
                >
                  {row.fullName}
                  {row.isMainUser && (
                    <Typography
                      component="span"
                      sx={{
                        color: '#757575',
                        fontSize: '14px',
                        fontWeight: 300,
                        ml: 1,
                      }}
                    >
                      (Main User)
                    </Typography>
                  )}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#757575',
                  fontSize: '12px',
                  lineHeight: '16px',
                }}
              >
                {row.email}
              </Typography>
            </Box>
          </Box>
        );
      },
    },

    // Projects
    {
      flex: 1,
      minWidth: 150,
      field: 'projects',
      renderHeader: () => (
        <CustomTableHeaderTitle
          title="Projects"
          colSorting={colSorting}
          setColSorting={setColSorting}
          colDef={{ field: 'projects' }}
          onSortModelChange={router.onSortModelChange}

        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: true,
      hideSortIcons: true,
      renderCell: ({ row }) => {
        if (!row.isMainUser) {
          return (
            <Typography variant="body2">
              0 Projects
            </Typography>
          );
        }

        const projectCount = row?.projects?.length || 0;
        return (
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              {projectCount} {projectCount === 1 ? 'Project' : 'Projects'}
            </Typography>
            {projectCount > 0 && (
              <Link href="#" sx={{ textDecoration: 'underline', color: '#4489FE', cursor: 'pointer' }} onClick={(e) => e.preventDefault()}>
                View Details
              </Link>
            )}
          </Box>
        );
      },
    },

    // Status Column
    {
      flex: 0.8,
      minWidth: 120,
      field: 'status',
      renderHeader: () => (
        <CustomTableHeaderTitle
          title="Status"
          colSorting={colSorting}
          setColSorting={setColSorting}
          colDef={{ field: 'status' }}
          onSortModelChange={router.onSortModelChange}

        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: true,
      hideSortIcons: true,
      renderCell: ({ row }) => {
        const isActive = row.status === 'ACTIVE';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: isActive ? '#0FAA58' : '#FF4D49',
              }}
            />
            <Typography
              sx={{
                color: isActive ? '#0FAA58' : '#FF4D49',
                fontSize: '14px',
              }}
            >
              {isActive ? 'Active' : 'Inactive'}
            </Typography>
          </Box>
        );
      },
    },

    // Date Created
    {
      flex: 0.8,
      minWidth: 120,
      field: 'createdAt',
      renderHeader: () => (
        <CustomTableHeaderTitle
          title="Date Created"
          colSorting={colSorting}
          setColSorting={setColSorting}
          colDef={{ field: 'createdAt' }}
          onSortModelChange={router.onSortModelChange}

        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: true,
      hideSortIcons: true,
      renderCell: ({ row }) => {
        let dateToShow;
        if (row.isMainUser) {
          dateToShow = row.createdAt;
        } else {
          dateToShow = row.createAt || row.createdAt || row.createDate || row.created_at;
        }

        const formattedDate = dateToShow ? moment(dateToShow).format('DD MMM YYYY') : '-';
        return <Typography variant="body2">{formattedDate}</Typography>;
      },
    },
    // Last Modified
    {
      flex: 0.8,
      minWidth: 120,
      field: 'updatedAt',
      renderHeader: () => (
        <CustomTableHeaderTitle
          title="Last Modified"
          colSorting={colSorting}
          setColSorting={setColSorting}
          colDef={{ field: 'updatedAt' }}
          onSortModelChange={router.onSortModelChange}

        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: true,
      hideSortIcons: true,
      renderCell: ({ row }) => {
        let dateToShow;
        if (row.isMainUser) {
          dateToShow = row.updatedAt;
        } else {
          dateToShow = row.updatedAt || row.updateAt || row.updated_at || row.lastModified;
        }

        const formattedDate = dateToShow ? moment(dateToShow).format('DD MMM YYYY') : '-';
        return <Typography variant="body2">{formattedDate}</Typography>;
      },
    },
    // Sub Users

    {
      field: 'subUsers',
      renderHeader: () => (
        <CustomTableHeaderTitle
          title="Sub Users"
          colSorting={colSorting}
          setColSorting={setColSorting}
          colDef={{ field: 'subUsers' }}
          onSortModelChange={router.onSortModelChange}
        />
      ),
      width: 130,
      sortable: true,
      hideSortIcons: true,
      renderCell: ({ row }) => <SubUsersCell row={row} fetchClientData={fetchClientData} />,
    },
    // actions
    {
      flex: 0.4,
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
