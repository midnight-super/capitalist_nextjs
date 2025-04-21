import React from 'react'
import { AppBar, Toolbar, Box, IconButton, Menu, MenuItem, Divider, Typography } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import Link from 'next/link'
import Image from 'next/image'
import LeftSidebar from './leftSidebar'
import RightSidebar from './rightSidebar'

const Header = ({
  onMenuClick,
  showLeftSidebar,
  isMobile,
  total,
  setTotal,
  setSelectedEvent,
  setAllEvents,
  route,
  router,
  showRightSidebar,
  editors,
  confidenceClrs,
}) => {
  const theme = useTheme()
  const background = theme.palette.background.main
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuItemClick = (option) => {
    onMenuClick(option)
    handleClose()
  }
  const handleCloseMenu = () => {
    onMenuClick(null)
  }
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background,
          boxShadow: 'none',
          borderBottom: '1px solid #DADCE0',
          height: '70px',
        }}
      >
        <Toolbar sx={{ mt: '8px' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  ml: isMobile ? '20px' : '110px',
                }}
              >
                <Link href={'/'}>
                  <Image width={118} height={40} src="/icons/capitalLogo.svg" alt="logo" />
                </Link>
              </Box>
            </Box>
          </Box>
          {(route === 'admin' || route === 'editor') && isMobile && !showLeftSidebar && !showRightSidebar && (
            <Box>
              <IconButton size="large" edge="end" color="inherit" aria-label="menu" onClick={handleClick}>
                <MenuIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {route === 'admin' && <MenuItem onClick={() => handleMenuItemClick('playlist')}>Playlist</MenuItem>}
                <MenuItem onClick={() => handleMenuItemClick('editor')}>Editor</MenuItem>
              </Menu>
            </Box>
          )}
          {(route === 'admin' || route === 'editor') && isMobile && (showLeftSidebar || showRightSidebar) && (
            <Box>
              <Typography sx={{ cursor: 'pointer' }} onClick={handleCloseMenu}>
                <img src="/icons/closeIcon.svg" alt="close" />
              </Typography>
            </Box>
          )}
        </Toolbar>

        {isMobile && showLeftSidebar && (
          <Box
            sx={{
              mt: '70px',
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              bgcolor: 'white',
              zIndex: 1400,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {route === 'admin' && (
              <Box>
                <Box
                  sx={{
                    padding: '14px 20px 9px 20px',
                    height: '69.5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
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
                </Box>
                <Divider sx={{ color: '#ECE9E9' }} />

                <LeftSidebar
                  eventCount={setTotal}
                  route={router}
                  selectedEvent={setSelectedEvent}
                  setAllEvents={setAllEvents}
                  isMobile={isMobile}
                  handleCloseMenu={handleCloseMenu}
                  showLeftSidebar={showLeftSidebar}
                />
              </Box>
            )}
          </Box>
        )}

        {isMobile && showRightSidebar && (
          <Box
            sx={{
              mt: '70px',
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              bgcolor: 'white',
              zIndex: 1400,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {route !== 'user' && (
              <Box>
                <Box
                  sx={{
                    padding: '0px 20px',
                    height: '69.5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
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
                <RightSidebar confidenceClrs={confidenceClrs} editors={editors} isMobile={isMobile} />
              </Box>
            )}
          </Box>
        )}
      </AppBar>
    </>
  )
}

export default Header
