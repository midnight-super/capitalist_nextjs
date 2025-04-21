import { Box, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'
import RoleManagementTable from '@/views/role-management/role-managementTable'
import { tableWrapperStyles } from '@/styles/table-styles'

const Role = () => {
  const { mainContainer } = tableWrapperStyles

  const isMobile = useMediaQuery('(max-width:1395px)')
  const [colSorting, setColSorting] = useState({
    createdAt: 'desc', // Default sort by date in descending order
  })

  return (
    <Box sx={{ p: 3 }}>
      <RoleManagementTable initialSorting={colSorting} />
    </Box>
  )
}

Role.permissions = ['role.read']
export default Role
