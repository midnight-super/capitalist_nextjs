import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Typography, FormControl, Select, MenuItem } from '@mui/material'
import { Pagination as MuiPagination } from '@mui/material'
import TableHeader from './tableHeader'
import AddStaff from './modal/addStaff'
import CustomTable from '@/components/CustomTable'
import { getColumns } from './column'

const StaffTable = ({
    data,
    filter,
    fetchStaffData,
    searchQuery,
    setSearchQuery,
    pageNo,
    setPageNo,
    pageSize,
    setPageSize,
    pageCount,
    loading
}) => {
    const [addOpen, setAddOpen] = useState(false)
    const router = useRouter()
    const [sortModel, setSortModel] = useState([
        {
            field: 'createdAt',
            sort: 'desc'
        }
    ]);
    const [localData, setLocalData] = useState(data || []);
    const [colSorting, setColSorting] = useState({
        fullName: '',
        designation: '',
        taskInprogress: '',
        status: '',
        createdAt: '',
        updatedAt: ''
    });

    // Move handleSortModelChange before it's used
    const handleSortModelChange = (newModel) => {
        setSortModel(newModel);

        if (newModel.length > 0) {
            const { field, sort } = newModel[0];
            setColSorting(prev => ({
                ...prev,
                [field]: sort
            }));

            const sortedData = [...localData].sort((a, b) => {
                let aValue = a[field];
                let bValue = b[field];

                // Handle task in progress sorting
                if (field === 'taskInprogress') {
                    aValue = a.inProgressTasks?.length || 0;
                    bValue = b.inProgressTasks?.length || 0;
                }

                // Handle date fields
                if (field === 'createdAt' || field === 'updatedAt') {
                    return sort === 'asc'
                        ? new Date(aValue) - new Date(bValue)
                        : new Date(bValue) - new Date(aValue);
                }

                // Handle string fields
                if (typeof aValue === 'string') {
                    return sort === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }

                // Handle numeric fields
                return sort === 'asc' ? aValue - bValue : bValue - aValue;
            });

            setLocalData(sortedData);
        }
    };

    // Update local data when data prop changes
    useEffect(() => {
        setLocalData(data || []);
    }, [data]);

    // Remove the default active filter
    useEffect(() => {
        // Only set default filter if no filter is already applied
        if (!filter?.status?.value) {
            // Don't set any initial filter
            // const defaultFilter = {
            //     status: {
            //         value: 'ACTIVE',
            //         mode: 'EQUAL'
            //     }
            // };
            // if (typeof filter === 'function') {
            //     filter(defaultFilter);
            // }
        }
    }, []); // Run once on component mount

    const columns = getColumns({
        colSorting,
        setColSorting,
        isMobile: false,
        fetchStaffData,
        staff: data,
        pageNo,
        pageSize,
        router,
        onSortModelChange: handleSortModelChange
    })

    const handlePageChange = (event, value) => {
        setPageNo(value - 1);  // Convert to 0-based index for API
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
        setPageNo(0); // Reset to first page when changing page size
    };

    const handleAddOpen = () => setAddOpen(true)
    const handleAddClose = () => setAddOpen(false)

    const handleSearch = (searchValue) => {
        setSearchQuery(searchValue);
        // Remove the direct filtering and fetching here since we want the parent component 
        // to handle the actual data fetching with the search query
        setPageNo(0); // Reset to first page when searching
    };

    // Add a new useEffect to handle search changes
    useEffect(() => {
        if (searchQuery !== undefined) {
            fetchStaffData(); // The parent component will use the searchQuery state
        }
    }, [searchQuery]);

    return (
        <>
            <TableHeader
                data={localData}
                filter={filter}
                handleAddOpen={handleAddOpen}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <CustomTable
                loading={loading}
                rows={localData}
                columns={columns}
                getRowId={(row) => row.staffId}
                hideFooter={true}
                disableSelectionOnClick
                checkboxSelection={false}
                autoHeight
                sortModel={sortModel}
                onSortModelChange={handleSortModelChange}
                sortingMode="client"
            />

            {/* Pagination container with rows per page selector */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
                borderTop: '1px solid #DEE0E4',
                backgroundColor: '#fff',
                width: '100%',
            }}>
                {/* Rows per page selector */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#666666',
                            fontSize: '14px'
                        }}
                    >
                        Rows per page:
                    </Typography>
                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 80,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#DEE0E4',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#DEE0E4',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#4489FE',
                                },
                            },
                        }}
                    >
                        <Select
                            value={pageSize}
                            onChange={(e) => handlePageSizeChange(e.target.value)}
                            sx={{
                                height: '32px',
                                color: '#666666',
                                fontSize: '14px',
                                '& .MuiSelect-select': {
                                    padding: '4px 8px',
                                },
                            }}
                        >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Pagination */}
                <MuiPagination
                    count={pageCount}
                    page={pageNo + 1}
                    onChange={handlePageChange}
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    sx={{
                        '& .MuiPaginationItem-root': {
                            color: '#666666',
                            '&.Mui-selected': {
                                backgroundColor: '#4489FE',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: '#4489FE',
                                }
                            }
                        },
                        '& .MuiPaginationItem-ellipsis': {
                            color: '#666666'
                        }
                    }}
                />
            </Box>

            {addOpen && (
                <AddStaff
                    open={addOpen}
                    close={handleAddClose}
                    fetchStaffData={fetchStaffData}
                />
            )}
        </>
    )
}

export default StaffTable