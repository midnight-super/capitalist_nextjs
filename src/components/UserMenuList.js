import React from 'react'
import { useRouter } from 'next/router'
import { MenuList, MenuItem } from '@mui/material'
import { useAuth } from '@/hooks/useAuth'

export default function UserMenuList() {
  const auth = useAuth()
  const router = useRouter()

  return (
    <MenuList>
      <MenuItem onClick={() => router.push('/my-tasks')}>My Current Tasks</MenuItem>
      <MenuItem onClick={() => router.push('/my-completed-tasks')}>My Completed Tasks</MenuItem>
      <MenuItem onClick={() => router.push('/my-profile')}>My Profile</MenuItem>
      <MenuItem onClick={auth.logout}>Log out</MenuItem>
    </MenuList>
  )
}
