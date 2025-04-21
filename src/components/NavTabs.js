import React, { useState } from 'react'
import { useRouter } from 'next/router'

import { Stack, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material'
import {
  AddShoppingCartOutlined,
  AddTaskOutlined,
  AddToPhotosOutlined,
  CategoryOutlined,
  ContentCopy,
  Checklist,
  // Event,
  GroupAddOutlined,
  Rule,
  SchemaOutlined,
  TaskAltOutlined,
  VolunteerActivismOutlined,
  LocalGroceryStoreOutlined,
  TransferWithinAStationOutlined,
  SettingsAccessibilityOutlined,
  LocalPoliceOutlined,
  BadgeOutlined,
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
  const roleTabs = {
    admin: [
      {
        label: 'Rules',
        path: '/admin/manage-rules',
        icon: <Rule />,
        permission: auth.user?.permissions?.p_workflow.permissionRead,
      },
      // TODO: RT events will be added after MVP launch
      // {
      //   label: 'Events',
      //   path: '/admin/manage-events',
      //   icon: <Event />,
      //   permission: auth.user?.permissions?.p_event.permissionRead,
      // },
      {
        label: 'Files',
        path: '/admin/manage-files',
        icon: <ContentCopy />,
        permission: auth.user?.permissions?.p_file.permissionRead,
      },
      {
        label: 'Tasks',
        path: '/admin/task-list',
        icon: <TaskAltOutlined />,
        permission: auth.user?.permissions?.p_task.permissionRead,
      },
      {
        label: 'Add Task',
        path: '/admin/task-list',
        icon: <AddTaskOutlined />,
        permission: auth.user?.permissions?.p_task.permissionCreate,
      },
    ],
    company: [
      {
        label: 'Categories',
        path: '/company/service-categories',
        icon: <CategoryOutlined />,
        permission: auth.user?.permissions?.p_service.permissionRead,
      },
      {
        label: 'Services',
        path: '/company/services',
        icon: <VolunteerActivismOutlined />,
        permission: auth.user?.permissions?.p_service.permissionRead,
      },
      {
        label: 'Addons',
        path: '/company/add-ons',
        icon: <AddToPhotosOutlined />,
        permission: auth.user?.permissions?.p_service.permissionRead,
      },
      {
        label: 'Task Types',
        path: '/company/task-types',
        icon: <Checklist />,
        permission: auth.user?.permissions?.p_taskType.permissionRead,
      },
      {
        label: 'Workflows',
        path: '/company/workflows',
        icon: <SchemaOutlined />,
        permission: auth.user?.permissions?.p_workflow.permissionRead,
      },
    ],
    user: [
      {
        label: 'Staff',
        path: '/user-management/staff',
        icon: <GroupAddOutlined />,
        permission: auth.user?.permissions?.p_staff.permissionRead,
      },
      {
        label: 'Designations',
        path: '/user-management/staff-designation',
        icon: <BadgeOutlined />,
        permission: auth.user?.permissions?.p_designation.permissionRead,
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
        permission: auth.user?.permissions?.p_client.permissionRead,
      },
      {
        label: 'Reseller',
        path: '/user-management/reseller',
        icon: <TransferWithinAStationOutlined />,
        permission: auth.user?.permissions?.p_reseller.permissionRead,
      },
    ],
    ENTERPRISESTAFF: [
      { label: 'Current Tasks', path: '/admin/task-list', icon: <TaskAltOutlined />, permission: true },
      { label: 'Completed Tasks', path: '/admin/task-list', icon: <TaskAltOutlined />, permission: true },
    ],
    CLIENTSTAFF: [
      {
        label: 'Users',
        path: '/user-management/client',
        icon: <GroupAddOutlined />,
        permission: auth.user?.permissions?.p_client.permissionRead,
      },
      {
        label: 'Orders',
        path: '/order-management/order-list',
        icon: <LocalGroceryStoreOutlined />,
        permission: auth.user?.permissions?.p_order.permissionRead,
      },
      {
        label: 'Add Order',
        path: '/order-management/order',
        icon: <AddShoppingCartOutlined />,
        permission: auth.user?.permissions?.p_order.permissionCreate,
      },
    ],
    RESELLER: [
      {
        label: 'Users',
        path: '/user-management/reseller',
        icon: <GroupAddOutlined />,
        permission: auth.user?.permissions?.p_reseller.permissionRead,
      },
      {
        label: 'Orders',
        path: '/order-management/order-list',
        icon: <LocalGroceryStoreOutlined />,
        permission: auth.user?.permissions?.p_order.permissionRead,
      },
      {
        label: 'Add Order',
        path: '/order-management/order',
        icon: <AddShoppingCartOutlined />,
        permission: auth.user?.permissions?.p_order.permissionCreate,
      },
    ],
  }
  const module = path.split('/')[1].split('-')[0] || 'admin'
  const tabs = roleTabs[role == SYSTEM_ROLES.ADMIN ? module : role] || []
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
        {tabs.map((tab, index) => {
          return (
            tab.permission && (
              <Tab key={index} icon={tab.icon} label={tab.label} onClick={() => router.push(tab.path)} />
            )
          )
        })}
      </Tabs>
    </Stack>
  )
}
