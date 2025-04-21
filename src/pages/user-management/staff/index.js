import CustomTable from '@/components/CustomTable'
import CustomPagination from '@/components/customPagination'
import { tableWrapperStyles } from '@/styles/table-styles'
import { getSortParams } from '@/utils'
import { getColumns } from '@/views/staff/column'
import { Box, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getStaffList } from '@/services/staff.service'
import StaffTable from '@/views/staff/staffTable'

const Staff = () => {
  const { mainContainer } = tableWrapperStyles

  const isMobile = useMediaQuery('(max-width:1395px)')
  const [pageSize, setPageSize] = useState(10)
  const [pageNo, setPageNo] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [staff, setStaff] = useState([])

  const [colSorting, setColSorting] = useState({
    fullName: '',
    email: '',
    designation: '',
    contactNumber: '',
    inProgressTasks: '',
    status: '',
    createdAt: '',
    updatedAt: '',
  })

  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [fullStaffList, setFullStaffList] = useState([])

  const handlePageChange = (event, value) => {
    setPageNo(value - 1)
    setStaff([])
  }

  const transformedFilters = Object.entries(filter || {})
    .filter(([key, filter]) => filter?.value)
    .map(([key, filter]) => ({
      attribute: key,
      operator: filter?.mode || 'EQUAL',
      value: [filter.value],
    }))

  const fetchStaffData = async () => {
    setLoading(true)
    try {
      const sortResult = getSortParams(colSorting)
      const params = {
        page: pageNo,
        pageSize: pageSize,
        sortBy: sortResult ? sortResult.sortBy : 'createdAt',
        isDesc: sortResult ? sortResult.isDesc : true,
      }

      const res = await getStaffList(params, transformedFilters)

      if (res?.success) {
        setStaff(
          res.data?.map((item) => ({
            ...item,
            id: item?.staffId,
          }))
        )
        setFullStaffList(
          res.data?.map((item) => ({
            ...item,
            id: item?.staffId,
          }))
        )
        setPageNo(res?.currPage)
        setPageCount(res?.pageCount)
      } else {
        toast.error(typeof res === 'string' ? res : 'Server Error: Failed to fetch')
      }
    } catch (err) {
      toast.error(err.message || 'Unexpected Error')
    } finally {
      setLoading(false)
    }
  }

  const columns = getColumns({
    colSorting,
    setColSorting,
    isMobile,
    fetchStaffData,
    staff,
    pageNo,
    pageSize,
  })

  useEffect(() => {
    fetchStaffData()
  }, [filter, pageNo, pageSize, colSorting])

  useEffect(() => {
    if (searchQuery) {
      const filteredData = fullStaffList?.filter((_staff) =>
        _staff?.fullName?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      )
      setStaff(filteredData)
    } else {
      setStaff(fullStaffList)
    }
  }, [searchQuery, fullStaffList])

  return (
    <Box sx={{ p: 3 }}>
      <StaffTable
        data={staff}
        filter={setFilter}
        fetchStaffData={fetchStaffData}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        pageNo={pageNo}
        setPageNo={setPageNo}
        pageSize={pageSize}
        setPageSize={setPageSize}
        pageCount={pageCount}
        loading={loading}
      />
    </Box>
  )
}

Staff.permissions = ['staff.read']
export default Staff
