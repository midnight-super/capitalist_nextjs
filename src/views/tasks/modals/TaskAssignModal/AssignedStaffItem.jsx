import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import AvatarWithName from '@/components/avatarWithName'

const AssignedStaffItem = ({ staff, onRemove }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        height: '50px',
        justifyContent: 'space-between',
        width: 'calc(50% - 84px)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AvatarWithName
          name={staff.fullName}
          profileUrl=""
          children={staff.roles?.length ? staff.roles.map((role) => role.roleName).join(', ') : 'Manager'}
        />
      </Box>

      <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => onRemove(staff.staffId)}
          sx={{ maxHeight: '30px', maxWidth: '100px' }}
        >
          Remove
        </Button>
      </Box>
    </Box>
  )
}

export default AssignedStaffItem
