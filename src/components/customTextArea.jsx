import { TextField } from '@mui/material';
import React from 'react';

const CustomTextArea = ({
    onChange,
    disabled,
    value,
    label,
    error,
    minRows,
    maxRows,
    ...props
}) => {
    return (
        <TextField
            {...props}
            error={error}
            fullWidth
            label={label || ''}
            value={value || ''}
            variant="outlined"
            onChange={onChange}
            disabled={disabled || false}
            inputMode={'text'}
            type={'text'}
            multiline
            minRows={minRows}
            maxRows={maxRows}
            inputProps={{ maxLength: 150 }}
            sx={{
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                '& .MuiOutlinedInput-input': {
                    color: '#212121 !important',
                },
                '& .MuiOutlinedInput-root': {
                    fontSize: '14px',
                    textAlign: 'center',
                    fontWeight: 400,
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: "100%",
                    padding: '20px 14px',
                    minHeight: '50px',
                },
                '& .MuiInputLabel-root': {
                    color: '#757575 !important',
                    fontSize: '14px',
                    fontWeight: 400
                },
                "& .MuiOutlinedInput-input.Mui-disabled": {
                    WebkitTextFillColor: '#212121',
                    fontSize: '14px'
                },
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    display: 'none',
                },
            }}

        />
    );
};

export default CustomTextArea;