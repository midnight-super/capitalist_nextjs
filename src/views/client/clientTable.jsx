import React, { useState, useEffect } from 'react';
import {
    Box,
    CircularProgress,
    Stack,
    Pagination as MuiPagination,
    Select,
    MenuItem,
    FormControl,
    Typography
} from '@mui/material';
import { getClientList } from '@/services/client.service';
import TableHeader from './tableHeader';
import AddClientModal from './modal/addClientModal';
import CustomTable from '@/components/CustomTable';
import { getColumns } from './column';
import CustomPagination from '@/components/customPagination';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';

// Update the TableWrapper styled component
const TableWrapper = styled(Box)({
    minHeight: '600px', // Change to minHeight to allow content to grow
    display: 'flex',
    flexDirection: 'column',
    width: '100%', // Ensure full width
});

const TableContainer = styled(Box)({
    flex: 1,
    minHeight: '400px',
    position: 'relative',
    marginBottom: '20px', // Add margin to separate from pagination
    '& .MuiDataGrid-root': {
        border: 'none',
        '& .MuiDataGrid-virtualScroller': {
            minHeight: '300px',
        }
    }
});

// Update the pagination container styles
const PaginationContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderTop: '1px solid #DEE0E4',
    backgroundColor: '#fff',
    width: '100%',
});

const ClientTable = ({ data, fetchClientData }) => {
    const [clients, setClients] = useState([]);
    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [addOpen, setAddOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState({});
    const [loading, setLoading] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [sortModel, setSortModel] = useState([
        {
            field: 'createdAt',
            sort: 'desc'
        }
    ]);
    const [colSorting, setColSorting] = useState({
        fullName: '',
        projects: '',
        status: '',
        createdAt: '',
        updatedAt: '',
        subUsers: ''
    });
    const router = useRouter();

    const processClientsData = (clientsData) => {
        const processedData = [];

        clientsData.forEach((client, idx) => {
            if (client.admin) {
                // Add main user with their subUsers
                processedData.push({
                    ...client,
                    no: pageNo * pageSize + idx + 1,
                    fullName: client.admin.fullName,
                    email: client.admin.email,
                    contactNumber: client.admin.contactNumber,
                    designation: client.admin.designation,
                    status: client.admin.status,
                    isMainUser: true,
                    createdAt: client.createdAt,
                    updatedAt: client.updatedAt,
                    // Keep subUsers for the modal
                    subUsers: client.subUsers || [] // Changed from undefined to keep subUsers
                });

                // Only add sub-users as separate rows if we're not filtering main users
                if (!filter?.fullName?.value && !filter?.email?.value && !filter?.companyTitle?.value) {
                    if (client.subUsers?.length > 0) {
                        client.subUsers.forEach((subUser, subIdx) => {
                            if (subUser.staffId !== client.admin.staffId) {
                                processedData.push({
                                    clientId: client.clientId,
                                    company: client.company,
                                    no: `${pageNo * pageSize + idx + 1}.${subIdx + 1}`,
                                    fullName: subUser.fullName || `${subUser.firstName} ${subUser.lastName}`,
                                    email: subUser.email,
                                    contactNumber: subUser.contactNumber,
                                    designation: subUser.designation,
                                    status: subUser.status,
                                    staffId: subUser.staffId,
                                    isMainUser: false,
                                    createdAt: subUser.createAt || subUser.createdAt,
                                    updatedAt: subUser.updatedAt || subUser.updateAt
                                });
                            }
                        });
                    }
                }
            }
        });

        return processedData;
    };

    const fetchClients = async () => {
        setLoading(true);
        try {
            const transformedFilters = [];

            // Convert filters to API format - same as staff table
            if (filter && Object.keys(filter).length > 0) {
                Object.entries(filter)
                    .filter(([_, filter]) => filter?.value)
                    .forEach(([key, filter]) => {
                        // Map client-specific fields to API fields
                        let attribute = key;
                        if (key === 'fullName') attribute = 'admin.fullName';
                        if (key === 'email') attribute = 'admin.email';
                        if (key === 'contactNumber') attribute = 'admin.contactNumber';
                        if (key === 'status') attribute = 'admin.status';
                        if (key === 'companyTitle') attribute = 'company.title';

                        transformedFilters.push({
                            attribute: attribute,
                            operator: filter.mode || 'EQUAL',
                            value: [filter.value]
                        });
                    });
            }

            const response = await getClientList({
                page: pageNo,
                pageSize: parseInt(pageSize),
                sortBy: 'createdAt',
                isDesc: true
            }, transformedFilters);

            if (response?.success) {
                const processedData = processClientsData(response.data);
                setClients(processedData);
                setPageCount(Math.ceil(response.totalCount / pageSize));

                // Get the current page's data
                const paginatedData = processedData.slice(0, pageSize);
                setFilteredData(paginatedData);
            } else {
                console.error('Failed to fetch clients:', response);
                toast.error('Failed to fetch clients');
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
            toast.error('Failed to fetch clients');
        } finally {
            setLoading(false);
        }
    };

    // Update the flattenClientData function
    const flattenClientData = (data) => {
        // Data is already flattened in processClientsData
        return data;
    };

    // Update the paginateData function
    const paginateData = (data, page, rowsPerPage) => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return data.slice(startIndex, endIndex);
    };

    // Update the search handler to work with flattened data
    const handleSearch = (searchValue) => {
        setSearchQuery(searchValue);
        if (!searchValue) {
            const flattenedData = flattenClientData(clients);
            const paginatedData = paginateData(flattenedData, pageNo, pageSize);
            setFilteredData(paginatedData);
            return;
        }

        const flattenedData = flattenClientData(clients);
        const searchTerm = searchValue.toLowerCase();

        const filtered = flattenedData.filter(item => {
            if (item.isMainUser) {
                return (
                    item.admin?.fullName?.toLowerCase().includes(searchTerm) ||
                    item.admin?.email?.toLowerCase().includes(searchTerm) ||
                    item.company?.title?.toLowerCase().includes(searchTerm) ||
                    item.admin?.contactNumber?.toLowerCase().includes(searchTerm)
                );
            } else {
                return (
                    item.fullName?.toLowerCase().includes(searchTerm) ||
                    item.email?.toLowerCase().includes(searchTerm) ||
                    item.contactNumber?.toLowerCase().includes(searchTerm)
                );
            }
        });

        const paginatedData = paginateData(filtered, 0, pageSize);
        setFilteredData(paginatedData);
        setPageNo(0); // Reset to first page when searching
    };

    const handleSortModelChange = (newModel) => {
        setSortModel(newModel);

        if (newModel.length > 0) {
            const { field, sort } = newModel[0];
            setColSorting(prev => ({
                ...prev,
                [field]: sort
            }));

            const sortedData = [...filteredData].sort((a, b) => {
                let aValue = a[field];
                let bValue = b[field];

                // Handle special cases for nested fields
                if (field === 'projects') {
                    aValue = a.projects?.length || 0;
                    bValue = b.projects?.length || 0;
                } else if (field === 'subUsers') {
                    aValue = a.subUsers?.length || 0;
                    bValue = b.subUsers?.length || 0;
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

            setFilteredData(sortedData);
        }
    };

    // Effect to handle pagination and filter changes
    useEffect(() => {
        fetchClients();
    }, [pageNo, pageSize, filter]);

    // Add console logs to debug data
    useEffect(() => {
        console.log('Clients data:', clients); // Check what data is coming in
    }, [clients]);

    // Add this effect to refresh data when parent data changes
    useEffect(() => {
        if (data) {
            const processedData = processClientsData(data);
            setClients(processedData);
            setFilteredData(processedData);
        }
    }, [data]);

    const handlePageChange = (event, newPage) => {
        setPageNo(newPage - 1);
        // Data will be re-fetched due to useEffect dependency on pageNo
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(parseInt(newPageSize));
        setPageNo(0); // Reset to first page
        // Data will be re-fetched due to useEffect dependency on pageSize
    };

    const handleAddOpen = () => setAddOpen(true);
    const handleAddClose = async () => {
        setAddOpen(false);
        await fetchClients(); // Make sure to await the fetch
    };

    const columns = getColumns({
        colSorting,
        setColSorting,
        isMobile: false,
        fetchClientData,
        clients: data,
        pageNo,
        pageSize,
        fetchClients,
        router,
        onSortModelChange: handleSortModelChange
    });

    const getRowId = (row) => `${row.clientId}-${row.staffId || 'main'}`;

    return (
        <TableWrapper>
            <TableHeader
                data={data}
                filter={setFilter}
                searchQuery={searchQuery}
                setSearchQuery={handleSearch}
                fetchClientData={fetchClientData}
            />

            <TableContainer>
                <CustomTable
                    loading={loading}
                    rows={filteredData}
                    columns={columns}
                    getRowId={getRowId}
                    hideFooter={true}
                    disableSelectionOnClick
                    checkboxSelection={false}
                    autoHeight={false}
                    sx={{
                        height: '100%',
                        '& .MuiDataGrid-main': {
                            '& .MuiDataGrid-virtualScroller': {
                                overflow: 'hidden auto',
                            },
                        },
                        '& .MuiDataGrid-overlay': {
                            backgroundColor: 'transparent',
                        }
                    }}
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
                                    {searchQuery ? 'No results found' : 'No data available'}
                                </Typography>
                            </Box>
                        ),
                    }}
                    sortModel={sortModel}
                    onSortModelChange={handleSortModelChange}
                    sortingMode="client"
                />
            </TableContainer>

            <PaginationContainer>
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
            </PaginationContainer>

            {addOpen && (
                <AddClientModal
                    open={addOpen}
                    close={handleAddClose}
                    fetchClientData={fetchClientData}
                />
            )}
        </TableWrapper>
    );
};

ClientTable.propTypes = {
    data: PropTypes.array,
    fetchClientData: PropTypes.func.isRequired
};

export default ClientTable;