const inputDropdownStyles = {
    mainContainer: {
        "& .MuiOutlinedInput-input": {
            color: "#212121 !important",
        },
        "& .MuiInputLabel-root": {
            color: "#757575 !important",
            fontSize: "14px",
            fontWeight: 400,
        },
        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
            display: "none",
        },
    },
    boxContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 0.5,
        alignItems: 'center',
        padding: '14.5px 0',
        flexWrap: 'wrap',
    },
    menuContainer: {
        padding: "10px",
        position: "relative",
    },
    chipContent: {
        height: '24px',
        borderRadius: '3px',
        '.MuiChip-label': { fontSize: '12px', color: '#4489FE' },
        backgroundColor: '#E9F0FD',
    },
    chipMoreContent: {
        height: '12px',
        backgroundColor: 'transparent',
        textDecoration: 'underline',
        color: '#1976d2',
    },
    dropdownIconContainer: {
        cursor: 'pointer',
        position: 'absolute',
        right: '10px'
    },
    dropdownIcon: {
        width: "10px",
        height: "5px",
        pointerEvents: "none", 
    },
    closeIcon : {
        position: "absolute",
        top: "5px",
        right: "10px",
        cursor: "pointer",
        width:'15px',
        height: '15px'
    }
}
export { inputDropdownStyles };