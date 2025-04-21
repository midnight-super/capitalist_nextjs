import React, { useState } from 'react'
import { useRouter } from 'next/router'

import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material'

import EditorAppLayout from './humanEditing/layout'
import Header from './Header'
import NavTabs from './NavTabs'
import MainMenu from './MainMenu'

export default function AppLayout({ children, selectedEvent, setEditorBgClr }) {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [globalSearchedTxt, setGlobalSearchedTxt] = useState('')
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false)

  const { pathname } = router
  const excludedRoutes = ['/', '/login', '/forgot-password', '/change-password']
  const excludedEditorRoutes = ['/admin-editor/[id]/[status]/[meeting]', '/enduser/[id]/[status]/[meeting]', '/editor']

  if (excludedRoutes.includes(pathname)) {
    return <>{children}</>
  } else if (excludedEditorRoutes.includes(pathname)) {
    return (
      <EditorAppLayout>{children && React.cloneElement(children, { selectedEvent, setEditorBgClr })}</EditorAppLayout>
    )
  }

  function closeMainMenu() {
    setIsMainMenuOpen(false)
  }
  function openMainMenu() {
    setIsMainMenuOpen(true)
  }

  return (
    <Box>
      <Header onToggleMainMenu={openMainMenu} setGlobalSearchedTxt={setGlobalSearchedTxt} />
      <Drawer open={isMainMenuOpen} onClose={closeMainMenu} Backdrop={{ onClick: closeMainMenu }}>
        <MainMenu close={() => setIsMainMenuOpen(false)} />
      </Drawer>
      <NavTabs />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          margin: isMobile ? '96px 16px 96px 16px' : '112px 32px 32px 112px',
          width: 'calc(100% - 112px - 32px)',
        }}
      >
        {/* TODO: Make Global Search Text part of the app context, or use hook, or localStorage */}
        {children && React.cloneElement(children, { globalSearchedTxt })}
      </Box>
    </Box>
  )
}
