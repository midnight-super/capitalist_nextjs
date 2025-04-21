/* eslint-disable @next/next/no-img-element */
import { addServiceCategStyles, fieldStyles } from '@/styles/add-modals-styles';
import { Select, MenuItem, InputLabel, Box, Button, TextField, Popper, InputAdornment, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

const SearchableSelectField = ({
    value,
    onChange,
    label,
    options,
    handleCategoryOpen,
    add,
    setSelectedService,
    listContainers,
    handleServiceChange,
    setSelectedType
}) => {
    const { selectLabel } = addServiceCategStyles;
    const {
        selectContainer,
        selectStyle,
        menuItems,
        addNewButton,
        poperStyle,
        popperContainer,
        addNewIcon,
        searchField
    } = fieldStyles

    const popperRef = useRef(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);

    const filteredOptions = options?.filter(option =>
        option?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleMenuClick = (value, key) => {
        if (listContainers && listContainers?.length > 0) {
            handleServiceChange()
        } else {
            onChange(value);
            handleClose();
            setSearchTerm("");
            setSelectedService && setSelectedService(value);
            setSelectedType && setSelectedType(key)
        };
    }


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popperRef.current && !popperRef.current.contains(event.target) && !anchorEl?.contains(event.target)) {
                handleClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [anchorEl]);

    return (
        <Box sx={selectContainer}>
            <InputLabel
                id="demo-simple-select-label"
                sx={{ ...selectLabel, backgroundColor: "#fff", px: "5px" }}
            >
                {label}
            </InputLabel>

            <Select
                name={label}
                value={value}
                onChange={onChange}
                label={label}
                onClick={handleOpen}
                open={false}
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
                renderValue={(selected) => {
                    const selectedOption = options?.find(option => option?.value === selected);
                    return selectedOption ? selectedOption?.label : selected;
                }}
            />

            <Popper
                open={open}
                anchorEl={anchorEl}
                placement="bottom-start"
                sx={{
                    ...poperStyle,
                    width: anchorEl ? anchorEl.clientWidth : undefined,

                }}
                ref={popperRef}
            >
                <Box
                    sx={popperContainer}
                >
                    <TextField
                        placeholder="Search"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={searchField}
                        onClick={(e) => e.stopPropagation()}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <img
                                        src="/icons/searchIcon.svg"
                                        alt="plus"
                                        style={addNewIcon}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {filteredOptions?.length > 0 ? filteredOptions?.map((option, index) => (
                        <MenuItem
                            key={index}
                            value={option?.value}
                            onClick={() => handleMenuClick(option?.value, option?.label)}
                            sx={menuItems}
                        >
                            {option?.label}
                        </MenuItem>
                    )) : <Typography
                        sx={menuItems}
                    >
                        No data available
                    </Typography>}

                    {add && (
                        <Button
                            variant="text"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCategoryOpen();
                            }}
                            sx={addNewButton}
                        >
                            <img
                                src="/icons/circularPlusIcon.svg"
                                alt="plus"
                                style={addNewIcon}
                            />
                            Add a new Category
                        </Button>
                    )}
                </Box>
            </Popper>
        </Box>
    );
};

export default SearchableSelectField;
