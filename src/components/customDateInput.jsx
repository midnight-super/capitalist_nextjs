import { InputAdornment, TextField } from '@mui/material';
import React from 'react';

const CustomDateInput = ({ label, onChange, value }) => {
    return (
        <>
            <TextField
                label={label || ''}
                fullWidth
                variant="outlined"
                placeholder={label || ''}
                value={value}
                type="time"
                onChange={onChange}
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
                        padding: '0 !important',
                        display: 'flex',
                        alignItems: 'center',
                    },
                    '& .MuiInputLabel-root': {
                        color: '#757575 !important',
                        fontSize: '14px',
                        fontWeight: 400,
                    },
                    '& .MuiOutlinedInput-input.Mui-disabled': {
                        WebkitTextFillColor: '#212121',
                        fontSize: '14px',
                    },
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                    {
                        display: 'none',
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="end">
                            <img src="/icons/filterIcon.svg" alt="filter" />
                        </InputAdornment>
                    ),
                }}
            />
        </>
    );
};

export default CustomDateInput;
