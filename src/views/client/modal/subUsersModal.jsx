import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
} from '@mui/material';
import CustomTable from '@/components/CustomTable';
import CloseIcon from '@mui/icons-material/Close';
import CustomSwitch from '@/components/CustomSwitch';
import { blockStaff, unblockStaff, deleteStaff } from '@/services/staff.service';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import { tableColumnStyles } from '@/styles/table-styles';
import { useRouter } from 'next/router';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import moment from 'moment';
import { Global } from '@emotion/react';

const SubUsersModal = ({ open, close, subUsers, clientName, fetchClientData }) => {
    const router = useRouter();
    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState({});
    const [localData, setLocalData] = useState(subUsers || []);
    const [sortModel, setSortModel] = useState([
        {
            field: 'createdAt',
            sort: 'desc'
        }
    ]);

    useEffect(() => {
        setLocalData(subUsers || []);
    }, [subUsers]);

    const { actionIcon, menuContainer, menuItemText } = tableColumnStyles;

    const handleStatusChange = async (row, isActive) => {
        try {
            const response = isActive ?
                await blockStaff(row.staffId) :
                await unblockStaff(row.staffId);

            if (response === 'OPERATION_SUCCESS') {
                toast.success(`User ${isActive ? 'deactivated' : 'activated'} successfully`);

                if (typeof fetchClientData === 'function') {
                    fetchClientData();
                }

                setLocalData(prevData =>
                    prevData.map(user =>
                        user.staffId === row.staffId
                            ? { ...user, status: isActive ? 'BLOCKED' : 'ACTIVE' }
                            : user
                    )
                );
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleDeleteConfirm = async (row) => {
        try {
            const response = await deleteStaff(row.staffId);
            if (response === 'OPERATION_SUCCESS') {
                toast.success('Sub-user deleted successfully');

                if (typeof fetchClientData === 'function') {
                    fetchClientData();
                }

                setLocalData(prevData =>
                    prevData.filter(user => user.staffId !== row.staffId)
                );
            } else {
                toast.error('Failed to delete sub-user');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete sub-user');
        }
    };

    const RowOptions = ({ row }) => {
        const [anchorEl, setAnchorEl] = useState(null);
        const [confirmOpen, setConfirmOpen] = useState(false);
        const isActive = row.status === 'ACTIVE';

        const handleRowOptionsClick = (event) => {
            setAnchorEl(event.currentTarget);
            event.stopPropagation();
        };

        const handleRowOptionsClose = () => {
            setAnchorEl(null);
        };

        return (
            <>
                <Typography sx={actionIcon} onClick={handleRowOptionsClick}>
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
                    sx={{
                        ...menuContainer,
                        zIndex: 99999,
                    }}
                >
                    <MenuItem onClick={() => {
                        handleRowOptionsClose();
                        router.push(`/user-management/staff/${row.staffId}`);
                    }}>
                        <Typography sx={menuItemText}>View Details</Typography>
                    </MenuItem>
                    <MenuItem>
                        <Typography sx={{ ...menuItemText, mr: '10px' }}>
                            {isActive ? 'Inactive' : 'Active'}
                        </Typography>
                        <CustomSwitch
                            checked={isActive}
                            onChange={() => {
                                handleStatusChange(row, isActive);
                                handleRowOptionsClose();
                            }}
                        />
                    </MenuItem>
                    <MenuItem onClick={() => {
                        setConfirmOpen(true);
                        handleRowOptionsClose();
                    }}>
                        <Typography sx={menuItemText}>Delete</Typography>
                    </MenuItem>
                </Menu>

                <ConfirmDialog
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={() => {
                        handleDeleteConfirm(row);
                        setConfirmOpen(false);
                    }}
                    title="Confirm Delete"
                    content="Are you sure you want to delete this sub-user? This action cannot be undone."
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
            headerName: 'Name',
            renderCell: ({ row }) => {
                const initials = row.fullName
                    ?.split(' ')
                    ?.map(name => name[0])
                    ?.join('')
                    ?.substring(0, 2)
                    ?.toUpperCase() || '';

                return (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}>
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: '#4489FE',
                                color: '#fff',
                                fontSize: '16px'
                            }}
                        >
                            {initials}
                        </Avatar>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body1" sx={{
                                color: '#212121',
                                fontSize: '14px',
                                fontWeight: 500,
                                lineHeight: '20px'
                            }}>
                                {row.fullName}
                            </Typography>
                            <Typography variant="body2" sx={{
                                color: '#757575',
                                fontSize: '12px',
                                lineHeight: '16px'
                            }}>
                                {row.email}
                            </Typography>
                        </Box>
                    </Box>
                );
            },
        },
        {
            flex: 1,
            minWidth: 150,
            field: 'contactNumber',
            headerName: 'Contact Number',
            renderCell: ({ row }) => (
                <Typography variant="body2">
                    {row.contactNumber}
                </Typography>
            ),
        },
        {
            flex: 0.8,
            minWidth: 120,
            field: 'status',
            headerName: 'Status',
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
            headerName: 'Date Created',
            headerAlign: 'start',
            align: 'start',
            renderCell: ({ row }) => {
                const dateToShow = row.createAt || row.createdAt || row.created_at;
                const formattedDate = dateToShow ? moment(dateToShow).format('DD MMM YYYY') : '-';
                return (
                    <Typography variant="body2">
                        {formattedDate}
                    </Typography>
                );
            },
        },
        {
            flex: 0.8,
            minWidth: 120,
            field: 'updatedAt',
            headerName: 'Last Modified',
            headerAlign: 'start',
            align: 'start',
            renderCell: ({ row }) => {
                const dateToShow = row.updatedAt || row.updateAt || row.updated_at;
                const formattedDate = dateToShow ? moment(dateToShow).format('DD MMM YYYY') : '-';
                return (
                    <Typography variant="body2">
                        {formattedDate}
                    </Typography>
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

    const handleSearch = (searchValue) => {
        setSearchQuery(searchValue);
        if (!searchValue) {
            setLocalData(subUsers || []);
            return;
        }

        const filtered = subUsers.filter(user => {
            const searchTerm = searchValue.toLowerCase();
            return (
                user.fullName?.toLowerCase().includes(searchTerm) ||
                user.email?.toLowerCase().includes(searchTerm) ||
                user.contactNumber?.toLowerCase().includes(searchTerm)
            );
        });
        setLocalData(filtered);
    };

    const handleSortModelChange = (newModel) => {
        setSortModel(newModel);

        if (newModel.length > 0) {
            const { field, sort } = newModel[0];
            const sortedData = [...localData].sort((a, b) => {
                let aValue = a[field];
                let bValue = b[field];

                if (field === 'createdAt' || field === 'updatedAt') {
                    return sort === 'asc'
                        ? new Date(aValue) - new Date(bValue)
                        : new Date(bValue) - new Date(aValue);
                }

                if (typeof aValue === 'string') {
                    return sort === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }

                return sort === 'asc' ? aValue - bValue : bValue - aValue;
            });

            setLocalData(sortedData);
        }
    };

    return (
        <>
            <Global
                styles={{
                    '.MuiDialog-root': {
                        '& .MuiBackdrop-root': {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                    'body': {
                        overflow: open ? 'hidden' : 'auto',
                        paddingRight: '0px !important',
                    },
                }}
            />
            <Dialog
                open={open}
                onClose={close}
                maxWidth="lg"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        position: 'relative',
                        zIndex: 1,
                    },
                    '& .MuiDialog-container': {
                        height: '100%',
                    }
                }}
                disableScrollLock={true}
                slotProps={{
                    backdrop: {
                        sx: {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #DEE0E4',
                    padding: '16px 24px'
                }}>
                    <Typography variant="h6">
                        Sub Users - {clientName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField
                            size="small"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#757575' }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    height: '36px',
                                    minWidth: '240px',
                                    backgroundColor: '#F8F9FA',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#DEE0E4',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#DEE0E4',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#4489FE',
                                    },
                                }
                            }}
                        />
                        <IconButton onClick={close} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ padding: '24px' }}>
                    <CustomTable
                        rows={localData}
                        columns={columns}
                        getRowId={(row) => row.staffId}
                        hideFooter={true}
                        disableSelectionOnClick
                        checkboxSelection={false}
                        autoHeight
                        components={{
                            NoRowsOverlay: () => (
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                    padding: '2rem',
                                }}>
                                    <Typography color="text.secondary">
                                        No sub users available
                                    </Typography>
                                </Box>
                            ),
                        }}
                        sortModel={sortModel}
                        onSortModelChange={handleSortModelChange}
                        sortingMode="client"
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default SubUsersModal; 