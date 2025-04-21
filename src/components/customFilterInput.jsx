import { InputAdornment, TextField, Typography } from '@mui/material'
import React from 'react'

const CustomFilterInput = ({ label, onChange, value = '', handleClear, type }) => {
  return (
    <>
      <TextField
        fullWidth
        variant="standard"
        placeholder={label || ''}
        value={value || ''}
        type={type || 'text'}
        onChange={onChange}
        slotProps={{
          startAdornment: (
            <InputAdornment position="start">
              <img src="/icons/filterIcon.svg" alt="filter" />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <Typography component="div" sx={{ cursor: 'pointer' }} onClick={() => handleClear(onChange)}>
                <img src="/icons/clearIcon.svg" alt="clear" />
              </Typography>
            </InputAdornment>
          ),
        }}
      />
    </>
  )
}

export default CustomFilterInput
