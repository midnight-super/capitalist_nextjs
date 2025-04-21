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
import { getAllResellers } from '@/services/reseller.service';
import TableHeader from './tableHeader';
import AddResellerModal from './modal/addResellerModal';
import CustomTable from '@/components/CustomTable';
import { getColumns } from './column';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';

const TableWrapper = styled(Box)({
    minHeight: '600px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
});

const TableContainer = styled(Box)({
    flex: 1,
    minHeight: '400px',
    position: 'relative',
    marginBottom: '20px',
    '& .MuiDataGrid-root': {
        border: 'none',
        '& .MuiDataGrid-virtualScroller': {
            minHeight: '300px',
        }
    }
});

const PaginationContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderTop: '1px solid #DEE0E4',
    backgroundColor: '#fff',
    width: '100%',
});

const ResellerTable = ({ data, fetchResellerData }) => {
    const [resellers, setResellers] = useState([]);
    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [addOpen, setAddOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState({});
    const [loading, setLoading] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [sortModel, setSortModel] = useState([
        { field: 'createdAt', sort: 'desc' }
    ]);
    const [colSorting, setColSorting] = useState({
        fullName: '',
        projects: '',
        status: '',
        createdAt: '',
        updatedAt: '',
    });
    const router = useRouter();

    const processResellersData = (resellersData) => {
        const processedData = [];
        resellersData.forEach((reseller, idx) => {
            if (reseller.admin) {
                processedData.push({
                    ...reseller,
                    no: pageNo * pageSize + idx + 1,
                    fullName: reseller.admin.fullName,
                    email: reseller.admin.email,
                    contactNumber: reseller.admin.contactNumber,
                    designation: reseller.admin.designation,
                    status: reseller.admin.status,
                    isMainUser: true,
                    createdAt: reseller.createdAt,
                    updatedAt: reseller.updatedAt,
                    subUsers: reseller.subUsers || []
                });

                if (!filter?.fullName?.value && !filter?.email?.value && !filter?.companyTitle?.value) {
                    if (reseller.subUsers?.length > 0) {
                        reseller.subUsers.forEach((subUser, subIdx) => {
                            if (subUser.staffId !== reseller.admin.staffId) {
                                processedData.push({
                                    resellerId: reseller.resellerId,
                                    company: reseller.company,
                                    no: `${pageNo * pageSize + idx + 1}.${subIdx + 1}`,
                                    fullName: subUser.fullName || `${subUser.firstName} ${subUser.lastName}`,
                                    email: subUser.email,
                                    contactNumber: subUser.contactNumber,
                                    designation: subUser.designation,
                                    status: subUser.status,
                                    staffId: subUser.staffId,
                                    isMainUser: false,
                                    createdAt: subUser.createdAt || subUser.createAt,
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

    const fetchResellers = async () => {
        setLoading(true);
        try {
            const transformedFilters = [];
            if (filter && Object.keys(filter).length > 0) {
                Object.entries(filter)
                    .filter(([_, filter]) => filter?.value)
                    .forEach(([key, filter]) => {
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

            const response = await getAllResellers({
                page: pageNo,
                pageSize: parseInt(pageSize),
                sortBy: 'createdAt',
                isDesc: true,
                search: searchQuery
            }, transformedFilters);

            if (response?.success) {
                const processedData = processResellersData(response.data);
                setResellers(processedData);
                setPageCount(Math.ceil(response.totalCount / pageSize));
                const paginatedData = processedData.slice(0, pageSize);
                setFilteredData(paginatedData);
            } else {
                toast.error('Failed to fetch resellers');
            }
        } catch (error) {
            console.error('Error fetching resellers:', error);
            toast.error('Failed to fetch resellers');
        } finally {
            setLoading(false);
        }
    };

    const flattenResellerData = (data) => {
        return data;
    };

    const paginateData = (data, page, rowsPerPage) => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const handleSearch = (searchValue) => {
        console.log('handleSearch called with:', searchValue);
        setSearchQuery(searchValue);
    };

    useEffect(() => {
        fetchResellers();
    }, [pageNo, pageSize, filter, searchQuery]);

    const handlePageChange = (event, newPage) => {
        setPageNo(newPage - 1);
        fetchResellers();
    };

    const handlePageSizeChange = (event) => {
        const newSize = parseInt(event.target.value);
        setPageSize(newSize);
        setPageNo(0); // Reset to first page when changing page size
        fetchResellers();
    };

    useEffect(() => {
        if (data) {
            const processedData = processResellersData(data);
            setResellers(processedData);
            if (!searchQuery) {
                const paginatedData = processedData.slice(pageNo * pageSize, (pageNo + 1) * pageSize);
                setFilteredData(paginatedData);
                setPageCount(Math.ceil(processedData.length / pageSize));
            }
        }
    }, [data, searchQuery, pageNo, pageSize]);

    const handleSortModelChange = (newModel) => {
        setSortModel(newModel);
        if (newModel.length > 0) {
            const { field, sort } = newModel[0];
            setColSorting(prev => ({ ...prev, [field]: sort }));

            const sortedData = [...filteredData].sort((a, b) => {
                let aValue = a[field];
                let bValue = b[field];

                if (field === 'projects') {
                    aValue = a.projects?.length || 0;
                    bValue = b.projects?.length || 0;
                } else if (field === 'subUsers') {
                    aValue = a.subUsers?.length || 0;
                    bValue = b.subUsers?.length || 0;
                }

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

            setFilteredData(sortedData);
        }
    };

    const handleAddOpen = () => setAddOpen(true);
    const handleAddClose = async () => {
        setAddOpen(false);
        await fetchResellers();
    };

    const columns = getColumns({
        colSorting,
        setColSorting,
        isMobile: false,
        fetchResellerData,
        resellers: data,
        pageNo,
        pageSize,
        fetchResellers,
        router,
        onSortModelChange: handleSortModelChange
    });

    const getRowId = (row) => `${row.resellerId}-${row.staffId || 'main'}`;

    return (
        <TableWrapper>
            <TableHeader
                data={resellers}
                filter={setFilter}
                searchQuery={searchQuery}
                setSearchQuery={handleSearch}
                fetchResellerData={fetchResellerData}
                setFilteredData={setFilteredData}
            />

            <TableContainer>
                <CustomTable
                    loading={loading}
                    rows={filteredData.slice(pageNo * pageSize, (pageNo + 1) * pageSize)}
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: '#666666', fontSize: '14px' }}>
                        Rows per page:
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 80 }}>
                        <Select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            sx={{ height: '32px', color: '#666666', fontSize: '14px' }}
                        >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

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
                            }
                        }
                    }}
                />
            </PaginationContainer>

            {addOpen && (
                <AddResellerModal
                    open={addOpen}
                    close={handleAddClose}
                    fetchResellerData={fetchResellerData}
                />
            )}
        </TableWrapper>
    );
};

ResellerTable.propTypes = {
    data: PropTypes.array,
    fetchResellerData: PropTypes.func.isRequired
};

export default ResellerTable;