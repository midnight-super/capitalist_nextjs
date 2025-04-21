import { Box, IconButton, Typography } from '@mui/material'
import React from 'react'

const BasicPagination = ({ setPageNo, page, totalCount, pageSize }) => {
  const totalPages = Math.ceil(totalRecords / pageSize)

  const onPageChangeNext = () => {
    if (page < totalPages) setPageNo((prevPage) => prevPage + 1)
  }

  const onPageChangeBack = () => {
    if (page > 1) setPageNo((prevPage) => prevPage - 1)
  }

  const isNextDisabled = page >= totalPages
  const isBackDisabled = page <= 1

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Back button */}
      <IconButton
        sx={{ cursor: isBackDisabled ? 'not-allowed' : 'pointer' }}
        disabled={isBackDisabled}
        onClick={onPageChangeBack}
      >
        <Typography sx={{ color: isBackDisabled ? '#B7B9B9' : '#565656' }}>{'<'}</Typography>
      </IconButton>

      {/* Page count */}
      <Typography>{`Page ${page} of ${totalPages || 0}`}</Typography>

      {/* Next button */}
      <IconButton
        sx={{ cursor: isNextDisabled ? 'not-allowed' : 'pointer' }}
        disabled={isNextDisabled}
        onClick={onPageChangeNext}
      >
        <Typography
          sx={{
            color: isNextDisabled ? '#B7B9B9' : '#565656',
            cursor: isNextDisabled ? 'not-allowed' : 'pointer',
          }}
        >
          {'>'}
        </Typography>
      </IconButton>
    </Box>
  )
}

export default BasicPagination
