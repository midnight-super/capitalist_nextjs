// ** React Imports
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Menu, MenuItem } from '@mui/material';
import CustomTableHeaderTitle from '@/components/CustomTableHeaderTitle';
import moment from 'moment';
import { tableColumnStyles } from '@/styles/table-styles';
import toast from 'react-hot-toast';
import AddTaskTypeModal from '../task-type/modal/addTaskTypeModal';
import { deleteTaskType } from '@/services/taskType.service';

export const getColumns = ({
  colSorting,
  setColSorting,
  isMobile,
  fetchAddOns,
}) => {
  const RowOptions = ({ row }) => {
    const { actionIcon, menuContainer, menuItemText } = tableColumnStyles;

    const [anchorEl, setAnchorEl] = useState(null);
    const rowOptionsOpen = Boolean(anchorEl);
    const [success, setSuccess] = useState(false);
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

    const handleTaskTypeOns = async (row) => {
      handleRowOptionsClose();
      const res = await deleteTaskType(row?.taskTypeId);
      if (res === 'OPERATION_SUCCESS') {
        toast.success('Task type Deleted Successfully.');
        fetchAddOns();
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
          <MenuItem onClick={() => handleEditCategory(row)}>
            <Typography sx={menuItemText}>Edit</Typography>
          </MenuItem>
          <MenuItem onClick={() => handleTaskTypeOns(row)}>
            <Typography sx={menuItemText}>Delete</Typography>
          </MenuItem>
        </Menu>
        {addOpen && (
          <AddTaskTypeModal
            open={addOpen}
            close={handleAddClose}
            fetchAddOns={fetchAddOns}
            editId={row?.taskTypeId}
            taskTypeName={row?.taskTypeName}
          />
        )}
      </>
    );
  };
  const columns = [
    {
      flex: 1,
      minWidth: 120,
      field: 'name',
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
        const { taskTypeName } = row;
        const { namecolumn } = tableColumnStyles;
        return (
          <Box sx={namecolumn}>
            <Typography variant="body1">{taskTypeName ? taskTypeName : "-"}</Typography>
          </Box>
        );
      },
    },
    {
      flex: 1.2,
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
          <Box sx={{
            ...createdByColumn, overflow: 'hidden',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            textOverflow: 'ellipsis',
          }}>
            <Typography variant="body1">{description ? description : "-"}</Typography>
          </Box>
        );
      },
    },
    {
      flex: 1,
      minWidth: 120,
      field: 'service',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Service'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const { serviceName } = row;
        const { namecolumn } = tableColumnStyles;
        return (
          <Box sx={namecolumn}>
            <Typography variant="body1">{serviceName ? serviceName : "-"}</Typography>
          </Box>
        );
      },
    },
    {
      flex: 1,
      minWidth: 150,
      field: 'dateCreated',
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
        const formattedTime =
          row?.createdAt && moment(row?.createdAt).format('hh:mm A');
        const formattedDate =
          row?.createdAt && moment(row?.createdAt).format('DD MMM YYYY');
        const { namecolumn, dateColumn, timeColor } = tableColumnStyles;
        return (
          <Box sx={namecolumn}>
            <Box>
              <Typography variant="body1" sx={dateColumn}>
                {!isMobile
                  ? (formattedDate ? formattedDate + ' , ' + formattedTime : '-')
                  : (formattedDate ? formattedDate + ' , ' : '-')}
              </Typography>
              {isMobile && (
                <Typography variant="body1" sx={timeColor}>
                  {formattedTime ? formattedTime : "-"}
                </Typography>
              )}
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 1,
      minWidth: 150,
      field: 'lastModified',
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
        const formattedTime =
          row?.createdAt && moment(row?.updatedAt).format('hh:mm A');
        const formattedDate =
          row?.createdAt && moment(row?.updatedAt).format('DD MMM YYYY');
        const { namecolumn, dateColumn, timeColor } = tableColumnStyles;

        return (
          <Box sx={namecolumn}>
            <Box>
              <Typography variant="body1" sx={dateColumn}>
                {!isMobile
                  ? (formattedDate ? formattedDate + ' , ' + formattedTime : '-')
                  : (formattedDate ? formattedDate + ' , ' : '-')}

              </Typography>
              {isMobile && (
                <Typography variant="body1" sx={timeColor}>
                  {formattedTime ? formattedTime : "-"}
                </Typography>
              )}
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.3,
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
