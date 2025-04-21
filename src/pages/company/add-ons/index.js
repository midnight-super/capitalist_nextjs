import CustomTable from '@/components/CustomTable'
import CustomPagination from '@/components/customPagination'
import { tableWrapperStyles } from '@/styles/table-styles'
import { getSortParams } from '@/utils'
import { getColumns } from '@/views/add-ons/column'
import AddOnsTable from '@/views/add-ons/addOnsTable'
import { Box, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getAddOnsList } from '@/services/addOns.service'

const AddOns = () => {
  const { mainContainer } = tableWrapperStyles

  const isMobile = useMediaQuery('(max-width:1395px)')
  const [pageSize, setPageSize] = useState(25)
  const [pageNo, setPageNo] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [addOns, setAddOns] = useState([])
  const [colSorting, setColSorting] = useState({
    addonName: '',
    serviceDescription: '',
    serviceName: '',
    dateCreated: '',
    lastModified: '',
  })

  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [fullAddOnsList, setFullAddOnsList] = useState([])

  const handlePageChange = (event, value) => {
    setPageNo(value - 1)
    setAddOns([])
  }

  const transformedFilters = Object.entries(filter || {})
    .filter(([key, filter]) => filter?.value)
    .map(([key, filter]) => ({
      attribute: key,
      operator: filter?.mode || 'EQUAL',
      value: [filter.value],
    }))

  const fetchAddOns = async () => {
    setLoading(true)
    try {
      const sortResult = getSortParams(colSorting)
      const params = {
        page: pageNo,
        pageSize: pageSize,
        sortBy: sortResult ? sortResult.sortBy : 'createdAt',
        isDesc: sortResult ? sortResult.isDesc : true,
      }
      const res = await getAddOnsList(params, transformedFilters)

      if (res?.success) {
        setAddOns(
          res.data?.map((item) => {
            return {
              ...item,
              id: item?.addonId,
            }
          })
        )
        setFullAddOnsList(
          res.data?.map((item) => {
            return {
              ...item,
              id: item?.addonId,
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
    fetchAddOns,
  })

  useEffect(() => {
    fetchAddOns()
  }, [filter, pageNo, pageSize, colSorting])

  useEffect(() => {
    if (searchQuery) {
      const filteredData = fullAddOnsList?.filter((addOn) =>
        [addOn?.addonName, addOn?.serviceCategoryName, addOn?.serviceName].some((name) =>
          name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        )
      )
      setAddOns(filteredData)
    } else {
      setAddOns(fullAddOnsList)
    }
  }, [searchQuery, fullAddOnsList])

  return (
    <>
      <Box sx={mainContainer}>
        <AddOnsTable
          data={addOns}
          filter={setFilter}
          fetchAddOns={fetchAddOns}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </Box>
      <CustomTable rows={addOns} columns={columns} pageSize={pageSize} loading={loading} />
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

AddOns.permissions = ['service.read']
export default AddOns
