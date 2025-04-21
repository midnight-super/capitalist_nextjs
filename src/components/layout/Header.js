import React, { useState } from 'react'
import { useRouter } from 'next/router'

import { AppBar, Box, Button, IconButton, Link, Menu, Stack, Toolbar, useMediaQuery, useTheme } from '@mui/material'
import { ArrowDropDown, Menu as MenuIcon } from '@mui/icons-material'

import { routeName } from '@/utils'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'

import AvatarWithName from '@/components/avatarWithName'
import GlobalSearchInput from '@/components/layout/GlobalSearchInput'
import UserMenuList from './UserMenuList'

export default function Header({ onToggleMainMenu, setGlobalSearchedTxt }) {
  const auth = useAuth()
  const theme = useTheme()
  const router = useRouter()
  const routeOf = routeName(router?.pathname)
  const user = auth?.user || {}
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [anchorUser, setAnchorUser] = useState(null)

  const openUserMenu = (event) => {
    console.log(event.currentTarget)
    setAnchorUser(event.currentTarget)
  }

  const closeUserMenu = () => {
    setAnchorUser(null)
  }

  const logoutUser = () => {
    auth.logout()
    closeUserMenu()
  }

  const UserInfo = () => (
    <Stack direction="row">
      <AvatarWithName name={user?.fullName}>
        <Button variant="text" color="success" onClick={openUserMenu} endIcon={<ArrowDropDown />} sx={{ p: 0 }}>
          {user?.status}
        </Button>
      </AvatarWithName>
      <Menu
        id="user-menu"
        // Menu positioning doesn't seem to work right in a fixed AppBar?
        sx={{ mt: '45px', left: 'calc(100vw - 190px)', width: '208px' }}
        anchorEl={anchorUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        keepMounted
        open={Boolean(anchorUser)}
        onClose={closeUserMenu}
      >
        <UserMenuList />
      </Menu>
    </Stack>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton aria-label="menu" onClick={onToggleMainMenu}>
            <MenuIcon />
          </IconButton>

          <Link href={'/'} sx={{ marginLeft: '32px' }}>
            <Image width={118} height={40} src="/icons/capitalLogo.svg" alt="logo" priority />
          </Link>

          <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
            {!isMobile && routeOf === 'admin' && <GlobalSearchInput setGlobalSearchedTxt={setGlobalSearchedTxt} />}
          </Box>

          <UserInfo />
        </Toolbar>
      </AppBar>
    </Box>
  )
}
