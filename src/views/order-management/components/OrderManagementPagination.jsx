import { handleSelectedOrderApprove } from '@/services/order.service'
import { Box, Button, Pagination, useMediaQuery, useTheme } from '@mui/material'
import { useState } from 'react'
import toast from 'react-hot-toast'

const OrderManagementPagination = ({
  onChange,
  page,
  pageCount,
  themeSetting,
  variant = 'standard', // 'standard' | 'minimal' | 'dense'
  selectedRowIds,
  orders,
  fetchEventList,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery('(max-width:860px)')
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const isManual = useMediaQuery('(max-width:478px)')
  const [isLoading, setIsLoading] = useState(false)

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

  const currentVariant = variants[variant] || variants.standard
  const handleApproveOrders = async () => {
    if (selectedRowIds?.length == 0) {
      return toast.error('Select at least one order')
    }

    const filterOrder = orders
      ?.filter((ele) => selectedRowIds?.includes(ele?.orderId))
      ?.filter((it) => it?.status === 'PENDING_APPROVAL')
      ?.map((da) => da?.orderId)
    setIsLoading(true)
    const response = await handleSelectedOrderApprove(filterOrder)
    if (response === 'OPERATION_SUCCESS') {
      fetchEventList()
    } else {
      toast.error('Something went wrong!')
    }
    setIsLoading(false)
  }

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
          <Button
            disabled={isLoading}
            onClick={handleApproveOrders}
            variant="contained"
            sx={{
              width: 'fit-content',
              fontSize: '14px',
              fontWeight: 500,
              textTransform: 'capitalize',
              bgcolor: 'green',
              border: '1px solid #009c00',
              borderRadius: '4px',
              padding: '10px 40px',
              ':hover': {
                bgcolor: '#009c00',
                border: '1px solid #009c00',
              },
            }}
          >
            {isLoading ? 'Please wait...' : 'Approve Selected'}
          </Button>
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

export default OrderManagementPagination
