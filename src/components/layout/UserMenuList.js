import React from 'react'
import { useRouter } from 'next/router'
import { MenuList, MenuItem } from '@mui/material'
import { useAuth } from '@/hooks/useAuth'

export default function UserMenuList() {
  const auth = useAuth()
  const router = useRouter()
  const permissions = auth.user?.permissions || {}

  return (
    <MenuList>
      {permissions.p_task?.permissionRead && (
        <MenuItem onClick={() => router.push('/tasks')}>My Current Tasks</MenuItem>
      )}
      {permissions.p_task?.permissionRead && (
        <MenuItem onClick={() => router.push('/tasks/completed')}>My Completed Tasks</MenuItem>
      )}
      <MenuItem onClick={() => router.push('/profile')}>My Profile</MenuItem>
      <MenuItem onClick={auth.logout}>Log out</MenuItem>
    </MenuList>
  )
}
