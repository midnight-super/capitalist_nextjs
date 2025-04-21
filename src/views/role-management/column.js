import React, { useState, useEffect } from 'react';
import { Box, Typography, Menu, MenuItem } from '@mui/material';
import { tableColumnStyles } from '@/styles/table-styles';
import CustomTableHeaderTitle from '@/components/CustomTableHeaderTitle';
import { deleteRole, updateRole } from '@/services/role.service';
import toast from 'react-hot-toast';
import moment from 'moment';
import CustomSwitch from '@/components/CustomSwitch';

export const getColumns = ({
  colSorting,
  setColSorting,
  onEdit,
  fetchRoles,
  router,
}) => {
  const { actionIcon, menuContainer, menuItemText } = tableColumnStyles;

  const RowOptions = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const rowOptionsOpen = Boolean(anchorEl);
    const [isActive, setIsActive] = useState(row.status === 'ACTIVE');

    const handleRowOptionsClick = (event) => {
      setAnchorEl(event.currentTarget);
      event.stopPropagation();
    };

    const handleRowOptionsClose = () => {
      setAnchorEl(null);
    };

    const handleEditClick = () => {
      router.push({
        pathname: '/user-management/role-management/permission',
        query: {
          roleId: row.roleId,
          permissionId: row.permissionIds[0], // Assuming first permission template is used
          edit: true
        }
      });
      handleRowOptionsClose();
    };

    const handleDeleteClick = async () => {
      try {
        const response = await deleteRole(row.roleId);
        if (response === 'OPERATION_SUCCESS') {
          toast.success('Role deleted successfully');
          fetchRoles();
        } else {
          toast.error('Failed to delete role');
        }
      } catch (error) {
        console.error('Error deleting role:', error);
        toast.error('Failed to delete role');
      }
      handleRowOptionsClose();
    };

    const handleStatusChange = async () => {
      try {
        const newStatus = row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        const rolePayload = {
          roleId: row.roleId,
          roleName: row.roleName,
          description: row.description,
          permissionIds: row.permissionIds,
          status: newStatus
        };

        const response = await updateRole(rolePayload);

        if (response === 'OPERATION_SUCCESS') {
          toast.success(`Role ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`);
          fetchRoles();
          setIsActive(!isActive);
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
      setIsActive(row.status === 'ACTIVE');
    }, [row.status]);

    return (
      <>
        <Typography sx={actionIcon} onClick={handleRowOptionsClick}>
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
          <MenuItem onClick={handleEditClick}>
            <Typography sx={menuItemText}>Edit</Typography>
          </MenuItem>
          <MenuItem>
            <Typography sx={{ ...menuItemText, mr: '10px' }}>
              {row.status === 'ACTIVE' ? 'Inactive' : 'Active'}
            </Typography>
            <CustomSwitch
              checked={isActive}
              onChange={handleStatusChange}
            />
          </MenuItem>
          <MenuItem onClick={handleDeleteClick}>
            <Typography sx={menuItemText}>Delete</Typography>
          </MenuItem>
        </Menu>
      </>
    );
  };

  return [
    {
      field: 'roleName',
      headerName: 'Role Name',
      flex: 1,
      minWidth: 180,
      hideSortIcons: true,
      sortable: true,
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Role Name'}
          colSorting={colSorting}
          setColSorting={setColSorting}
          field="roleName"
        />
      ),
      renderCell: (params) => (
        <Typography variant="text14Weight400">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.5,
      minWidth: 200,
      hideSortIcons: true,
      sortable: true,
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Description'}
          colSorting={colSorting}
          setColSorting={setColSorting}
          field="description"
        />
      ),
      renderCell: (params) => (
        <Typography variant="text14Weight400">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 120,
      hideSortIcons: true,
      sortable: true,
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Status'}
          colSorting={colSorting}
          setColSorting={setColSorting}
          field="status"
        />
      ),
      renderCell: (params) => {
        const getStatusColor = (status) => {
          switch (status) {
            case 'ACTIVE':
              return '#0FAA58';
            case 'INACTIVE':
              return '#FF4D49';
            case 'DELETED':
              return '#666666'; // Gray color for deleted status
            default:
              return '#666666';
          }
        };

        const getStatusText = (status) => {
          switch (status) {
            case 'ACTIVE':
              return 'Active';
            case 'INACTIVE':
              return 'Inactive';
            case 'DELETED':
              return 'Deleted';
            default:
              return status;
          }
        };

        const color = getStatusColor(params.value);

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: color,
              }}
            />
            <Typography
              variant="text14Weight400"
              sx={{
                color: color,
              }}
            >
              {getStatusText(params.value)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      flex: 1,
      minWidth: 150,
      hideSortIcons: true,
      sortable: true,
      renderHeader: () => (
        <CustomTableHeaderTitle
          title="Date Created"
          colSorting={colSorting}
          setColSorting={setColSorting}
          colDef={{ field: 'createdAt' }}
          onSortModelChange={router.onSortModelChange}
          sortIcons={{
            asc: '/icons/createdAt_sort_up.svg',
            desc: '/icons/createdAt_sort_down.svg',
            clear: '/icons/createdAt_sort_clear.svg',
          }}
        />
      ),
      renderCell: ({ row }) => {
        return (
          <Typography variant="body2">
            {moment(row.createdAt).format('DD MMM YYYY')}
          </Typography>
        );
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Last Modified',
      flex: 1,
      minWidth: 150,
      hideSortIcons: true,
      sortable: true,
      renderHeader: () => (
        <CustomTableHeaderTitle
          title="Last Modified"
          colSorting={colSorting}
          setColSorting={setColSorting}
          colDef={{ field: 'updatedAt' }}
          onSortModelChange={router.onSortModelChange}
          sortIcons={{
            asc: '/icons/updatedAt_sort_up.svg',
            desc: '/icons/updatedAt_sort_down.svg',
            clear: '/icons/updatedAt_sort_clear.svg',
          }}
        />
      ),
      renderCell: ({ row }) => {
        return (
          <Typography variant="body2">
            {moment(row.updatedAt).format('DD MMM YYYY')}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 70,
      maxWidth: 70,
      sortable: false,
      field: 'actions',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Actions',
      renderCell: ({ row }) => <RowOptions row={row} />
    },
  ];
};