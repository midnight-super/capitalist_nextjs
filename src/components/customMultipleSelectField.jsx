import { addServiceCategStyles, fieldStyles } from '@/styles/add-modals-styles';
import { Select, MenuItem, InputLabel } from '@mui/material';
import React from 'react';

const CustomMultipleSelectField = ({ value = [], onChange, label, options }) => {
    const { selectLabel } = addServiceCategStyles;
    const { selectStyle, menuProps, menuItems } = fieldStyles
    const handleChange = (event) => {
        const selectedValues = event.target.value || [];
        onChange(selectedValues);
    };
    return (
        <>
            <InputLabel
                id="demo-simple-select-label"
                sx={selectLabel}
            >
                {label}
            </InputLabel>
            <Select
                multiple
                value={Array.isArray(value) ? value : []}
                onChange={handleChange}
                label={label}
                sx={{
                    ...selectStyle,
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    },
                    '& .MuiSelect-select': {
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4489FE',
                    },
                    '& .MuiSvgIcon-root': {
                        color: "rgba(0, 0, 0, 0.54)",
                    },
                }}
                MenuProps={{
                    PaperProps: {
                        sx: menuProps,
                    },
                }}
                renderValue={(selected) =>
                    selected?.map((val) => options?.find((opt) => opt?.value === val)?.label || val)?.join(', ')
                }

            >
                {
                    !!options &&
                    options?.map((option, index) => (
                        <MenuItem key={index} value={option?.value} sx={menuItems}>
                            {option?.label}
                        </MenuItem>
                    ))
                }
            </Select>
        </>
    );
};

export default CustomMultipleSelectField;
