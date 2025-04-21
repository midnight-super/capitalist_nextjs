import React from 'react'
import { Paper, Typography, Table, TableBody, TableRow, TableCell, Link, TableContainer, Box } from '@mui/material'
const AttachmentsAndLinks = ({ attachments, theme }) => (
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
      Attachments & Links
    </Typography>
    <Box sx={{ display: 'flex', position: 'relative' }}>
      <Paper
        elevation={0}
        sx={{
          width: '50%',
          pr: 2,
          border: 'none',
        }}
      >
        <TableContainer>
          <Table size="small" sx={{ borderCollapse: 'collapse' }}>
            <TableBody>
              {attachments.map((attachment, index) => (
                <TableRow key={index} sx={{ border: 0 }}>
                  <TableCell sx={{ border: 0, color: theme.palette.textBackgroundColors.neutral750 }}>
                    {attachment.fileName}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '20%', // Starts 10% from the top to achieve 80% height
          height: '60%', // 80% of the parent container's height
          width: '2px',
          backgroundColor: theme.palette.textBackgroundColors.neutral75,
          transform: 'translateX(-50%)', // Centers the line horizontally
        }}
      />
      <Paper
        elevation={0}
        sx={{
          width: '50%',
          pl: 5,
          border: 'none',
        }}
      >
        <TableContainer>
          <Table size="small" sx={{ borderCollapse: 'collapse' }}>
            <TableBody>
              {attachments.map((attachment, index) => (
                <TableRow key={index} sx={{ border: 0 }}>
                  <TableCell sx={{ border: 0 }}>
                    <Link variant="body1" href="#" underline="hover" sx={{ textDecoration: 'underline' }}>
                      {attachment.status}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  </Paper>
)

export default AttachmentsAndLinks
