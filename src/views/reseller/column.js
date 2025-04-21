import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Menu, MenuItem, Link } from '@mui/material';
import CustomSwitch from '@/components/CustomSwitch';
import CustomTableHeaderTitle from '@/components/CustomTableHeaderTitle';
import { tableColumnStyles } from '@/styles/table-styles';
import { deleteReseller } from '@/services/reseller.service';
import { blockStaff, unblockStaff, deleteStaff } from '@/services/staff.service';
import toast from 'react-hot-toast';
import moment from 'moment';
import ConfirmDialog from '@/components/ConfirmDialog';
import Image from 'next/image';
import SubUsersModal from './modal/subUsersModal';

export const getColumns = ({
    colSorting,
    setColSorting,
    isMobile,
    fetchResellerData,
    resellers,
    pageNo,
    pageSize,
    fetchResellers,
    router,
    onSortModelChange
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
                if (row.isMainUser) {
                    staffId = row.admin?.staffId;
                } else {
                    staffId = row.staffId;
                }

                if (!staffId) {
                    toast.error('Invalid user ID');
                    return;
                }

                const response = row.status === 'ACTIVE'
                    ? await blockStaff(staffId)
                    : await unblockStaff(staffId);

                if (response === 'OPERATION_SUCCESS') {
                    setIsActive(!isActive);
                    toast.success(`${row.isMainUser ? 'Reseller' : 'Sub-user'} ${row.status === 'ACTIVE' ? 'deactivated' : 'activated'} successfully`);
                    fetchResellers();
                } else {
                    toast.error(`Failed to update ${row.isMainUser ? 'reseller' : 'sub-user'} status`);
                }
            } catch (error) {
                console.error('Error updating status:', error);
                toast.error(`Failed to update ${row.isMainUser ? 'reseller' : 'sub-user'} status`);
            }
            handleRowOptionsClose();
        };

        const handleDeleteConfirm = async () => {
            try {
                if (!row.isMainUser) {
                    const response = await deleteStaff(row.staffId);
                    if (response === 'OPERATION_SUCCESS') {
                        toast.success('Sub-user deleted successfully');
                        fetchResellers();
                    } else {
                        toast.error('Failed to delete sub-user');
                    }
                } else {
                    const response = await deleteReseller(row.resellerId);
                    if (response === 'OPERATION_SUCCESS') {
                        toast.success('Reseller deleted successfully');
                        fetchResellers();
                    } else if (response === 'OPERATION_FAILURE') {
                        toast.error('Cannot delete reseller. Reseller may have active projects.');
                    } else {
                        toast.error('Failed to delete reseller');
                    }
                }
            } catch (error) {
                console.error('Delete error:', error);
                toast.error('An error occurred while deleting');
            } finally {
                setConfirmOpen(false);
            }
        };

        useEffect(() => {
            setIsActive(row.status === 'ACTIVE');
        }, [row.status]);

        return (
            <>
                <Typography sx={actionIcon} onClick={handleRowOptionsClick}>
                    <img src="/icons/actionIcon.svg" alt="action" style={{ width: '16px', height: 'auto' }} />
                </Typography>
                <Menu
                    keepMounted
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleRowOptionsClose}
                    disableScrollLock={true}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                    sx={{
                        ...menuContainer,
                        '& .MuiPaper-root': {
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)',
                            border: '1px solid #DEE0E4',
                            borderRadius: '4px',
                            minWidth: '140px',
                            mt: 1,
                            '& .MuiList-root': {
                                padding: '8px 0',
                            },
                            '& .MuiMenuItem-root': {
                                padding: '8px 16px',
                                '&:hover': {
                                    backgroundColor: '#F8F9FA'
                                }
                            }
                        },
                        zIndex: 99999,
                        position: 'fixed'
                    }}
                    slotProps={{
                        paper: {
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
                                mt: 1.5
                            }
                        }
                    }}
                >
                    <MenuItem onClick={handleViewDetails}>
                        <Typography sx={menuItemText}>View Details</Typography>
                    </MenuItem>
                    <MenuItem>
                        <Typography sx={{ ...menuItemText, mr: '10px' }}>
                            {row.status === 'ACTIVE' ? 'Inactive' : 'Active'}
                        </Typography>
                        <CustomSwitch checked={isActive} onChange={handleStatusChange} />
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
                    content={row.isMainUser
                        ? "Are you sure you want to delete this reseller?"
                        : "Are you sure you want to delete this sub-user?"}
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            </>
        );
    };

    const SubUsersCell = ({ row, fetchResellerData }) => {
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
                        resellerName={row.admin?.fullName || row.company?.title || 'Unknown Reseller'}
                        fetchResellerData={fetchResellerData}
                    />
                )}
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
                    onSortModelChange={onSortModelChange}
                    sortIcons={{
                        asc: '/icons/fullName_sort_up.svg',
                        desc: '/icons/fullName_sort_down.svg',
                        clear: '/icons/fullName_sort_clear.svg',
                    }}
                />
            ),
            headerAlign: 'start',
            align: 'start',
            sortable: true,
            hideSortIcons: true,
            renderCell: ({ row }) => {
                const initials = row.fullName
                    ?.split(' ')
                    ?.map((name) => name[0])
                    ?.join('')
                    ?.substring(0, 2)
                    ?.toUpperCase() || '';

                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: '#4489FE', color: '#fff', fontSize: '16px' }}>
                            {initials}
                        </Avatar>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1" sx={{ color: '#212121', fontSize: '14px', fontWeight: 500 }}>
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
                            <Typography variant="body2" sx={{ color: '#757575', fontSize: '12px' }}>
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
            field: 'projects',
            renderHeader: () => (
                <CustomTableHeaderTitle
                    title="Projects"
                    colSorting={colSorting}
                    setColSorting={setColSorting}
                    colDef={{ field: 'projects' }}
                    onSortModelChange={onSortModelChange}
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
                    onSortModelChange={onSortModelChange}
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
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: isActive ? '#0FAA58' : '#FF4D49' }} />
                        <Typography sx={{ color: isActive ? '#0FAA58' : '#FF4D49', fontSize: '14px' }}>
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
            renderHeader: () => (
                <CustomTableHeaderTitle
                    title="Date Created"
                    colSorting={colSorting}
                    setColSorting={setColSorting}
                    colDef={{ field: 'createdAt' }}
                    onSortModelChange={onSortModelChange}
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
                    onSortModelChange={onSortModelChange}
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
        {
            field: 'subUsers',
            renderHeader: () => (
                <CustomTableHeaderTitle
                    title="Sub Users"
                    colSorting={colSorting}
                    setColSorting={setColSorting}
                    colDef={{ field: 'subUsers' }}
                    onSortModelChange={onSortModelChange}
                />
            ),
            width: 130,
            sortable: true,
            hideSortIcons: true,
            renderCell: ({ row }) => <SubUsersCell row={row} fetchResellerData={fetchResellerData} />,
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