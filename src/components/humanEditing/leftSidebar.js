import React, { useEffect, useState } from 'react'
import { Box, Divider, Typography, Grid2 as Grid, CircularProgress } from '@mui/material'
import FolderSvg from '@/menu-icons/folder'
import { getAllEvents } from '@/services/event.service'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
const LeftSidebar = ({
  route,
  selectedEvent,
  eventCount,
  setAllEvents,
  isMobile,
  handleCloseMenu,
  showLeftSidebar,
}) => {
  const router = useRouter()
  const { id } = route.query
  const [events, setEvents] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [pageNo, setPageNo] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const currentPath = router.asPath.split('/')
  const lastPart = currentPath[currentPath.length - 1]

  const handleItemClick = (id, status, meetingId, streamKey) => {
    setSelectedId(id)
    selectedEvent && selectedEvent({ key: id, status: status, meetingId: meetingId })

    router.replace(`/admin-editor/${streamKey}/COMPLETED_CAPTION/${lastPart}`)
  }

  const fetchEventList = async (pageNo, append = false) => {
    const transformedFilters = [
      {
        attribute: 'status',
        operator: 'EQUAL',
        value: ['LIVE_CAPTION', 'COMPLETED_CAPTION', 'PENDING'],
      },
    ]
    const params = {
      page: pageNo,
      pageSize: 20,
      sortBy: 'createdAt',
      isDesc: true,
    }
    try {
      setLoading(true)
      const res = await getAllEvents(params, transformedFilters)
      if (res?.success) {
        setEvents((prevEvents) =>
          append
            ? [
                ...prevEvents,
                ...res?.data?.map((item) => ({
                  ...item,
                  id: item?.eventId,
                })),
              ]
            : res?.data?.map((item) => ({
                ...item,
                id: item?.eventId,
              }))
        )
        eventCount && eventCount(res?.totalCount)
        setTotalPages(res?.pageCount)
        setAllEvents(res?.data)
      } else {
        toast.error('Server Error: Failed to fetch')
      }
    } catch (err) {
      toast.error('Unexpected Error')
    } finally {
      setLoading(false)
    }
  }

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target
    const bottom = scrollTop + clientHeight >= scrollHeight - 1
    if (bottom && !loading && totalPages > pageNo + 1) {
      setPageNo((prevPageNo) => prevPageNo + 1)
    }
  }

  useEffect(() => {
    fetchEventList(pageNo)
  }, [])
  useEffect(() => {
    pageNo > 0 && fetchEventList(pageNo, true)
  }, [pageNo])
  useEffect(() => {
    if (id && events?.length > 0) {
      const matchingEvent = events?.find((item) => item.streamKey === id)
      if (matchingEvent) {
        setSelectedId(matchingEvent.streamKey)
      }
    }
  }, [id, events])

  return (
    <Box
      sx={{
        padding: !isMobile && '28px 0px',
        margin: isMobile && '5px 0px',
        height: '100%',
        maxHeight: isMobile ? 'calc(100vh - 80px)' : 'calc(100vh - 244px)',
        overflowY: 'auto',
        // '&:hover': {
        //   overflowY: 'auto',
        // },
      }}
      onScroll={handleScroll}
    >
      {loading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <CircularProgress />
        </div>
      )}
      {events?.map((val) => (
        <Box
          key={val.id}
          onClick={() => {
            isMobile && handleCloseMenu()
            handleItemClick(val.streamKey, val?.status, val?.meetingId, val?.streamKey)
          }}
          sx={{
            display: 'flex',
            background: selectedId === val.streamKey ? '#DFEBFE' : 'transparent',
            cursor: 'pointer',
            '&:hover': { background: '#F1F1F1' },
          }}
        >
          <Box
            sx={{
              p: '12px 16px',
              display: 'flex',
              width: '100%',
            }}
          >
            <Typography>
              <FolderSvg color={selectedId === val.streamKey ? '#4489FE' : '#7C7C7C'} />
            </Typography>
            <Box sx={{ pl: '12px' }}>
              <Typography
                sx={{
                  color: selectedId === val.streamKey ? '#4489FE' : '#7C7C7C',
                  fontWeight: 500,
                  fontSize: '14px',
                }}
              >
                {val?.eventName}
              </Typography>
              <Box
                sx={{
                  pt: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {val?.status === 'LIVE_CAPTION' && (
                  <Typography sx={{ pr: '4px', display: 'flex', alignItems: 'center' }}>
                    <img src="/icons/redDot.svg" alt="" />
                  </Typography>
                )}
                <Typography
                  sx={{
                    color:
                      val?.status === 'LIVE_CAPTION'
                        ? '#4489FE'
                        : val?.status === 'COMPLETED_CAPTION'
                          ? '#009B65'
                          : '#7C7C7C',
                    fontWeight: 400,
                    fontSize: '12px',
                  }}
                >
                  {val?.status === 'LIVE_CAPTION'
                    ? 'Active in session'
                    : val?.status === 'COMPLETED_CAPTION'
                      ? 'Completed'
                      : 'Pending'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default LeftSidebar
