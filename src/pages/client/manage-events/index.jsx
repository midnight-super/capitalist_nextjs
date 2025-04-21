import EventTable from '@/views/events'
import React, { useEffect, useState } from 'react'
import { getColumns } from '@/views/events/column'
import { Box, useMediaQuery } from '@mui/material'
import CustomPagination from '@/components/customPagination'
import CustomTable from '@/components/CustomTable'
import { dataSorting, getSortParams } from '@/utils'
import { getAllEvents } from '@/services/event.service'
import toast from 'react-hot-toast'

const ManageEvents = () => {
  const [pageSize, setPageSize] = useState(25)
  const [pageNo, setPageNo] = useState(0)
  const [eventData, setEventData] = useState([])
  const [isSearch, setIsSearch] = useState(false)
  const [selectedRowIds, setSelectedRowIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [events, setEvents] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const [userFilter, setUserFilter] = useState({})

  const [colSorting, setColSorting] = useState({
    eventName: '',
    platform: '',
    createdAt: '',
    createdBy: '',
    dueDate: '',
    status: '',
  })
  //Hange Page Change
  useEffect(() => {
    setEventData(dataSorting(eventData, colSorting))
  }, [colSorting])

  const isMobile = useMediaQuery('(max-width:1395px)')
  const transformedFilters = Object.entries(userFilter || {})
    .filter(([key, filter]) => filter?.value)
    .map(([key, filter]) => ({
      attribute: key,
      operator: filter?.mode || 'Contains',
      value: [filter.value],
    }))

  const fetchEventList = async () => {
    const sortResult = getSortParams(colSorting)
    const params = {
      page: pageNo,
      pageSize: pageSize,
      isSearch: isSearch,
      ...(sortResult && {
        sortBy: sortResult.sortBy,
        isDesc: sortResult.isDesc,
      }),
    }
    try {
      setLoading(true)
      const res = await getAllEvents(params, transformedFilters)
      if (res?.success) {
        setEvents(
          res.data?.map((item) => {
            return {
              ...item,
              id: item?.eventId,
            }
          })
        )
        setPageNo(res?.currPage)
        setPageCount(res?.pageCount)
        setLoading(false)
      } else {
        setLoading(false)
        setError(res || 'Server Error: Failed to fetch')
        toast.error('Server Error: Failed to fetch')
      }
    } catch (err) {
      setError(err.message || 'Unexpected Error')
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
        <EventTable
          setIsSearch={setIsSearch}
          userFilter={setUserFilter}
          selectedIds={selectedRowIds}
          fetchData={fetchEventList}
        />
      </Box>
      <CustomTable rows={events || []} columns={columns} pageSize={pageSize} loading={loading} />
      {events?.length > 0 && (
        <Box sx={{ marginTop: '-30px' }}>
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

// TODO: This permissions does not exists, as Events are a post-MVP feature.
ManageEvents.permissions = ['event.read']
export default ManageEvents
