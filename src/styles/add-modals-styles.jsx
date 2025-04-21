const addServiceCategStyles = {
  dialogContainer: {
    paddingHorizontal: '12px',
  },
  dialogPaperProps: {
    width: {
      xs: '100vw',
      md: '50vw',
    },
    boxShadow: 'none',
    position: 'relative',
  },
  dialogBackdropProps: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  dialogTitle: {
    fontSize: '18px',
    color: '#212121',
    py: '16px !important',
    px: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: 400,
  },
  dialogSubTitle: {
    fontSize: '17px',
    color: '#212121',
    fontWeight: 400,
    marginBottom: '20px',
  },
  dialogContent: {
    padding: '34px 30px',
    height: '100%',
  },
  dialogContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '441px',
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  inputContainer: {
    padding: 0,
  },
  gridContainer: {
    margin: 0,
    padding: 0,
  },
  nameInput: {
    height: '70px',
  },
  descriptionInput: {
    height: '170px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    justifySelf: 'center',
    gap: 2,
    flexDirection: { xs: 'column', md: 'row' },
  },
  button: {
    textTransform: 'capitalize',
    width: '200px',
    height: '50px',
    borderRadius: '4px',
    fontWeight: 700,
    lineHeight: 'normal',
  },
  selectLabel: {
    color: '#757575 !important',
    fontSize: '14px',
    fontWeight: 400,
  },
  descriptionInput: {
    height: '170px',
  },
  typeTitle: {
    fontSize: '16px',
    color: '#212121',
    py: '3px !important',
    px: '0px !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: 400,
  },
};

const fieldStyles = {
  selectContainer: {
    position: 'relative',
  },
  selectStyle: {
    py: '10px',
    height: '50px',
    background: '#fff',
    color: '#000',
    fontSize: '14px',
    fontWeight: 400,
    borderRadius: '4px',
    width: '100%',
  },
  poperStyle: {
    zIndex: 1300,
    height: '250px',
  },
  popperContainer: {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.15)',
    maxHeight: '260px',
    overflowY: 'auto',
    padding: '8px',
    mt: '16px',
  },
  menuProps: {
    boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.15)',
    borderRadius: '4px',
    marginTop: '4px',
    maxHeight: '200px',
    overflowY: 'scroll',
    paddingBottom: '0px',
  },
  menuItems: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#000',
  },
  addNewButton: {
    position: 'sticky',
    bottom: '0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4489FE',
    fontSize: '14px',
    fontWeight: 400,
    borderTop: '1px solid #ccc',
    backgroundColor: '#fff',
    height: '50px',
    '&:hover': {
      backgroundColor: '#fff',
    },
    textTransform: 'none',
    width: '100%',
  },
  addNewIcon: {
    marginRight: '4px',
  },
  searchField: {
    mb: 2,
    '& .MuiOutlinedInput-root': {
      fontSize: '14px',
      backgroundColor: '#fff',
      mt: '4px',
    },
  },
  listSubHeader: {
    backgroundColor: '#f8f8f8',
    color: '#979797',
    fontSize: '12px',
    lineHeight: '36px',
    fontWeight: '600',
  },
};

const addOnsStyles = {
  dialogContainer: {
    paddingHorizontal: '12px',
  },
  dialogPaperProps: {
    width: {
      xs: '100vw',
      md: '50vw',
    },
    boxShadow: 'none',
    position: 'relative',
  },
  dialogBackdropProps: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  dialogTitle: {
    fontSize: '18px',
    color: '#212121',
    py: '16px !important',
    px: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: 400,
  },
  formTitle: {
    fontSize: '16px',
    color: '#212121',
    pb: '16px !important',
    pt: '0px !important',
    px: '0px !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: 400,
  },
  optionTitle: {
    fontSize: '16px',
    color: '#212121',
    pb: '0px !important',
    pt: '16px !important',
    px: '0px !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: 400,
  },

  formContainer: {
    display: 'flex',
    gap: 2,
    flexDirection: { xs: 'column', sm: 'row' },
    width: '100%',
    height: '100%',
  },
  optionContainer: { marginTop: 0, width: '100%' },
  firstContainer: {
    display: 'flex',
    gap: 2,
    flexDirection: { xs: 'column', md: 'row' },
  },
  secondContainer: {
    display: 'flex',
    gap: 2,
    marginTop: 2,
    flexDirection: { xs: 'column', md: 'row' },
  },

  addOptionButton: { marginTop: 2, fontSize: { xs: '10px', md: '14px' } },

  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  fullHeightWidth: { width: '100%', height: '100%' },

  typeTitle: {
    fontSize: '16px',
    color: '#212121',
    py: '16px !important',
    px: '0px !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: 400,
  },
  dialogContent: {
    padding: '34px 30px',
    height: '100%',
  },
  dialogContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '441px',
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  inputContainer: {
    padding: 0,
  },

  nameInput: {
    height: '70px',
  },
  descriptionInput: {
    height: '170px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 2,
    justifySelf: 'center',
    flexDirection: { xs: 'column', md: 'row' },
  },
  button: {
    textTransform: 'capitalize',
    width: '200px',
    height: '50px',
    borderRadius: '4px',
    fontWeight: 700,
    lineHeight: 'normal',
  },
  selectLabel: {
    color: '#757575 !important',
    fontSize: '14px',
    fontWeight: 400,
  },
  removeButton: {
    height: '2px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    mb: '30px',
  },
  optionDivider: {
    display: 'flex',
    alignItems: 'center',
    marginY: 2,
    opacity: 0.8,
  },
  optionDividerNum: {
    paddingRight: 2,
    fontWeight: 'bold',
    fontSize: '1rem',
    color: '#555',
  },
  optionDividerStyle: {
    flexGrow: 1,
    borderBottom: '1px solid #ddd',
  },
};

const staffStyles = {
  dialogContainer: {
    paddingHorizontal: '12px',
  },
  dialogPaperProps: {
    width: {
      xs: '100vw',
      md: '50vw',
    },
    boxShadow: 'none',
    position: 'relative',
  },
  dialogBackdropProps: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  dialogTitle: {
    fontSize: '18px',
    color: '#212121',
    py: '16px !important',
    px: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: 400,
  },

  formContainer: {
    display: 'flex',
    gap: 2,
    flexDirection: { xs: 'column', sm: 'row' },
    width: '100%',
    height: '100%',
  },
  dialogContent: {
    padding: '34px 30px',
    height: '100%',
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    marginBottom: 2,
  },

  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 2,
    justifySelf: 'center',
    flexDirection: { xs: 'column', md: 'row' },
  },
  button: {
    textTransform: 'capitalize',
    width: '200px',
    height: '50px',
    borderRadius: '4px',
    fontWeight: 700,
    lineHeight: 'normal',
  },
  nameInput: {
    height: '65px',
  },
};

const taskTypeStyles = {
  dialogContainer: {
    paddingHorizontal: '12px',
  },
  dialogPaperProps: {
    width: {
      xs: '100vw',
      md: '50vw',
    },
    boxShadow: 'none',
    position: 'relative',
  },
  dialogBackdropProps: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  dialogTitle: {
    fontSize: '18px',
    color: '#212121',
    py: '16px !important',
    px: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: 400,
  },
  formTitle: {
    fontSize: '16px',
    color: '#212121',
    pb: '16px !important',
    pt: '0px !important',
    px: '0px !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: 400,
  },
  optionTitle: {
    fontSize: '16px',
    color: '#212121',
    pb: '0px !important',
    pt: '16px !important',
    px: '0px !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: 400,
  },

  formContainer: {
    display: 'flex',
    gap: 2,
    flexDirection: { xs: 'column', sm: 'row' },
    width: '100%',
    height: '100%',
  },
  optionContainer: { marginTop: 4, width: '100%' },
  optionsContainer: {
    display: 'flex',
    gap: 2,
    flexDirection: { xs: 'column', md: 'row' },
  },
  optionsMargin: {
    marginTop: '4px',
  },
  addOptionButton: {
    marginTop: '4px',
    fontSize: { xs: '10px', md: '16x' },
    textDecoration: 'underline',
    marginLeft: 0,
  },

  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  fullHeightWidth: { width: '100%', height: '100%' },

  typeTitle: {
    fontSize: '16px',
    color: '#212121',
    py: '16px !important',
    px: '0px !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: 400,
  },
  dialogContent: {
    padding: '34px 30px',
    height: '100%',
  },
  dialogContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '441px',
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  inputContainer: {
    padding: 0,
  },

  nameInput: {
    height: '70px',
  },
  descriptionInput: {
    height: '170px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 2,
    justifySelf: 'center',
    marginTop: '28px',
    flexDirection: { xs: 'column', md: 'row' },
  },
  button: {
    textTransform: 'capitalize',
    width: '200px',
    height: '50px',
    borderRadius: '4px',
    fontWeight: 700,
    lineHeight: 'normal',
  },
  selectLabel: {
    color: '#757575 !important',
    fontSize: '14px',
    fontWeight: 400,
  },
  removeButtonContainer: {
    height: '25px',
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
  },
};

export {
  addServiceCategStyles,
  fieldStyles,
  addOnsStyles,
  staffStyles,
  taskTypeStyles,
};
