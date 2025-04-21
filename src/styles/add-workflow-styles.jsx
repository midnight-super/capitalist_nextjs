const addWorkflowStyles = {
    mainContainer: {
        marginBottom: "12px"
    },
    backHeader: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "14px",
    },
    backArrow: {
        cursor: "pointer"
    },
    addWorkflowText: {
        fontWeight: "500",
        fontSize: "17px",
        color: "#212121"
    },
    gridContainer: {
        marginTop: "30px",
        padding: 0,
        width: "100%"
    },
    nameInput: {
        height: "70px"
    },
    descriptionInput: {
        height: "170px"
    },
    addListContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        height: "420px",
        width: "100%",
        padding: "14px",
        backgroundColor: "#FBFBFB",
        borderRadius: "4px",
        boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.15)',
        overflowX: "auto",
        scrollbarWidth: "thin",
        overflowY: "hidden"
    },
    listContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        height: "390px",
        minWidth: "300px",
        marginRight: "8px",
        overflowY: "auto",
        scrollbarWidth: "thin",
    },
    itemCard: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "98%",
        backgroundColor: "#fff",
        paddingLeft: "20px",
        paddingRight: "10px",
        minHeight: "53px",
        borderRadius: "6px",
        boxShadow: '0px 0px 3px 0px rgba(0, 0, 0, 0.1)',
        marginBottom: "10px"
    },
    itemInput: {
        '& .MuiInputBase-input': {
            paddingY: '2px',
            paddingX: "10px",
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: "center",
            backgroundColor: "white",
            fontSize: "13px"
        },
        '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
                borderColor: '#639cfe',
            },
        },
        width: "93px"
    },
    listName: {
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        color: "#212121",
        textTransform: "uppercase"
    },
    itemName: {
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "500",
        color: "#212121",
    },
    itemFieldsContainer: {
        width: "80%",
        display: "flex",
        flexDirection: "column",
        minHeight: "50px"
    },
    addItemButton: {
        alignItems: 'center',
        justifyContent: 'center',
        color: '#4489FE',
        fontSize: '14px',
        fontWeight: 500,
        alignSelf: "flex-start",
        textTransform: "none",
        fontSize: "16px"
    },
    menuContainer: {
        zIndex: 1,
        mt: '10px',
        '& .MuiPaper-root': {
            width: '157px',
            fontSize: '16px',
            color: '#212121',
            boxShadow: ' 0px 0px 4px 0px rgba(0, 0, 0, 0.15)',
        },
    },
    menuItem: {
        fontSize: "15px",
        color: "#212121",
        my: "4px",
        ml: "4px"
    },
    threeDotIcon: {
        cursor: "pointer"
    },
    loader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
    },
    placeholderText: {
        fontSize: "14px",
        color: "#757575",
        fontStyle: "italic",
        mt: "10px"
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        justifySelf: "end",
        gap: 2,
        flexDirection: { xs: 'column', md: 'row' }
    },
    button: {
        textTransform: 'capitalize',
        width: '200px',
        height: '50px',
        borderRadius: '4px',
        fontWeight: 700,
        lineHeight: 'normal',
    },
    taskTypeDialogPaper: {
        width: '550px',
        boxShadow: 'none',
    },
    taskTypeBackdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    taskTypeDialogContent: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        px: '24px',
        py: '30px',
        height: '100%',
    },
    dropDownContainer: {
        width: "100%"
    },
    taskTypeButtonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        mt: '24px',
    },
    cancelButton: {
        textTransform: 'capitalize',
        color: '#757575',
        height: '50px',
        width: '100px',
        borderRadius: '4px',
        border: '1px solid #DEE0E4',
        fontWeight: 700,
        lineHeight: 'normal',
    },
    selectButton: {
        textTransform: 'capitalize',
        height: '50px',
        width: '100px',
        borderRadius: '4px',
        color: '#fff',
        fontWeight: 700,
        lineHeight: 'normal',
    },
    errorList: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '16px',
        maxHeight: '200px',
        overflowY: 'auto',
        boxShadow: 'inset 0px 1px 6px rgba(0,0,0,0.1)',
        marginBottom: '24px',
    },
    errorTitle: {
        fontSize: '14px',
        fontWeight: 500,
        color: '#D32F2F',
        padding: '6px 0',
    },
    deleteItemModalText: {
        color: "red",
        fontWeight: "bold"
    }
};

export { addWorkflowStyles };