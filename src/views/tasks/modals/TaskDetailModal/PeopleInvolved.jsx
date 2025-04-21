import React from 'react'
import { Paper, Typography, Table, TableBody, TableRow, TableCell, Box } from '@mui/material'
import AvatarWithName from '@/components/avatarWithName'

const PeopleInvolved = ({ createdBy, assignedTo, theme }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      mb: 3,
      border: '1px solid',
      borderColor: theme.palette.textBackgroundColors.neutral75,
      borderRadius: 1,
    }}
  >
    <Typography variant="body2" color="textSecondary" sx={{ mb: 2, textAlign: 'center' }}>
      People Involved
    </Typography>
    <Table size="small">
      <TableBody sx={{ '& td': { border: 0 } }}>
        <TableRow>
          <TableCell variant="body1" sx={{ color: theme.palette.textBackgroundColors.neutral900 }}>
            Created By
          </TableCell>
          <TableCell variant="body1" sx={{ color: theme.palette.textBackgroundColors.neutral900 }}>
            Assigned To
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AvatarWithName name={createdBy} />
            </Box>
          </TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {assignedTo?.map((assignee, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                  <AvatarWithName name={assignee.assigneeName} />
                </Box>
              ))}
            </Box>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Paper>
)

export default PeopleInvolved
