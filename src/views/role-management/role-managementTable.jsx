import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, Select, MenuItem } from '@mui/material';
import { Pagination as MuiPagination } from '@mui/material';
import CustomTable from '@/components/CustomTable';
import TableHeader from './tableHeader';
import { getColumns } from './column';
import { getAllRoles, getRoleById } from '@/services/role.service';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { getPermissionById } from '@/services/permission.service';

export default function RoleManagementTable({ initialSorting }) {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [colSorting, setColSorting] = useState(initialSorting);
  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState({
    status: {
      value: 'ACTIVE',
      mode: 'EQUAL'
    }
  });

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const rolesData = await getAllRoles();

      // Sort roles by date
      const sortedRoles = rolesData.sort((a, b) => {
        if (colSorting.createdAt === 'desc') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      setRoles(sortedRoles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [colSorting]);

  useEffect(() => {
    // First filter out records without status
    let result = roles.filter(role => role.status);

    // Apply search
    if (searchQuery) {
      result = result.filter(role =>
        role.roleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ((role.status && getStatusText(role.status)?.toLowerCase()) || '').includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (Object.keys(filter).length > 0) {
      result = result.filter(role => {
        return Object.entries(filter).every(([field, filterValue]) => {
          // Special handling for status field
          if (field === 'status') {
            // If filter value is not set, show all except deleted
            if (!filterValue.value) {
              return role.status !== 'DELETED';
            }
            return role.status === filterValue.value;
          }

          // Get the correct field value from the role object
          const value = role[field]; // This will now correctly access roleName instead of name

          if (!filterValue.value) return true;

          switch (filterValue.mode) {
            case 'CONTAINS':
              return value?.toLowerCase().includes(filterValue.value.toLowerCase());
            case 'EQUAL':
              return value?.toLowerCase() === filterValue.value.toLowerCase();
            case 'STARTS_WITH':
              return value?.toLowerCase().startsWith(filterValue.value.toLowerCase());
            case 'ENDS_WITH':
              return value?.toLowerCase().endsWith(filterValue.value.toLowerCase());
            default:
              return true;
          }
        });
      });
    } else {
      // If no filters are set, hide deleted items by default
      result = result.filter(role => role.status !== 'DELETED');
    }

    const totalRoles = result.length;
    setPageCount(Math.ceil(totalRoles / pageSize));

    const startIndex = pageNo * pageSize;
    const paginatedRoles = result.slice(startIndex, startIndex + pageSize);
    setFilteredData(paginatedRoles);
  }, [roles, pageNo, pageSize, searchQuery, filter]);

  const handleAddOpen = () => {
    setSelectedRole(null);
    setAddOpen(true);
  };

  const handleEditOpen = async (role) => {
    try {
      // Fetch all permission templates for this role
      const roleDetails = await getRoleById(role.roleId); // You'll need to create this service function
      const permissionTemplates = await Promise.all(
        roleDetails.permissionIds.map(id => getPermissionById(id))
      );

      router.push({
        pathname: '/user-management/role-management/permission',
        query: {
          id: role.roleId,
          edit: true,
          templates: JSON.stringify(permissionTemplates) // Pass all templates
        }
      });
    } catch (error) {
      console.error("Error fetching role details:", error);
      toast.error("Failed to load role details");
    }
  };

  const handleClose = () => {
    setAddOpen(false);
    setSelectedRole(null);
  };

  const handlePageChange = (event, value) => {
    setPageNo(value - 1);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPageNo(0);
  };

  const handleSort = (field) => {
    const newSortDirection = initialSorting[field] === 'asc' ? 'desc' : 'asc';

    const sortedRoles = [...roles].sort((a, b) => {
      if (field === 'createdAt') {
        if (newSortDirection === 'desc') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

    setRoles(sortedRoles);
    // Update parent's sorting state if needed
    if (onSortChange) {
      onSortChange({ [field]: newSortDirection });
    }
  };

  const columns = getColumns({
    colSorting,
    setColSorting,
    onEdit: handleEditOpen,
    fetchRoles,
    router,
  });

  // Add helper function to get status text
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

  return (
    <Box sx={{ p: 3 }}>
      <TableHeader
        handleAddOpen={handleAddOpen}
        data={filteredData}
        filter={setFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <CustomTable
        loading={loading}
        rows={filteredData}
        columns={columns}
        getRowId={(row) => row.roleId}
        hideFooter={true}
        disableSelectionOnClick
        autoHeight
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderTop: '1px solid #DEE0E4',
          backgroundColor: '#fff',
          width: '100%',
        }}
      >

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#666666',
              fontSize: '14px',
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
                },
              },
            },
            '& .MuiPaginationItem-ellipsis': {
              color: '#666666',
            },
          }}
        />
      </Box>

    </Box>
  );
}