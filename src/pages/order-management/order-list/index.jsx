import CustomTable from '@/components/CustomTable'
import { getAllOrders } from '@/services/order.service'
import { dataSorting, getSortParams } from '@/utils'
import OrderTable from '@/views/order-management'
import { getColumns } from '@/views/order-management/column'
import OrderManagementPagination from '@/views/order-management/components/OrderManagementPagination'
import { Box, useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const OrderList = () => {
  const [pageSize, setPageSize] = useState(25)
  const [pageNo, setPageNo] = useState(0)
  const [orderData, setOrderData] = useState([])
  const [selectedRowIds, setSelectedRowIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const [userFilter, setUserFilter] = useState({})
  const [searchText, setSearchText] = useState('')

  const [colSorting, setColSorting] = useState({
    orderId: '',
    client: '',
    createdDate: '',
    dueDate: '',
    status: '',
  })

  //Hange Page Change
  useEffect(() => {
    setOrderData(dataSorting(orderData, colSorting))
  }, [colSorting])

  const isMobile = useMediaQuery('(max-width:1395px)')
  const transformedFilters = Object.entries(userFilter || {})
    .filter(([key, filter]) => filter?.value)
    .map(([key, filter]) => ({
      attribute: key,
      operator: filter?.mode || 'Contains',
      value: [filter.value],
    }))

  // Check if there's no "status" attribute, then apply default
  if (!userFilter?.status) {
    transformedFilters.push({
      attribute: 'status',
      operator: 'NOT_EQUAL',
      value: ['DELETED'],
    })
  }

  const fetchEventList = async () => {
    const sortResult = getSortParams(colSorting)
    const params = {
      page: pageNo,
      pageSize: pageSize,
      sortBy: sortResult ? sortResult.sortBy : 'createdAt',
      isDesc: sortResult ? sortResult.isDesc : true,
    }
    try {
      setLoading(true)

      const res = await getAllOrders(params, transformedFilters)
      if (res?.success) {
        setOrders(
          res?.data?.map((item) => {
            return {
              ...item,
              id: item?.orderId,
            }
          })
        )
        setPageNo(res?.currPage)
        setPageCount(res?.pageCount)
        setLoading(false)
      } else {
        setLoading(false)
        toast.error('Server Error: Failed to fetch')
      }
    } catch (err) {
      toast.error('Unexpected Error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEventList()
  }, [userFilter, pageSize, pageNo, colSorting])

  const columns = getColumns({
    colSorting,
    setColSorting,
    isMobile,
    fetchEventList,
  })

  const handlePageChange = (event, value) => {
    setPageNo(value - 1)
  }

  return (
    <>
      <Box sx={{ mb: '12px' }}>
        <OrderTable
          data={orders}
          userFilter={setUserFilter}
          selectedIds={selectedRowIds}
          setSearchText={setSearchText}
          searchText={searchText}
        />
      </Box>
      <CustomTable
        rows={orders || []}
        columns={columns}
        pageSize={pageSize}
        loading={loading}
        onSelectionChange={setSelectedRowIds}
      />
      {orders?.length > 0 && (
        <Box sx={{ marginTop: '-30px' }}>
          <OrderManagementPagination
            page={pageNo}
            setPageSize={setPageSize}
            pageSize={pageSize}
            setPageNo={setPageNo}
            onChange={handlePageChange}
            pageCount={pageCount}
            selectedRowIds={selectedRowIds}
            orders={orders}
            fetchEventList={fetchEventList}
          />
        </Box>
      )}
    </>
  )
}

OrderList.permissions = ['order.read']
export default OrderList
