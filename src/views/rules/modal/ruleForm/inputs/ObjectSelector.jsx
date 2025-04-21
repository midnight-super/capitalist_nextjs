import React from 'react'
import { Box, Grid, Button, Typography } from '@mui/material'

const ObjectSelector = ({ object, isView, selected, handleObjectSelect }) => {
  return (
    <Grid item key={object.objectId}>
      <Button
        variant="outlined"
        color="primary"
        disabled={isView}
        size="small"
        onClick={() => handleObjectSelect(object)}
        sx={{
          backgroundColor: selected ? '#4489FE' : '#F3F3F3',
          border: 'none',
          justifyContent: 'flex-start',
          width: '190px',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#639CFE',
            boxShadow:
              '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
            '& .inner-ring': {
              backgroundColor: '#639CFE',
            },
          },
          '&.Mui-disabled': {
            opacity: 0.6,
            cursor: 'not-allowed',
          },
        }}
      >
        {/* Dual Ring */}
        <Box
          sx={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #DADCE0',
            mx: '18px',
            background: 'white',
          }}
        >
          <Box
            className="inner-ring"
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: selected ? '#4489FE' : 'transparent',
            }}
          />
        </Box>
        <Typography variant="body2" color={selected ? 'white' : 'black'}>
          {object.objectName}
        </Typography>
      </Button>
    </Grid>
  )
}

export default ObjectSelector
