// ** React Imports
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Menu, MenuItem } from '@mui/material';
import CustomSwitch from '@/components/CustomSwitch';
import CustomTableHeaderTitle from '@/components/CustomTableHeaderTitle';
import moment from 'moment';
import { tableColumnStyles } from '@/styles/table-styles';
import { deleteDesignation } from '@/services/designation.service';
import toast from 'react-hot-toast';
import AddStaffDesignationModal from './modal/addStaffDesignationModal';

export const getColumns = ({
  colSorting,
  setColSorting,
  isMobile,
  fetchStaffDesignation,
}) => {
  const RowOptions = ({ row }) => {
    const { actionIcon, menuContainer, menuItemText } = tableColumnStyles;

    const [anchorEl, setAnchorEl] = useState(null);
    const rowOptionsOpen = Boolean(anchorEl);
    const [success, setSuccess] = useState(false);
    const [isChecked, setIsChecked] = useState(true);
    const [addOpen, setAddOpen] = useState(false);

    const handleAddOpen = () => {
      setAddOpen(true);
    };
    const handleAddClose = () => {
      setAddOpen(false);
    };

    const handleRowOptionsClick = (event) => {
      setAnchorEl(event.currentTarget);
      event.stopPropagation();
    };

    const handleRowOptionsClose = () => {
      setAnchorEl(null);
    };

    const handleDeleteDesignation = async (row) => {
      handleRowOptionsClose();
      const res = await deleteDesignation(row?.designationId);
      if (res === 'OPERATION_SUCCESS') {
        toast.success('Staff Designation Deleted Successfully.');
        fetchStaffDesignation();
      }
    };
    const handleEditCategory = async () => {
      handleRowOptionsClose();
      handleAddOpen();
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
          <MenuItem>
            <Typography sx={menuItemText}>View Details</Typography>
          </MenuItem>
          <MenuItem onClick={() => handleEditCategory(row)}>
            <Typography sx={menuItemText}>Edit</Typography>
          </MenuItem>
          <MenuItem>
            <Typography sx={{ ...menuItemText, mr: '10px' }}>
              {row?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
            </Typography>
            <CustomSwitch
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleDeleteDesignation(row)}>
            <Typography sx={menuItemText}>Delete</Typography>
          </MenuItem>
        </Menu>
        {addOpen && (
          <AddStaffDesignationModal
            open={addOpen}
            close={handleAddClose}
            fetchStaffDesignation={fetchStaffDesignation}
            editId={row?.designationId}
          />
        )}
      </>
    );
  };
  const columns = [
    {
      flex: 0.7,
      minWidth: 120,
      field: 'designationName',
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
        const { designationName } = row;
        const { namecolumn } = tableColumnStyles;
        return (
          <Box sx={namecolumn}>
            <Typography variant="body1">{designationName}</Typography>
          </Box>
        );
      },
    },
    {
      flex: 1.7,
      minWidth: 150,
      field: 'description',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Description'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const { description } = row;
        const { createdByColumn } = tableColumnStyles;
        return (
          <Box sx={createdByColumn}>
            <Typography variant="body1">{description}</Typography>
          </Box>
        );
      },
    },
    {
      flex: 0.6,
      minWidth: 120,
      field: 'createdAt',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Date Created'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
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
      flex: 0.6,
      minWidth: 120,
      field: 'updatedAt',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Last Modified'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
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
