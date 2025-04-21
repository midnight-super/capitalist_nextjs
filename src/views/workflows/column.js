// ** React Imports
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import OnlineIcon from '@/menu-icons/online';
import { Menu, MenuItem } from '@mui/material';
import CustomSwitch from '@/components/CustomSwitch';
import CustomTableHeaderTitle from '@/components/CustomTableHeaderTitle';
import moment from 'moment';
import { tableColumnStyles } from '@/styles/table-styles';
import { deleteWorkflow, updateWorkflow } from '@/services/workflow.service';
import toast from 'react-hot-toast';

export const getColumns = ({
  colSorting,
  setColSorting,
  isMobile,
  fetchWorkflowList,
  setEditId,
  handleAddOpen
}) => {
  const RowOptions = ({ row }) => {
    const { actionIcon, menuContainer, menuItemText } = tableColumnStyles;

    const [anchorEl, setAnchorEl] = useState(null);
    const rowOptionsOpen = Boolean(anchorEl);
    const [success, setSuccess] = useState(false);
    const [isChecked, setIsChecked] = useState(row?.status === 'ACTIVE');

    const handleRowOptionsClick = (event) => {
      setAnchorEl(event.currentTarget);
      event.stopPropagation();
    };

    const handleRowOptionsClose = () => {
      setAnchorEl(null);
    };

    const handleEditRow = (editId) => {
      setEditId(editId)
      handleAddOpen()
    }

    const handleStatusChange = async () => {
      const newStatus = !isChecked ? 'ACTIVE' : 'INACTIVE';
      const updatedWorkflow = {
        ...row,
        status: newStatus
      };

      const res = await updateWorkflow(updatedWorkflow);
      if (res === 'OPERATION_SUCCESS') {
        setIsChecked(!isChecked);
        toast.success(`Workflow ${newStatus.toLowerCase()} successfully`);
        fetchWorkflowList();
      } else {
        toast.error('Failed to update workflow status');
      }
    };

    const handleDeleteWorkflow = async (row) => {
      handleRowOptionsClose();
      const res = await deleteWorkflow(row?.workflowId);
      if (res === 'OPERATION_SUCCESS') {
        toast.success('Workflow Deleted Successfully.');
        fetchWorkflowList();
      }
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
          <MenuItem onClick={() => handleEditRow(row?.workflowId)}>
            <Typography sx={menuItemText}>Edit</Typography>
          </MenuItem>
          <MenuItem>
            <Typography sx={{ ...menuItemText, mr: '10px' }}>
              {isChecked ? 'Deactivate' : 'Activate'}
            </Typography>
            <CustomSwitch
              checked={isChecked}
              onChange={handleStatusChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleDeleteWorkflow(row)}>
            <Typography sx={menuItemText}>Delete</Typography>
          </MenuItem>
        </Menu>
      </>
    );
  };
  const columns = [
    {
      flex: 0.6,
      minWidth: 120,
      field: 'workflowName',
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
        const { workflowName } = row;
        const { namecolumn } = tableColumnStyles;
        return (
          <Box sx={namecolumn}>
            <Typography variant="body1">{workflowName ? workflowName : "="}</Typography>
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
            ...createdByColumn,
            overflow: 'hidden',
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
      flex: 0.8,
      minWidth: 120,
      field: 'serviceName',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Service Name'}
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
      minWidth: 120,
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
          <>
            <Box sx={namecolumn}>
              <Box>
                <Typography variant="body1" sx={dateColumn}>
                  {
                    formattedDate
                      ? !isMobile
                        ? formattedDate + (formattedTime ? ' , ' + formattedTime : '-')
                        : formattedDate + ' , '
                      : '-'
                  }
                </Typography>
                {isMobile && (
                  <Typography variant="body1" sx={timeColor}>
                    {formattedTime ? formattedTime : "-"}
                  </Typography>
                )}
              </Box>
            </Box>
          </>
        );
      },
    },
    {
      flex: 1,
      minWidth: 120,
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
          row?.updatedAt && moment(row?.updatedAt).format('hh:mm A');
        const formattedDate =
          row?.updatedAt && moment(row?.updatedAt).format('DD MMM YYYY');
        const { namecolumn, dateColumn, timeColor } = tableColumnStyles;
        return (
          <>
            <Box sx={namecolumn}>
              <Box>
                <Typography variant="body1" sx={dateColumn}>
                  {
                    formattedDate
                      ? !isMobile
                        ? formattedDate + (formattedTime ? ' , ' + formattedTime : '-')
                        : formattedDate + ' , '
                      : '-'
                  }
                </Typography>
                {isMobile && (
                  <Typography variant="body1" sx={timeColor}>
                    {formattedTime ? formattedTime : "-"}
                  </Typography>
                )}
              </Box>
            </Box>
          </>
        );
      },
    },
    {
      flex: 0.4,
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
          status === 'ACTIVE' ? '#0FAA58' : '#C4C4C4';
        const { namecolumn, statusText } = tableColumnStyles;
        return (
          <Box sx={namecolumn}>
            <OnlineIcon color={statusColor} />
            <Typography
              sx={{
                ...statusText,
                color: statusColor,
              }}
            >
              {status || 'INACTIVE'}
            </Typography>
          </Box>
        );
      },
    },
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
