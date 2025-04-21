import React, { useState } from 'react'
import { useRouter } from 'next/router'

import { Stack, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material'
import {
  AddShoppingCartOutlined,
  AddTaskOutlined,
  AddToPhotosOutlined,
  BadgeOutlined,
  CategoryOutlined,
  Checklist,
  CircleOutlined,
  ContentCopy,
  Event,
  GroupAddOutlined,
  LocalGroceryStoreOutlined,
  LocalPoliceOutlined,
  Rule,
  SchemaOutlined,
  SettingsAccessibilityOutlined,
  TaskAltOutlined,
  TransferWithinAStationOutlined,
  VolunteerActivismOutlined,
} from '@mui/icons-material'

import { SYSTEM_ROLES } from '@/utils/constants'
import { useAuth } from '@/hooks/useAuth'

export default function NavTabs() {
  const auth = useAuth()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const role = auth.user?.role
  const path = router.pathname
  const permissions = auth.user?.permissions || {}
  const staffTabs = {
    admin: [
      {
        label: 'Rules',
        path: '/admin/manage-rules',
        icon: <Rule />,
        permission: permissions.p_workflow?.permissionRead,
      },
      // TODO: RT events will be added after MVP launch
      {
        label: 'Events',
        path: '/admin/manage-events',
        icon: <Event />,
        permission: false, // will be added post MVP launch
        //permission: permissions.p_event?.permissionRead,
      },
      {
        label: 'Files',
        path: '/admin/manage-files',
        icon: <ContentCopy />,
        permission: permissions.p_file?.permissionRead,
      },
      {
        label: 'Tasks',
        path: '/admin/task-list',
        icon: <TaskAltOutlined />,
        permission: permissions.p_task?.permissionRead,
      },
      {
        label: 'Add Task',
        path: '/admin/task-list',
        icon: <AddTaskOutlined />,
        permission: permissions.p_task?.permissionCreate,
      },
    ],
    order: [
      {
        label: 'Orders',
        path: '/order-management/order-list',
        icon: <LocalGroceryStoreOutlined />,
        permission: permissions.p_order?.permissionRead,
      },
      {
        label: 'Add Order',
        path: '/order-management/order',
        icon: <AddShoppingCartOutlined />,
        permission: permissions.p_order?.permissionCreate,
      },
    ],
    company: [
      {
        label: 'Categories',
        path: '/company/service-categories',
        icon: <CategoryOutlined />,
        permission: permissions.p_service?.permissionRead,
      },
      {
        label: 'Services',
        path: '/company/services',
        icon: <VolunteerActivismOutlined />,
        permission: permissions.p_service?.permissionRead,
      },
      {
        label: 'Addons',
        path: '/company/add-ons',
        icon: <AddToPhotosOutlined />,
        permission: permissions.p_service?.permissionRead,
      },
      {
        label: 'Task Types',
        path: '/company/task-types',
        icon: <Checklist />,
        permission: permissions.p_taskType?.permissionRead,
      },
      {
        label: 'Workflows',
        path: '/company/workflows',
        icon: <SchemaOutlined />,
        permission: permissions.p_workflow?.permissionRead,
      },
    ],
    user: [
      {
        label: 'Staff',
        path: '/user-management/staff',
        icon: <GroupAddOutlined />,
        permission: permissions.p_staff?.permissionRead,
      },
      {
        label: 'Designations',
        path: '/user-management/staff-designation',
        icon: <BadgeOutlined />,
        permission: permissions.p_designation?.permissionRead,
      },
      {
        label: 'Roles',
        path: '/user-management/role-management',
        icon: <LocalPoliceOutlined />,
        permission: role == SYSTEM_ROLES.ADMIN,
      },
      {
        label: 'Clients',
        path: '/user-management/client',
        icon: <SettingsAccessibilityOutlined />,
        permission: permissions.p_client?.permissionRead,
      },
      {
        label: 'Reseller',
        path: '/user-management/reseller',
        icon: <TransferWithinAStationOutlined />,
        permission: permissions.p_reseller?.permissionRead,
      },
    ],
  }
  const endUserTabs = [
    {
      label: 'Users',
      path: '/user-management/client',
      icon: <GroupAddOutlined />,
      permission: permissions.p_client?.permissionRead,
    },
    {
      label: 'Current Tasks',
      path: '/tasks',
      icon: <CircleOutlined />,
      permission: permissions.p_task?.permissionRead,
    },
    {
      label: 'Completed Tasks',
      path: '/tasks/completed',
      icon: <TaskAltOutlined />,
      permission: permissions.p_task?.permissionRead,
    },
    {
      label: 'Orders',
      path: '/order-management/order-list',
      icon: <LocalGroceryStoreOutlined />,
      permission: permissions.p_order?.permissionRead,
    },
    {
      label: 'Add Order',
      path: '/order-management/order',
      icon: <AddShoppingCartOutlined />,
      permission: permissions.p_order?.permissionCreate,
    },
  ]

  const module = path.split('/')[1].split('-')[0]
  const isStaff = role == SYSTEM_ROLES.ADMIN || role == SYSTEM_ROLES.STAFF
  const tabs = (isStaff ? staffTabs[module] || staffTabs.admin : endUserTabs).filter((tab) => tab.permission)
  const pathIndex = tabs.findIndex((tab) => router.pathname.startsWith(tab.path))
  const [value, setValue] = useState(pathIndex !== -1 ? pathIndex : 0)

  function handleChange(_, newValue) {
    setValue(newValue)
  }

  // TODO
  // will also need to add permission based hiding like main menu
  // if less than two tabs would be shown, add my stuff tabs

  return (
    <Stack variant={isMobile ? 'horizontal' : 'vertical'}>
      <Tabs
        aria-label="navigation tabs"
        orientation={isMobile ? 'horizontal' : 'vertical'}
        value={value}
        variant="scrollable"
        scrollButtons="auto"
        onChange={handleChange}
      >
        {tabs.map((tab, index) => (
          <Tab key={index} icon={tab.icon} label={tab.label} onClick={() => router.push(tab.path)} />
        ))}
      </Tabs>
    </Stack>
  )
}
