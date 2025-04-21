import CustomTable from '@/components/CustomTable'
import CustomPagination from '@/components/customPagination'
import { tableWrapperStyles } from '@/styles/table-styles'
import { getSortParams } from '@/utils'
import { getColumns } from '@/views/staff-designation/column'
import StaffDesignationTable from '@/views/staff-designation/staffDesignationTable'
import { Box, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getAllDesignation } from '@/services/designation.service'

const StaffDesignation = () => {
  const { mainContainer } = tableWrapperStyles

  const isMobile = useMediaQuery('(max-width:1395px)')
  const [pageSize, setPageSize] = useState(25)
  const [pageNo, setPageNo] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [designation, setDesignation] = useState([])
  const [colSorting, setColSorting] = useState({
    name: '',
    description: '',
    dateCreated: '',
    lastModified: '',
  })

  const [loading, setLoading] = useState(true)
  const [designationFilter, setDesignationFilter] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [fullDesignationList, setFullDesignationList] = useState([])

  const handlePageChange = (event, value) => {
    setPageNo(value - 1)
    setDesignation([])
  }

  const transformedFilters = Object.entries(designationFilter || {})
    .filter(([key, filter]) => filter?.value)
    .map(([key, filter]) => ({
      attribute: key,
      operator: filter?.mode || 'EQUAL',
      value: [filter.value],
    }))

  const fetchStaffDesignation = async () => {
    setLoading(true)
    try {
      const sortResult = getSortParams(colSorting)
      const params = {
        page: pageNo,
        pageSize: pageSize,
        sortBy: sortResult ? sortResult.sortBy : 'createdAt',
        isDesc: sortResult ? sortResult.isDesc : true,
      }
      const res = await getAllDesignation(params, transformedFilters)
      if (res?.success) {
        setDesignation(
          res.data?.map((item) => {
            return {
              ...item,
              id: item?.designationId,
            }
          })
        )
        setFullDesignationList(
          res.data?.map((item) => {
            return {
              ...item,
              id: item?.designationId,
            }
          })
        )
        setPageNo(res?.currPage)
        setPageCount(res?.pageCount)
      } else {
        toast.error(res || 'Server Error: Failed to fetch')
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
    fetchStaffDesignation,
  })

  useEffect(() => {
    fetchStaffDesignation()
  }, [designationFilter, pageNo, pageSize, colSorting])

  useEffect(() => {
    if (searchQuery) {
      const filteredData = fullDesignationList?.filter((_designation) =>
        _designation?.designationName?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      )
      setDesignation(filteredData)
    } else {
      setDesignation(fullDesignationList)
    }
  }, [searchQuery, fullDesignationList])

  return (
    <>
      <Box sx={mainContainer}>
        <StaffDesignationTable
          data={designation}
          designationFilter={setDesignationFilter}
          fetchStaffDesignation={fetchStaffDesignation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </Box>
      <CustomTable rows={designation} columns={columns} pageSize={pageSize} loading={loading} />
      <Box>
        <CustomPagination
          page={pageNo}
          setPageSize={setPageSize}
          pageSize={pageSize}
          setPageNo={setPageNo}
          onChange={handlePageChange}
          pageCount={pageCount}
        />
      </Box>
    </>
  )
}

StaffDesignation.permissions = ['designation.read']
export default StaffDesignation
