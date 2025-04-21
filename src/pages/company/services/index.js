import CustomTable from '@/components/CustomTable'
import CustomPagination from '@/components/customPagination'
import { getAllServices } from '@/services/services.service'
import { tableWrapperStyles } from '@/styles/table-styles'
import { getSortParams } from '@/utils'
import { getColumns } from '@/views/services/column'
import ServicesTable from '@/views/services/servicesTable'
import { Box, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const Services = () => {
  const { mainContainer } = tableWrapperStyles

  const isMobile = useMediaQuery('(max-width:1395px)')
  const [pageSize, setPageSize] = useState(25)
  const [pageNo, setPageNo] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [services, setServices] = useState([])
  const [colSorting, setColSorting] = useState({
    name: '',
    serviceCategory: '',
    dateCreated: '',
    lastModified: '',
    status: '',
  })

  const [loading, setLoading] = useState(true)
  const [serviceFilter, setServiceFilter] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [fullServicesList, setFullServicesList] = useState([])

  const handlePageChange = (event, value) => {
    setPageNo(value - 1)
    setServices([])
  }

  const transformedFilters = Object.entries(serviceFilter || {})
    .filter(([key, filter]) => filter?.value)
    .map(([key, filter]) => ({
      attribute: key,
      operator: filter?.mode || 'EQUAL',
      value: [filter.value],
    }))

  const fetchServices = async () => {
    setLoading(true)
    try {
      const sortResult = getSortParams(colSorting)
      const params = {
        page: pageNo,
        pageSize: pageSize,
        sortBy: sortResult ? sortResult.sortBy : 'createdAt',
        isDesc: sortResult ? sortResult.isDesc : true,
      }
      const res = await getAllServices(params, transformedFilters)

      if (res?.success) {
        setServices(
          res.data?.map((item) => {
            return {
              ...item,
              id: item?.serviceId,
            }
          })
        )
        setFullServicesList(
          res.data?.map((item) => {
            return {
              ...item,
              id: item?.serviceId,
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
    fetchServices,
  })

  useEffect(() => {
    fetchServices()
  }, [serviceFilter, pageNo, pageSize, colSorting])

  useEffect(() => {
    if (searchQuery) {
      const filteredData = fullServicesList?.filter((service) =>
        [service?.serviceName, service?.serviceCategoryName, service?.status].some((name) =>
          name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        )
      )
      setServices(filteredData)
    } else {
      setServices(fullServicesList)
    }
  }, [searchQuery, fullServicesList])

  return (
    <>
      <Box sx={mainContainer}>
        <ServicesTable
          data={services}
          serviceFilter={setServiceFilter}
          fetchServices={fetchServices}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </Box>
      <CustomTable rows={services} columns={columns} pageSize={pageSize} loading={loading} />
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

Services.permissions = ['service.read']
export default Services
