import { Box, MenuItem, Pagination, Select, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
const CustomPagination = ({
  onChange,
  page,
  pageSize,
  setPageSize,
  pageCount,
  setPageNo,
  themeSetting,
  variant = 'standard', // 'standard' | 'minimal' | 'dense'
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery('(max-width:860px)')
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const isManual = useMediaQuery('(max-width:478px)')

  const handlePageChange = (event) => {
    setPageNo && setPageNo(0)
    setPageSize && setPageSize(event.target.value)
  }

  // Variant configurations
  const variants = {
    standard: {
      showRowsPerPage: true,
      paginationSize: 'large',
      showFirstLast: !isManual,
      boundaryCount: isManual ? 0 : isSmall ? 1 : isMobile ? 1 : 2,
      siblingCount: isManual ? 0 : isSmall ? 0 : isMobile ? 0 : 1,
    },
    minimal: {
      showRowsPerPage: false,
      paginationSize: 'medium',
      showFirstLast: false,
      boundaryCount: 0,
      siblingCount: 0,
    },
    dense: {
      showRowsPerPage: true,
      paginationSize: 'small',
      showFirstLast: !isManual,
      boundaryCount: isManual ? 0 : 1,
      siblingCount: 0,
    },
  }

  const currentVariant = variants[variant] || variants.standard;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: themeSetting ? 'center' : 'space-between',
        gap: 2,
        py: 2,
      }}
    >
      {!themeSetting && currentVariant.showRowsPerPage && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Rows per page:
          </Typography>
          <Select
            value={pageSize}
            onChange={handlePageChange}
            size="small"
            IconComponent={(props) => (
              <img {...props} src="/icons/arrowPage.svg" alt="down arrow" style={{ width: '10px', height: '10px' }} />
            )}
            sx={{
              minWidth: 80,
              '& .MuiSelect-select': {
                py: 1,
                pr: 3,
                pl: 1.5,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'divider',
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  '& .MuiMenuItem-root': {
                    fontSize: '0.875rem',
                    px: 2,
                    py: 1,
                  },
                },
              },
            }}
          >
            {[10, 25, 50, 100, 200].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}
      <Pagination
        count={pageCount}
        page={page + 1}
        onChange={onChange}
        variant="outlined"
        shape="rounded"
        size={currentVariant.paginationSize}
        showFirstButton={currentVariant.showFirstLast}
        showLastButton={currentVariant.showFirstLast}
        boundaryCount={currentVariant.boundaryCount}
        siblingCount={currentVariant.siblingCount}
        sx={{
          '& .MuiPaginationItem-root': {
            color: 'text.primary',
            borderColor: 'divider',
            fontSize: '0.875rem',
            minWidth: 32,
            height: 32,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          },
          '& .Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            borderColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          },
          '& .MuiPaginationItem-ellipsis': {
            height: 32,
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiPaginationItem-icon': {
            fontSize: '1.25rem',
          },
        }}
      />
    </Box>
  )
}

export default CustomPagination;
