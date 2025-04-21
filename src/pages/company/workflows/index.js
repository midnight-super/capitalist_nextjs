import CustomTable from '@/components/CustomTable'
import CustomPagination from '@/components/customPagination'
import { getAllWorkflow } from '@/services/workflow.service'
import { tableWrapperStyles } from '@/styles/table-styles'
import { getSortParams } from '@/utils'
import AddWorkflow from '@/views/workflows/addWorkflow'
import { getColumns } from '@/views/workflows/column'
import WorkflowsTable from '@/views/workflows/workflowsTable'
import { Box, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const Workflows = () => {
  const { mainContainer } = tableWrapperStyles

  const isMobile = useMediaQuery('(max-width:1395px)')
  const [pageSize, setPageSize] = useState(25)
  const [pageNo, setPageNo] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [workflowList, setWorkflowList] = useState([])
  const [colSorting, setColSorting] = useState({
    name: '',
    dateCreated: '',
    lastModified: '',
    status: '',
  })
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [workflowFilter, setWorkflowFilter] = useState({})
  const [addOpen, setAddOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [fullWorkflowList, setFullWorkflowList] = useState([])

  const handleAddOpen = () => {
    setAddOpen(true)
  }
  const handleAddClose = () => {
    setAddOpen(false)
    setEditId(null)
  }

  const handlePageChange = (event, value) => {
    setPageNo(value - 1)
    setWorkflowList([])
  }

  const transformedFilters = Object.entries(workflowFilter || {})
    .filter(([key, filter]) => filter?.value)
    .map(([key, filter]) => ({
      attribute: key,
      operator: filter?.mode || 'EQUAL',
      value: [filter.value],
    }))

  const fetchWorkflowList = async () => {
    setLoading(true)
    try {
      const sortResult = getSortParams(colSorting)
      const params = {
        page: pageNo,
        pageSize: pageSize,
        sortBy: sortResult ? sortResult.sortBy : 'createdAt',
        isDesc: sortResult ? sortResult.isDesc : true,
      }
      const res = await getAllWorkflow(params, transformedFilters)

      if (res?.success) {
        setWorkflowList(
          res?.data?.map((item) => {
            return {
              ...item,
              id: item?.workflowId,
            }
          })
        )
        setFullWorkflowList(
          res?.data?.map((item) => {
            return {
              ...item,
              id: item?.workflowId,
            }
          })
        )
        setPageNo(res?.currPage)
        setPageCount(res?.pageCount)
      } else {
        toast.error(res?.message || 'Server Error: Failed to fetch')
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
    fetchWorkflowList,
    setEditId,
    handleAddOpen,
  })

  useEffect(() => {
    fetchWorkflowList()
  }, [workflowFilter, pageNo, pageSize, colSorting])

  useEffect(() => {
    if (searchQuery) {
      const filteredData = fullWorkflowList?.filter((workflow) =>
        workflow?.workflowName?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      )
      setWorkflowList(filteredData)
    } else {
      setWorkflowList(fullWorkflowList)
    }
  }, [searchQuery, fullWorkflowList])

  return addOpen ? (
    editId ? (
      <AddWorkflow handleAddClose={handleAddClose} fetchWorkflowList={fetchWorkflowList} editId={editId} />
    ) : (
      <AddWorkflow handleAddClose={handleAddClose} fetchWorkflowList={fetchWorkflowList} />
    )
  ) : (
    <>
      <Box sx={mainContainer}>
        <WorkflowsTable
          data={workflowList}
          handleAddOpen={handleAddOpen}
          fetchWorkflowList={fetchWorkflowList}
          workflowFilter={setWorkflowFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </Box>
      <CustomTable rows={workflowList} columns={columns} pageSize={pageSize} loading={loading} />
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

Workflows.permissions = ['workflow.read']
export default Workflows
