import CustomTable from '@/components/CustomTable'
import CustomPagination from '@/components/customPagination'
import { tableWrapperStyles } from '@/styles/table-styles'
import { getSortParams } from '@/utils'
import { getColumns } from '@/views/service-categories/column'
import ServiceCategoriesTable from '@/views/service-categories/serviceCategoriesTable'
import { Box, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getAllServiceCategories } from '@/services/service.category'

const ServiceCategories = () => {
  const { mainContainer } = tableWrapperStyles

  const isMobile = useMediaQuery('(max-width:1395px)')
  const [pageSize, setPageSize] = useState(25)
  const [pageNo, setPageNo] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [categories, setCategories] = useState([])
  const [colSorting, setColSorting] = useState({
    name: '',
    description: '',
    services: '',
    dateCreated: '',
    lastModified: '',
  })

  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [fullCategoriessList, setFullCategoriesList] = useState([])

  const handlePageChange = (event, value) => {
    setPageNo(value - 1)
    setCategories([])
  }

  const transformedFilters = Object.entries(categoryFilter || {})
    .filter(([key, filter]) => filter?.value)
    .map(([key, filter]) => ({
      attribute: key,
      operator: filter?.mode || 'EQUAL',
      value: [filter.value],
    }))

  const fetchServiceCategories = async () => {
    setLoading(true)
    try {
      const sortResult = getSortParams(colSorting)
      const params = {
        page: pageNo,
        pageSize: pageSize,
        sortBy: sortResult ? sortResult.sortBy : 'createdAt',
        isDesc: sortResult ? sortResult.isDesc : true,
      }
      const res = await getAllServiceCategories(params, transformedFilters)

      if (res?.success) {
        setCategories(
          res.data?.map((item) => {
            return {
              ...item,
              id: item?.serviceCategoryId,
            }
          })
        )
        setFullCategoriesList(
          res.data?.map((item) => {
            return {
              ...item,
              id: item?.serviceCategoryId,
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
    fetchServiceCategories,
    categories,
  })

  useEffect(() => {
    fetchServiceCategories()
  }, [categoryFilter, pageNo, pageSize, colSorting])

  useEffect(() => {
    if (searchQuery) {
      const filteredData = fullCategoriessList?.filter((category) =>
        [category?.serviceCategoryName, category?.parentServiceCategoryName].some((name) =>
          name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        )
      )
      setCategories(filteredData)
    } else {
      setCategories(fullCategoriessList)
    }
  }, [searchQuery, fullCategoriessList])

  return (
    <>
      <Box sx={mainContainer}>
        <ServiceCategoriesTable
          data={categories}
          categoryFilter={setCategoryFilter}
          fetchServiceCategories={fetchServiceCategories}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </Box>
      <CustomTable rows={categories} columns={columns} pageSize={pageSize} loading={loading} />
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

ServiceCategories.permissions = ['service.read']
export default ServiceCategories
