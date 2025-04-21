import React, { useEffect, useState } from 'react'
import {
  Box,
  CircularProgress,
  Divider,
  Grid2 as Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Header from './header'
import LeftSidebar from './leftSidebar'
import FolderSvg from '@/menu-icons/folder'
import RightSidebar from './rightSidebar'
import LinearProgress from '@mui/material/LinearProgress'
import { useRouter } from 'next/router'
import { routeName } from '@/utils'
import AudioPlayer from './audioPlayer'
import { getStream } from '@/services/event.service'
const EditorAppLayout = ({ children }) => {
  const router = useRouter()
  const { meeting } = router.query
  const route = routeName(router?.pathname)
  const [editorBgClr, setEditorBgClr] = useState('#FFFFFF')
  const [editors, setEditors] = useState([])
  const [play, setPlay] = useState(false)
  const [totalTime, setTotalTime] = useState(0)
  const [confidenceClrs, setConfidenceClrs] = useState({
    lowConfidence: '#FFFFFF',
    mediumConfidence: '#FFFFFF',
    highConfidence: '#FFFFFF',
  })

  const isMedium = useMediaQuery('(max-width:1100px)')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [allEvents, setAllEvents] = useState(null)
  const [total, setTotal] = useState(null)
  const [stream, setStream] = useState(null)
  const [currentTime, setCurrentTime] = useState(null)
  useEffect(() => {
    // Apply overflow hidden to the body when the component mounts
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    // Revert the overflow style when the component unmounts
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])
  const getStreamData = async () => {
    const response = await getStream()
    console.log(response)
    setStream(response)
  }
  useEffect(() => {
    getStreamData()
  }, [])
  const [showLeftSidebar, setShowLeftSidebar] = useState(false)
  const [showRightSidebar, setShowRightSidebar] = useState(false)
  const handleMenuClick = (option) => {
    if (option === 'playlist') {
      setShowLeftSidebar(true)
      setShowRightSidebar(false)
    } else if (option === 'editor') {
      setShowRightSidebar(true)
      setShowLeftSidebar(false)
    } else {
      setShowRightSidebar(false)
      setShowLeftSidebar(false)
    }
  }

  const isMobile = useMediaQuery('(max-width:700px)')
  useEffect(() => {
    if (!isMobile) {
      setShowLeftSidebar(false)
      setShowRightSidebar(false)
    }
  }, [isMobile])
  return (
    <>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Header
          onMenuClick={handleMenuClick}
          isMobile={isMobile}
          setAllEvents={setAllEvents}
          setSelectedEvent={setSelectedEvent}
          setTotal={setTotal}
          showLeftSidebar={showLeftSidebar}
          total={total}
          route={route}
          router={router}
          showRightSidebar={showRightSidebar}
          confidenceClrs={confidenceClrs}
          editors={editors}
        />
        <Grid
          container
          sx={{
            flex: 1,
            background: editorBgClr,
            marginTop: '70px',
            maxHeight: 'calc(100vh - 164px)',
            overflow: 'auto',
          }}
        >
          {/* Left Sidebar */}
          {!isMobile && (
            <Grid
              item
              sx={{
                position: 'sticky', // or 'sticky'
                top: 0, // ensures it stays at the top
                left: 0, // ensures it stays on the left side
                height: '74vh', // makes it full height of viewport
                background: '#fff', // optional: ensure visibility over content
                zIndex: 1000, // ensures it stays above other content
                //Fixed Position Changes above
                width: route === 'admin' ? (isMedium ? '200px' : '350px') : isMedium ? '0px' : '350px',
                borderRight: route === 'admin' && '1px solid #ECE9E9',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {route === 'admin' && (
                <Box>
                  <Box
                    sx={{
                      padding: '14px 20px 9px 20px',
                      height: '59px',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#212121',
                        fontSize: '16px',
                        fontWeight: 500,
                        letterSpacing: '0.25px',
                      }}
                    >
                      Playlist
                    </Typography>
                    <Typography
                      sx={{
                        color: '#757575',
                        fontSize: '11px',
                        fontWeight: 500,
                        letterSpacing: '0.25px',
                      }}
                    >
                      {total || 0} Events
                    </Typography>
                  </Box>
                  <Divider sx={{ color: '#ECE9E9' }} />

                  <LeftSidebar
                    eventCount={setTotal}
                    route={router}
                    selectedEvent={setSelectedEvent}
                    setAllEvents={setAllEvents}
                  />
                </Box>
              )}
            </Grid>
          )}

          <Grid
            item
            sx={{
              flex: 1,
              bgcolor: editorBgClr,
              // height: 'calc(100vh - 100px)',
              // overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                padding: '64px 30px',
              }}
            >
              {children &&
                React.cloneElement(children, {
                  selectedEvent,
                  setEditorBgClr,
                  confidenceClrs,
                  setConfidenceClrs,
                  setEditors,
                  stream,
                  play,
                  currentTime,
                  setCurrentTime,
                })}
            </Box>
          </Grid>

          {/* Right Sidebar */}
          {!isMobile && (
            <Grid
              item
              sx={{
                position: 'sticky',
                top: 0,
                left: 0,
                height: '74vh',
                background: '#fff',
                zIndex: 1000,
                //Fixed Position Changes above
                width:
                  route === 'admin'
                    ? isMedium
                      ? '200px'
                      : '350px'
                    : route === 'editor' && isMedium
                      ? '250px'
                      : route === 'user' && isMedium
                        ? '0px'
                        : '350px',
                borderLeft: route !== 'user' && '1px solid #ECE9E9',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {route !== 'user' && (
                <Box>
                  <Box
                    sx={{
                      paddingLeft: '20px',
                      height: '59px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#212121',
                        fontSize: '16px',
                        fontWeight: 500,
                        letterSpacing: '0.25px',
                      }}
                    >
                      Guide Notes
                    </Typography>
                  </Box>
                  <Divider sx={{ color: '#ECE9E9' }} />

                  <RightSidebar confidenceClrs={confidenceClrs} editors={editors} />
                </Box>
              )}
            </Grid>
          )}
        </Grid>
        <AudioPlayer
          stream={stream}
          setPlay={setPlay}
          setTotalTime={setTotalTime}
          audioPlayerTime={currentTime}
          setAudioPlayerTime={setCurrentTime}
          allEvents={allEvents}
        />
      </Box>
    </>
  )
}

export default EditorAppLayout
