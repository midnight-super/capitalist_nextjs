import CustomTable from '@/components/CustomTable'
import CustomPagination from '@/components/customPagination'
import { tableWrapperStyles } from '@/styles/table-styles'
import { getSortParams } from '@/utils'
import { getColumns } from '@/views/task-type/column'
import { Box, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import TaskTypeTable from '@/views/task-type/taskTypeTable'
import { getTaskTypeList } from '@/services/taskType.service'

const TaskTypes = () => {
  const { mainContainer } = tableWrapperStyles

  const isMobile = useMediaQuery('(max-width:1395px)')
  const [pageSize, setPageSize] = useState(25)
  const [pageNo, setPageNo] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [taskType, setTaskType] = useState([])
  const [colSorting, setColSorting] = useState({
    name: '',
    dateCreated: '',
    lastModified: '',
  })

  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [fullTaskTypeList, setFullTaskTypeList] = useState([])

  const handlePageChange = (event, value) => {
    setPageNo(value - 1)
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
      const res = await getTaskTypeList(params, transformedFilters)

      if (res?.success) {
        setTaskType(
          res.data?.map((item) => {
            return {
              ...item,
              id: item?.taskTypeId,
            }
          })
        )
        setFullTaskTypeList(
          res.data?.map((item) => {
            return {
              ...item,
              id: item?.taskTypeId,
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
      const filteredData = fullTaskTypeList?.filter((task) =>
        task?.taskTypeName?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      )
      setTaskType(filteredData)
    } else {
      setTaskType(fullTaskTypeList)
    }
  }, [searchQuery, fullTaskTypeList])

  return (
    <>
      <Box sx={mainContainer}>
        <TaskTypeTable
          data={taskType}
          filter={setFilter}
          fetchAddOns={fetchAddOns}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </Box>
      <CustomTable rows={taskType} columns={columns} pageSize={pageSize} loading={loading} />
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

TaskTypes.permissions = ['taskType.read']
export default TaskTypes
