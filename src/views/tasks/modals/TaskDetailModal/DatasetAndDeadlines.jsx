import React from 'react'
import { Paper, Typography, Table, TableBody, TableRow, TableCell, TableHead } from '@mui/material'
import { formatDate } from '@/utils'
const DatasetAndDeadlines = ({ createdOn, dueDate, lastUpdated, completedOn, theme }) => {
  const columns = [
    { label: 'Created On', value: formatDate(createdOn) },
    { label: 'Due Date', value: formatDate(dueDate) },
    { label: 'Last Updated', value: formatDate(lastUpdated) },
    { label: 'Completed On', value: formatDate(completedOn) },
  ]

  return (
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
        Datasets & Deadlines
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col, index) => (
              <TableCell
                key={index}
                sx={{
                  color: theme.palette.textBackgroundColors.neutral950,
                }}
              >
                <Typography variant="h4">{col.label}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody sx={{ border: `1px solid ${theme.palette.textBackgroundColors.neutral100}` }}>
          <TableRow>
            {columns.map((col, index) => (
              <TableCell
                key={index}
                sx={{
                  py: 2,
                  color: theme.palette.textBackgroundColors.neutral800,
                }}
              >
                <Typography variant="body1">{col.value}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
}

export default DatasetAndDeadlines
