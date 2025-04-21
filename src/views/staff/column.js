// ** React Imports
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Avatar, Menu, MenuItem } from '@mui/material';
import CustomSwitch from '@/components/CustomSwitch';
import CustomTableHeaderTitle from '@/components/CustomTableHeaderTitle';
import { tableColumnStyles } from '@/styles/table-styles';
import { deleteStaff, blockStaff, unblockStaff } from '@/services/staff.service';
import toast from 'react-hot-toast';
import AddServiceModal from '../services/modal/addServiceModal';
import AddStaff from './modal/addStaff';
import OnlineIcon from '@/menu-icons/online';
import { useRouter } from "next/router";
import moment from 'moment';
import ConfirmDialog from '@/components/ConfirmDialog';

export const getColumns = ({
  colSorting,
  setColSorting,
  isMobile,
  fetchStaffData,
  staff,
  pageNo,
  pageSize,
  router,
  onSortModelChange
}) => {
  const RowOptions = ({ row }) => {
    const { actionIcon, menuContainer, menuItemText } = tableColumnStyles;

    const [anchorEl, setAnchorEl] = useState(null);
    const rowOptionsOpen = Boolean(anchorEl);
    const [success, setSuccess] = useState(false);
    const [isChecked, setIsChecked] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isActive, setIsActive] = useState(row.status === 'ACTIVE');

    const handleRowOptionsClick = (event) => {
      setAnchorEl(event.currentTarget);
      event.stopPropagation();
    };

    const handleRowOptionsClose = () => {
      setAnchorEl(null);
    };

    const handleDeleteClick = () => {
      handleRowOptionsClose();
      setConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
      try {
        const res = await deleteStaff(row.staffId);

        if (res === 'OPERATION_SUCCESS') {
          toast.success('Staff Deleted Successfully.');
          fetchStaffData();
        } else {
          toast.error('Failed to delete staff. Please try again later.');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('An error occurred while deleting the staff member.');
      } finally {
        setConfirmOpen(false);
      }
    };

    const handleViewDetails = () => {
      handleRowOptionsClose();
      router.push(`/user-management/staff/${row.staffId}`);
    };

    const handleStatusChange = async () => {
      try {
        const response = row.status === 'ACTIVE' ?
          await blockStaff(row.staffId) :
          await unblockStaff(row.staffId);

        if (response === 'OPERATION_SUCCESS') {
          toast.success(`Staff ${row.status === 'ACTIVE' ? 'deactivated' : 'activated'} successfully`);
          fetchStaffData(); // Refresh the data
        } else {
          toast.error('Failed to update status');
        }
      } catch (error) {
        console.error('Error updating status:', error);
        toast.error('Failed to update status');
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

    useEffect(() => {
      setIsActive(row.status === 'ACTIVE');
    }, [row.status]);

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
          sx={menuContainer}
        >
          <MenuItem onClick={handleViewDetails}>
            <Typography sx={menuItemText}>View Details</Typography>
          </MenuItem>
          <MenuItem>
            <Typography sx={{ ...menuItemText, mr: '10px' }}>
              {row.status === 'ACTIVE' ? 'Inactive' : 'Active'}
            </Typography>
            <CustomSwitch
              checked={false}
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
          content="Are you sure you want to delete this staff member? This action cannot be undone."
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
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Name'}
          colDef={{ field: 'fullName' }}
          colSorting={colSorting}
          setColSorting={setColSorting}
          onSortModelChange={onSortModelChange}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: true,
      hideSortIcons: true,
      renderCell: ({ row }) => {
        const { fullName, email } = row;
        const { namecolumn, profileBox, staffAvatar } = tableColumnStyles;

        // Get initials from full name
        const initials = fullName
          ?.split(' ')
          ?.map(name => name[0])
          ?.join('')
          ?.substring(0, 2)
          ?.toUpperCase() || '';

        return (
          <Box sx={namecolumn}>
            <Avatar
              sx={{
                ...staffAvatar,
                bgcolor: '#4489FE',
                color: '#fff',
                width: 40,
                height: 40,
                fontSize: '16px'
              }}
            >
              {initials}
            </Avatar>
            <Box sx={profileBox}>
              <Typography
                variant="body1"
                sx={{
                  color: '#212121',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px'
                }}
              >
                {fullName}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#757575',
                  fontSize: '12px',
                  lineHeight: '16px'
                }}
              >
                {email}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 1,
      minWidth: 150,
      field: 'designation',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Designation'}
          colDef={{ field: 'designation' }}
          colSorting={colSorting}
          setColSorting={setColSorting}
          onSortModelChange={onSortModelChange}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: true,
      hideSortIcons: true,
      renderCell: ({ row }) => {
        const { designation } = row;
        const { createdByColumn } = tableColumnStyles;
        return (
          <Box sx={createdByColumn}>
            <Typography variant="body1">{designation ? designation : "-"}</Typography>
          </Box>
        );
      },
    },
    {
      flex: 0.7,
      minWidth: 120,
      field: 'taskInprogress',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Task In Progress'}
          field="taskInprogress"
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: true,
      hideSortIcons: true,
      renderCell: ({ row }) => {
        const { inProgressTasks } = row;
        const { taskItem, moreTasksLink, profileBox } = tableColumnStyles;
        return (
          <Box sx={profileBox}>
            {inProgressTasks && inProgressTasks?.length > 0 ? (
              <>
                {inProgressTasks?.slice(0, 2)?.map((task) => (
                  <Typography key={task.taskId} sx={taskItem}>
                    {task.taskName ? task.taskName : "-"}
                  </Typography>
                ))}
                {inProgressTasks.length > 2 && (
                  <Typography sx={moreTasksLink}>
                    +{inProgressTasks.length - 2} More Task
                  </Typography>
                )}
              </>
            ) : "-"}
          </Box>
        );
      },
      sortComparator: (v1, v2, param1, param2) => {
        const a = param1.api.getRow(param1.id).inProgressTasks?.length || 0;
        const b = param2.api.getRow(param2.id).inProgressTasks?.length || 0;
        return a - b;
      },
    },
    {
      flex: 0.8,
      minWidth: 120,
      field: 'status',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Status'}
          colSorting={colSorting}
          setColSorting={setColSorting}
          field="status"
          
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
            <Typography sx={{
              color: isActive ? '#0FAA58' : '#FF4D49',
              fontSize: '14px'
            }}>
              {isActive ? 'Active' : 'Inactive'}
            </Typography>
          </Box>
        );
      },
    },
    {
      flex: 0.8,
      minWidth: 120,
      field: 'createdAt',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Date Created'}
          colSorting={colSorting}
          setColSorting={setColSorting}
          field="createdAt"
          
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: true,
      hideSortIcons: true,
      renderCell: ({ row }) => {
        const { createdAt } = row;
        const { namecolumn, dateColumn } = tableColumnStyles;

        // Format the date - only show date, no time
        const formattedDate = createdAt ? moment(createdAt).format('DD MMM YYYY') : '-';

        return (
          <Box sx={namecolumn}>
            <Typography variant="body1" sx={dateColumn}>
              {formattedDate}
            </Typography>
          </Box>
        );
      },
    },
    {
      flex: 0.8,
      minWidth: 120,
      field: 'updatedAt',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Last Modified'}
          colSorting={colSorting}
          setColSorting={setColSorting}
          field="updatedAt"
         
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: true,
      hideSortIcons: true,
      renderCell: ({ row }) => {
        const { updatedAt } = row;
        const { namecolumn, dateColumn } = tableColumnStyles;

        // Format the date - only show date, no time
        const formattedDate = updatedAt ? moment(updatedAt).format('DD MMM YYYY') : '-';

        return (
          <Box sx={namecolumn}>
            <Typography variant="body1" sx={dateColumn}>
              {formattedDate}
            </Typography>
          </Box>
        );
      },
    },
    {
      flex: 1,
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
