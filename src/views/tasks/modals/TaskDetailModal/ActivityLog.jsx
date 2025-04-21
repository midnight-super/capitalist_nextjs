import React from 'react'
import { Paper, Typography, Table, TableBody, TableRow, TableCell, TableHead } from '@mui/material'
import { formatDate } from '@/utils'
const ActivityLog = ({ log, theme }) => {
  const columns = [
    { label: 'User', key: 'executorId' },
    { label: 'Time', key: 'dateTime' },
    { label: 'Action', key: 'eventType', sx: { color: theme.palette.primary.main } },
    { label: 'Description', key: 'comments' },
  ]
  return (
    <Paper
      elevation={0}
      sx={{ p: 3, border: `1px solid ${theme.palette.textBackgroundColors.neutral75}`, borderRadius: 1 }}
    >
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2, textAlign: 'center' }}>
        Activity Log
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col, index) => (
              <TableCell key={index} sx={{ color: theme.palette.textBackgroundColors.neutral950 }}>
                <Typography variant="h4">{col.label}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody sx={{ border: `1px solid ${theme.palette.textBackgroundColors.neutral100}` }}>
          {log.map((entry, rowIndex) => (
            <TableRow key={rowIndex} sx={{ '& td': { border: 0 } }}>
              {columns.map((col, colIndex) => (
                <TableCell
                  key={colIndex}
                  sx={{
                    color: theme.palette.textBackgroundColors.neutral800,
                    pt: 2,
                    ...(col.sx || {}),
                  }}
                >
                  <Typography variant="h4">
                    {col.key === 'dateTime'
                      ? formatDate(entry[col.key])
                      : col.key === 'eventType'
                        ? `• ${entry[col.key]}`
                        : entry[col.key]}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default ActivityLog
