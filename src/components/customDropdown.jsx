import * as React from 'react';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

const styles = {
  outlinedInput: {
    border: '1px solid #CCD1D1',
  },
};

export default function AutoCompleteMenu({
  isEnabled = false,
  value,
  option,
  placeHolder,
  setValue,
  width,
  label,
  error,
}) {
  const defaultProps = {
    options: option || [],
    getOptionLabel: (option) => String(option.label),
  };

  return (
    <Autocomplete
      {...defaultProps}
      id="controlled-demo"
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      disabled={isEnabled ? isEnabled : false}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      sx={{
        width: { width },
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeHolder}
          variant="outlined"
          label={label || ''}
          disabled={isEnabled ? isEnabled : false}
          error={error}
          sx={{
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            '& .MuiOutlinedInput-input': {
              color: '#212121 !important',
            },
            '& .MuiOutlinedInput-root': {
              height: '50px',
              fontSize: '14px',
              textAlign: 'center',
              fontWeight: 400,
              borderRadius: '4px',
              padding: '10px !important',
              display: 'flex',
              alignItems: 'center',
            },
            '& .MuiInputLabel-root': {
              color: '#757575 !important',
              textAlign: 'center',
              fontSize: '14px',
            },
            '& .MuiOutlinedInput-input.Mui-disabled': {
              WebkitTextFillColor: '#212121',
              fontSize: '14px',
            },
          }}
        />
      )}
    />
  );
}
