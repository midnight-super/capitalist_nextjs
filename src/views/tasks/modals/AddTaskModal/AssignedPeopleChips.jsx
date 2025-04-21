import React from 'react'
import { Box, Chip, Avatar, useTheme, Typography, IconButton } from '@mui/material'
import { HighlightOffOutlined } from '@mui/icons-material'
const AssignedPeopleChips = ({ assignedPeople, onRemovePerson }) => {
  const theme = useTheme()
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
      {assignedPeople.map((person) => (
        <Chip
          key={person.staffId}
          label={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2, // controls spacing between avatar, name, and icon
                width: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar alt={person.fullName} src="../images/dummy.svg" sx={{ width: 24, height: 24 }} />

                <Typography variant="body1" color="textSecondary">
                  {person.fullName}
                </Typography>
                <IconButton onClick={() => onRemovePerson(person.staffId)} sx={{ p: 0, mr: 1 }}>
                  <HighlightOffOutlined />
                </IconButton>
              </Box>
            </Box>
          }
          sx={{
            backgroundColor: theme.palette.neutral950,
            color: theme.palette.text.primary,
            fontSize: '0.875rem',
            height: 32,
            borderRadius: '16px',
            px: 1.5,
            pr: 1,
            maxWidth: '250px',
            '& .MuiChip-label': {
              width: '100%',
              px: 0,
            },
          }}
        />
      ))}
    </Box>
  )
}

export default AssignedPeopleChips
