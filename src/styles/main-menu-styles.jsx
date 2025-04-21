const mainMenuStyles = {
  mainContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
    transition: 'opacity 0.3s ease-in-out',
  },
  drawerPaper: {
    width: '350px',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    overflow: 'hidden',
    paddingBottom: '200px',
    '&:hover': {
      overflow: 'auto',
    },
    zIndex: 10000,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '16px 30px',
  },
  closeIcon: {
    cursor: 'pointer',
    fontSize: '40px',
    fontWeight: '100',
  },
  logo: {
    marginLeft: '50px',
  },
  mainText: {
    color: '#757575',
    fontSize: '10px',
    fontWeight: 'bold',
    marginLeft: '30px',
    marginBottom: '-12px',
    marginTop: '30px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#212121',
    margin: '10px 30px 8px',
  },
  listItemButton: {
    padding: '4px 24px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  listItemText: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#333333',
    margin: '0px 24px 0px',
    height: '24px',
    transition: 'font-size 0.6s ease-in-out',
    // TODO: What is this supposed to do? It's not a valid attribute for this component.
    // "&:hover": {
    //   fontSize: "15px",
    //   backgroundColor: "transparent",
    // },
  },
  addonsText: {
    color: '#757575',
    fontSize: '10px',
    fontWeight: 'bold',
    marginLeft: '30px',
    marginTop: '30px',
  },
  addonsItem: {
    color: '#212121',
    fontSize: '14px',
    fontWeight: 500,
    marginLeft: '30px',
    marginTop: '5px',
  },
  categoryIconStyle: {
    marginLeft: '3px',
  },
}

export { mainMenuStyles }
