const tableWrapperStyles = {
  mainContainer: {
    marginBottom: "12px"
  },
};

const servicesCategHeader = {
  addCategoryContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
  },

  addCategoryButton: {
    width: "217px",
    height: "50px",
    fontSize: "14px",
    fontWeight: 500,
    textTransform: "capitalize"
  },

  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableName: {
    fontSize: "24px", mb: { xs: '12px' }
  },
  addIconMainContainer: {
    color: "#757575",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: "12px",
  },
  addIconContainer: {
    ml: '12px', display: "flex", alignItems: "center"
  },
  addIcon: {
    cursor: "pointer",
    background: "#D8E6FF",
    padding: "12px",
    borderRadius: "4px",
    height: "44px",
    width: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mr: 1,
  },
  filter: {
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterText: {
    marginLeft: '12px',
  },
  searchFilterContainer: {
    display: "flex", alignItems: "center"
  },
  mobileFilterText: {
    color: "#757575",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: "12px",
  },
  paperProps: {
    mt: '16px',
    boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.15)',
    borderRadius: '4px',
    width: '292px',
    height: '300px'
  },
  filterFormContainer: {
    width: '300px', padding: 4
  },
  filterbyText: {
    textAlign: 'right',
    color: '#898989',
    fontSize: '12px',
    fontWeight: 400,
  },
  applyFilter: {
    display: 'flex', justifyContent: 'center', mt: '12px'
  },
  applyFilterButton: {
    width: '200px',
    textTransform: 'capitalize',
    height: '50px',
    fontWeight: 500,
    fontSize: "14px",
    borderRadius: "4px",
  },
  xsFilter: {
    display: "flex",
    alignItems: "center",
    marginLeft: "12px",
  },
  xsFilterText: {
    cursor: "pointer",
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
  },

  // to be addded
  filtersContainer: {
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
    my: '16px',
    gap: '8px',
    flexWrap: 'wrap'
  },
  filtersInnerContainer: {
    background: '#E9F0FD', padding: '6px 12px', borderRadius: '3px'
  },
  filtersText: {
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    color: '#4489FE',
    lineHeight: 'normal',
    fontSize: '12px',
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  filtersCrossIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '7px'
  },
  clearFilterButton: {
    ml: '8px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    color: '#4489FE',
    lineHeight: 'normal',
    fontSize: '14px',
    fontWeight: 400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid #4489FE'
  }
}

const tableColumnStyles = {
  actionIcon: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: "center",
    height: "24px",
    width: "24px",
  },
  menuContainer: {
    zIndex: 1,
    mt: '10px',
    '& .MuiPaper-root': {
      width: '207px',
      fontSize: '15px',
      color: '#212121',
      boxShadow: ' 0px 0px 4px 0px rgba(0, 0, 0, 0.15)',
    },
  },
  menuItemText: {
    fontSize: '15px', fontWeight: 400, color: '#212121'
  },
  namecolumn: {
    display: 'flex', alignItems: 'center'
  },
  profileBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
  createdByColumn: {
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
  dateColumn: {
    color: '#757575',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
  timeColor: {
    color: '#757575'
  },
  statusText: {
    fontSize: '14px',
    fontWeight: 400,
    ml: '12px',
  },
  activeStatus: {
    fontSize: '14px',
    fontWeight: 400,
    ml: '12px',
    color: '#0FAA58'
  },
  deActiveStatus: {
    fontSize: '14px',
    fontWeight: 400,
    ml: '12px',
    color: '#FF8477'
  },
  activestatusDot: {
    width: 8,
    height: 8,
    backgroundColor: '#0FAA58',
    borderRadius: '50%',
    display: 'inline-block',
  },
  deActivestatusDot: {
    width: 8,
    height: 8,
    backgroundColor: '#FF8477',
    borderRadius: '50%',
    display: 'inline-block',
  },
  taskItem: {
    color: "#1976d2",
    fontSize: "14px",
    textDecoration: "underline",
  },
  moreTasksLink: {
    color: "#1976d2",
    fontSize: "14px",
  },
  staffAvatar: {
    width: 40, height: 40, marginRight: 1.5
  }
};


export { tableWrapperStyles, servicesCategHeader, tableColumnStyles };
