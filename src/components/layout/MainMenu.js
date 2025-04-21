import React from 'react'
import { useRouter } from 'next/router'

import { MenuItem, MenuList, ListItemText, ListSubheader, IconButton, Stack } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

import { SYSTEM_ROLES } from '@/utils/constants'
import { useAuth } from '@/hooks/useAuth'
import UserMenuList from './UserMenuList'

export default function MainMenu({ close }) {
  const auth = useAuth()
  const router = useRouter()
  const role = auth.user?.role
  const permissions = auth.user?.permissions || {}
  const setupItems = [
    {
      label: 'Service Categories',
      path: '/company/service-categories',
      permission: permissions.p_service?.permissionRead,
    },
    { label: 'Services', path: '/company/services', permission: permissions.p_service?.permissionRead },
    { label: 'Add-ons', path: '/company/add-ons', permission: permissions.p_service?.permissionRead },
    { label: 'Task Types', path: '/company/task-types', permission: permissions.p_taskType?.permissionRead },
    { label: 'Workflows', path: '/company/workflows', permission: permissions.p_workflow?.permissionRead },
    { label: 'Rules', path: '/admin/manage-rules', permission: permissions.p_rule?.permissionRead },
  ]
  const userItems = [
    { label: 'Staff', path: '/user-management/staff', permission: permissions.p_staff?.permissionRead },
    {
      label: 'Staff Designations',
      path: '/user-management/staff-designation',
      permission: permissions.p_designation?.permissionRead,
    },
    { label: 'Roles', path: '/user-management/role-management', permission: permissions.role == SYSTEM_ROLES.ADMIN },
    {
      label: 'Clients',
      path: '/admin/client-users',
      permission: permissions.role == SYSTEM_ROLES.ADMIN && p_client?.permissionRead,
    },
    {
      label: 'Clients',
      path: '/user-management/client',
      permission: permissions.role == 'CLIENT' && p_client?.permissionRead,
    },
    {
      label: 'Resellers',
      path: '/user-management/reseller',
      permission: permissions.p_reseller?.permissionRead,
    },
  ]
  const orderItems = [
    {
      label: 'Orders',
      path: '/order-management/order-list',
      permission: permissions.p_order?.permissionRead,
    },
    {
      label: 'Create Order',
      path: '/order-management/order-list',
      permission: permissions.p_order?.permissionCreate,
    },
  ]
  const productionItems = [
    { label: 'Tasks', path: '/admin/task-list', permission: permissions.p_task?.permissionRead },
    { label: 'Create Tasks', path: '/admin/task-list', permission: permissions.p_task?.permissionCreate },
  ]
  const addonItems = [
    {
      label: 'File Management',
      path: '/admin/manage-files',
      permission: permissions.p_file?.permissionRead,
    },
  ]
  // TODO
  // reorganize pages according to role (admin, client, reseller) or feature (setup, production, orders, etc.)
  // link to top pages, e.g. /admin, /staff, /client, /reseller
  // top pages either show role specific ui or redirect to sub pages, e.g. /client/orders, /admin/users, etc.
  const setupPath = role == SYSTEM_ROLES.ADMIN ? '/admin/setup' : '/client/setup'
  const userManagementPath = role == SYSTEM_ROLES.ADMIN ? '/admin/manage-users' : '/user-management/client'
  const ordersPath = role == SYSTEM_ROLES.ADMIN ? '/admin/order-management' : '/order-management/order-list'
  const productionPath = role == SYSTEM_ROLES.ADMIN ? '/admin/task-list' : '/client/task-list'
  const hasSetupPermission = setupItems.some((item) => item.permission)
  const hasUserPermission = userItems.some((item) => item.permission)
  const hasOrderPermission = orderItems.some((item) => item.permission)
  const hasProductionPermission = productionItems.some((item) => item.permission)
  const hasAddonPermission = addonItems.some((item) => item.permission)
  const hasMainItems = hasSetupPermission || hasUserPermission || hasOrderPermission || hasProductionPermission

  function onMenuItemClick(path) {
    router.push(path)
    close()
  }

  return (
    <>
      <Stack direction="row" justifyContent="end" alignItems="center">
        <IconButton onClick={close}>
          <ArrowBack />
        </IconButton>
      </Stack>
      <Stack sx={{ width: '260px', justifyContent: 'center', alignItems: 'center' }}>
        <MenuList>
          {hasMainItems && <ListSubheader>Main</ListSubheader>}

          {hasSetupPermission && <MenuItem onClick={() => onMenuItemClick(setupPath)}>Company Setup</MenuItem>}
          {setupItems.map(
            ({ label, path, permission }, index) =>
              permission && (
                <MenuItem key={index} onClick={() => onMenuItemClick(path)}>
                  <ListItemText inset>{label}</ListItemText>
                </MenuItem>
              )
          )}

          {hasUserPermission && <MenuItem onClick={() => onMenuItemClick(userManagementPath)}>Users</MenuItem>}
          {userItems.map(
            ({ label, path, permission }, index) =>
              permission && (
                <MenuItem key={index} onClick={() => onMenuItemClick(path)}>
                  <ListItemText inset>{label}</ListItemText>
                </MenuItem>
              )
          )}

          {hasOrderPermission && <MenuItem onClick={() => onMenuItemClick(ordersPath)}>Orders</MenuItem>}
          {orderItems.map(
            ({ label, path, permission }, index) =>
              permission && (
                <MenuItem key={index} onClick={() => onMenuItemClick(path)}>
                  <ListItemText inset>{label}</ListItemText>
                </MenuItem>
              )
          )}

          {hasProductionPermission && <MenuItem onClick={() => onMenuItemClick(productionPath)}>Production</MenuItem>}
          {productionItems.map(
            ({ label, path, permission }, index) =>
              permission && (
                <MenuItem key={index} onClick={() => onMenuItemClick(path)}>
                  <ListItemText inset>{label}</ListItemText>
                </MenuItem>
              )
          )}

          {hasAddonPermission && <ListSubheader>Addons</ListSubheader>}
          {addonItems.map(
            ({ label, path, permission }, index) =>
              permission && (
                <MenuItem key={index} onClick={() => onMenuItemClick(path)}>
                  <ListItemText>{label}</ListItemText>
                </MenuItem>
              )
          )}

          <ListSubheader>My Stuff</ListSubheader>
          <UserMenuList />
        </MenuList>
      </Stack>
    </>
  )
}
