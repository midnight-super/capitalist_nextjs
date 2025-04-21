import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import toast from 'react-hot-toast'

import { useAuth } from '@/hooks/useAuth'
import CustomTable from '@/components/CustomTable'
import CustomPagination from '@/components/customPagination'
import CustomLoading from '@/views/componenets/customLoading'

import { getSortParams } from '@/utils'
import {
  getAllAddon,
  getAllService,
  getAllServiceCategory,
  getAllStaff,
  getAllStaffTasks,
  getAllTaskType,
} from '@/services/task.service'

import { getColumns } from '@/views/tasks/TaskColumn'
import PageHeader from '@/views/tasks/PageHeader'

const TaskList = ({ globalSearchedTxt }) => {
  const { user } = useAuth()

  const [pageSize, setPageSize] = useState(25)
  const [pageNo, setPageNo] = useState(0)
  const [taskLists, setTaskLists] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const [staffList, setStaffList] = useState([])
  const [serviceCategoryList, setServiceCategoryList] = useState([])
  const [serviceList, setServiceList] = useState([])
  const [addonList, setAddonList] = useState([])
  const [taskTypeList, setTaskTypeList] = useState([])
  const [colSorting, setColSorting] = useState({
    taskId: '',
    taskTitle: '',
    status: '',
  })
  const [loading, setLoading] = useState(true)
  const [taskFilter, setTaskFilter] = useState({})
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isSearch, setIsSearch] = useState(false)
  const [selectedTaskIds, setSelectedTaskIds] = useState([])
  const selectedTasks = taskLists.filter((task) => selectedTaskIds.includes(task.id))
  // Transform filters
  const transformedFilters = Object.entries(taskFilter || {})
    .filter(([_, filter]) => filter?.value)
    .map(([key, filter]) => ({
      attribute: key,
      operator: filter?.mode || 'Contains',
      value: [filter.value],
    }))

  useEffect(() => {
    if (isInitialLoad) setIsInitialLoad(false)
  }, [isInitialLoad])

  const fetchStaffList = async () => {
    try {
      setLoading(true)
      const res = await getAllStaff({ isDesc: false }, {})
      if (res?.success) {
        setStaffList(res.data)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch staff list')
    } finally {
      setLoading(false)
    }
  }
  const fetchTaskLists = async () => {
    setLoading(true)
    try {
      const sortParams = getSortParams(colSorting)
      const params = {
        userEmail: user?.email,
        page: pageNo,
        pageSize,
        sortBy: sortParams?.sortBy || 'createdAt',
        isDesc: sortParams?.isDesc ?? true,
        isSearch: isSearch,
      }

      const res = await getAllStaffTasks(params, transformedFilters)

      if (res?.success) {
        const tasksWithId = res.data.map((item) => ({
          ...item,
          id: item.taskId, // required for MUI DataGrid
        }))
        setTaskLists(tasksWithId)
        setPageNo(res.currPage)
        setPageCount(res.pageCount)
      } else {
        toast.error(res || 'Server Error: Failed to fetch tasks')
      }
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Unexpected Error')
    } finally {
      setLoading(false)
    }
  }
  const fetchServiceCategoryfList = async () => {
    try {
      setLoading(true)
      const res = await getAllServiceCategory({ isDesc: false }, {})
      if (res?.success) {
        setServiceCategoryList(res.data)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch staff list')
    } finally {
      setLoading(false)
    }
  }
  const fetchServiceList = async () => {
    try {
      setLoading(true)
      const res = await getAllService({ isDesc: false }, {})
      if (res?.success) {
        setServiceList(res.data)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch staff list')
    } finally {
      setLoading(false)
    }
  }
  const fetchAddonList = async () => {
    try {
      setLoading(true)
      const res = await getAllAddon({ isDesc: false }, {})
      if (res?.success) {
        setAddonList(res.data)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch staff list')
    } finally {
      setLoading(false)
    }
  }
  const fetchTaskTypefList = async () => {
    try {
      setLoading(true)
      const res = await getAllTaskType({ isDesc: false }, {})
      if (res?.success) {
        setTaskTypeList(res.data)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch staff list')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaffList()
    fetchAddonList()
    fetchServiceList()
    fetchTaskTypefList()
    fetchServiceCategoryfList()
  }, [])

  useEffect(() => {
    fetchTaskLists()
  }, [taskFilter, pageNo, pageSize, colSorting])

  const handlePageChange = (event, value) => {
    setPageNo(value - 1)
    setTaskLists([])
  }

  const columns = getColumns({
    colSorting,
    setColSorting,
    fetchTaskLists,
    staffList,
    pageNo,
    pageSize,
    serviceCategoryList,
    serviceList,
    addonList,
    taskTypeList,
  })

  return (
    <>
      {loading && <CustomLoading />}

      <Box sx={{ mb: '12px' }}>
        <PageHeader
          {...{
            globalSearchedTxt,
            setIsSearch,
            taskFilter,
            setTaskFilter,
            staffList,
            selectedTasks,
            fetchTaskLists,
            serviceCategoryList,
            serviceList,
            addonList,
            taskTypeList,
          }}
        />
      </Box>

      <CustomTable
        rows={taskLists}
        columns={columns}
        pageSize={pageSize}
        onSelectionChange={(ids) => {
          setSelectedTaskIds(ids)
        }}
        // loading={loading} // enable this if your table supports loading prop
      />

      {taskLists?.length > 0 && (
        <Box mt={-3}>
          <CustomPagination
            page={pageNo}
            setPageSize={setPageSize}
            pageSize={pageSize}
            setPageNo={setPageNo}
            onChange={handlePageChange}
            pageCount={pageCount}
          />
        </Box>
      )}
    </>
  )
}

TaskList.permissions = ['task.read']
export default TaskList
