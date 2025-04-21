import { tableWrapperStyles } from '@/styles/table-styles'
import { Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import ResellerTable from '@/views/reseller/resellerTable'
import { getAllResellers } from '@/services/reseller.service'
import toast from 'react-hot-toast'

const Resellers = () => {
  const { mainContainer } = tableWrapperStyles
  const [resellers, setResellers] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageNo, setPageNo] = useState(0)
  const [pageSize, setPageSize] = useState(25)
  const [pageCount, setPageCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [appliedFilters, setAppliedFilters] = useState({})

  const fetchResellerData = async () => {
    setLoading(true)
    try {
      console.log('Fetching reseller data from Resellers...')
      const filters = Object.keys(appliedFilters).map((key) => ({
        attribute: key,
        operator: appliedFilters[key].mode || 'EQUAL',
        value: [appliedFilters[key].value],
      }))

      const params = {
        page: pageNo,
        pageSize: pageSize,
        sortBy: 'createdAt',
        isDesc: true,
        search: searchQuery,
      }

      const response = await getAllResellers(params, filters)
      console.log('API Response in Resellers:', response)

      if (response?.success && Array.isArray(response.data)) {
        const mappedResellers = response.data.map((reseller, idx) => ({
          ...reseller,
          resellerId: reseller.resellerId,
          no: pageNo * pageSize + idx + 1, // Add numbering for consistency
        }))
        console.log('Setting resellers:', mappedResellers)
        setResellers(mappedResellers)
        setPageCount(Math.ceil(response.totalCount / pageSize) || 1)
      } else {
        console.warn('Unexpected response structure:', response)
        toast.error('Failed to fetch resellers: Invalid response')
      }
    } catch (error) {
      console.error('Error fetching resellers:', error)
      toast.error('Error fetching resellers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResellerData()
  }, [pageNo, pageSize, searchQuery, appliedFilters])

  const handleFilter = (filters) => {
    if (filters && Object.keys(filters).length > 0) {
      setAppliedFilters(filters) // Expect filters in { key: { value, mode } } format
    } else {
      setAppliedFilters({})
    }
    setPageNo(0) // Reset to first page on filter change
  }

  return (
    <Box sx={mainContainer}>
      <ResellerTable
        data={resellers}
        fetchResellerData={fetchResellerData}
        filter={handleFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {/* Pagination is handled within ResellerTable, so no need for CustomPagination here */}
    </Box>
  )
}

Resellers.permissions = ['reseller.read']
export default Resellers
