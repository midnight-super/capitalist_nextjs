import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Box, Button, Typography, Popover, useMediaQuery, FormControl } from '@mui/material'
import Grid from '@mui/material/Grid2'
import HeaderSearchInput from '@/layouts/shared-components/HeaderSearchInput'
import DropdownWithCustomStyle from '@/components/CustomFilterDropdown'
import CustomTooltip from '../componenets/customTooltip'
import { Controller, useForm } from 'react-hook-form'
import CustomFilterInput from '@/components/customFilterInput'
import CustomFilterList from '@/components/customFilterList'
import { servicesCategHeader } from '@/styles/table-styles'
import { PersonAdd, PersonAddAlt1 } from '@mui/icons-material'
import AddSubUserModal from '@/views/client/modal/addSubUserModal'
import AddClientModal from '@/views/client/modal/addClientModal'

const TableHeader = ({
  data,
  filter: _filter,
  handleAddOpen: parentHandleAddOpen,
  searchQuery,
  setSearchQuery,
  fetchClientData,
}) => {
  const {
    addCategoryContainer,
    addCategoryButton,
    headerContainer,
    tableName,
    addIconMainContainer,
    addIcon,
    addIconContainer,
    filter,
    filterText,
    searchFilterContainer,
    mobileFilterText,
    paperProps,
    filterFormContainer,
    filterbyText,
    applyFilter,
    applyFilterButton,
    xsFilter,
    xsFilterText,
    filtersContainer,
    filtersInnerContainer,
    filtersText,
    filtersCrossIcon,
    clearFilterButton,
  } = servicesCategHeader

  const [anchorEl, setAnchorEl] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget)
  const handlePopoverClose = () => setAnchorEl(null)

  const open = Boolean(anchorEl)
  const isSmall = useMediaQuery('(max-width:720px)')
  const isXs = useMediaQuery('(max-width:480px)')
  const isMedium = useMediaQuery('(max-width:920px)')

  const statusData = [
    {
      value: 'ACTIVE',
      label: 'Active',
    },
    {
      value: 'INACTIVE',
      label: 'Inactive',
    },
  ]
  const [statusValue, setStatusValue] = useState({
    value: '',
    label: '',
  })

  const [filterModes, setFilterModes] = useState({
    fullName: 'CONTAINS',
    email: 'CONTAINS',
    clientCategory: 'EQUAL',
    companyTitle: 'CONTAINS',
    status: 'EQUAL',
  })

  const [filters, setFilters] = useState({
    fullName: '',
    email: '',
    clientCategory: '',
    companyTitle: '',
    status: 'ACTIVE',
  })

  // card data
  const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    completedTasks: 0,
    inProcessing: 0,
  })

  const statsRef = useRef(null)

  // Add state for sub-user modal
  const [addSubUserOpen, setAddSubUserOpen] = useState(false)

  // Add handler for sub-user modal
  const handleAddSubUserOpen = () => setAddSubUserOpen(true)
  const handleAddSubUserClose = () => setAddSubUserOpen(false)

  // Add state for client modal
  const [addOpen, setAddOpen] = useState(false)

  // Add handlers for client modal
  const handleAddOpen = () => setAddOpen(true)
  const handleAddClose = () => setAddOpen(false)

  // Add new state for filtered data
  const [filteredData, setFilteredData] = useState(data)

  // Add this at the top of the component
  const headerRef = useRef(null)

  // Initialize without any status filter
  const [selectedStatus, setSelectedStatus] = useState('ALL')

  // Add client category options
  const clientCategoryOptions = [
    { value: 'INDIVIDUAL', label: 'Individual' },
    { value: 'COMPANY', label: 'Company' },
  ]

  // Add state for client category dropdown
  const [categoryValue, setCategoryValue] = useState({
    value: '',
    label: '',
  })

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false)
      setFilters({
        fullName: '',
        email: '',
        clientCategory: '',
        companyTitle: '',
        status: '',
      })
      setStatusValue({ value: '', label: '' })

      if (_filter) {
        _filter({})
      }
    }
  }, [isInitialLoad])

  const handleStatusChange = (status) => {
    setSelectedStatus(status)
    if (typeof _filter === 'function') {
      if (status === 'ALL') {
        // Clear the status filter
        _filter({})
      } else {
        _filter({
          status: {
            value: status,
            mode: 'EQUAL',
          },
        })
      }
    }
  }

  // Update the status options to show Inactive but send BLOCK
  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'BLOCKED', label: 'Blocked' }, // Changed label to Inactive but keep value as BLOCK
  ]

  // Update search functionality
  useEffect(() => {
    if (searchQuery) {
      const filtered = data?.filter((client) => {
        // Search in main client name (admin)
        const adminName = client.admin?.fullName?.toLowerCase() || ''
        if (adminName.includes(searchQuery.toLowerCase())) {
          return true
        }

        // Search in sub-users
        if (client.subUsers?.length > 0) {
          return client.subUsers.some((subUser) => subUser.fullName?.toLowerCase().includes(searchQuery.toLowerCase()))
        }

        return false
      })
      setFilteredData(filtered || [])
    } else {
      setFilteredData(data || [])
    }
  }, [searchQuery, data])

  // Update stats calculation to handle the new data structure
  const fetchStats = useCallback(() => {
    try {
      const totalClients = filteredData?.length || 0

      // Calculate project stats from the filtered data
      const projectStats = filteredData?.reduce(
        (acc, client) => {
          const projects = client.projects || []
          acc.totalProjects += projects.length

          // Count tasks
          projects.forEach((project) => {
            const tasks = project.tasks || []
            acc.completedTasks += tasks.filter((task) => task.status === 'COMPLETED').length
            acc.inProcessing += tasks.filter((task) => task.status === 'IN_PROGRESS').length
          })

          return acc
        },
        {
          totalProjects: 0,
          completedTasks: 0,
          inProcessing: 0,
        }
      )

      setStats({
        totalClients,
        totalProjects: projectStats?.totalProjects || 0,
        completedTasks: projectStats?.completedTasks || 0,
        inProcessing: projectStats?.inProcessing || 0,
      })
    } catch (error) {
      console.error('Error calculating stats:', error)
    }
  }, [filteredData])

  // Use useEffect with proper dependencies
  useEffect(() => {
    fetchStats()
  }, [fetchStats, filteredData])

  const handleFilterModeChange = (field, value) => {
    setFilterModes((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
  const submitData = (data) => {
    const appliedFilters = {
      fullName: { value: data.fullName, mode: filterModes.fullName },
      email: { value: data.email, mode: filterModes.email },
      clientCategory: { value: data.clientCategory, mode: filterModes.clientCategory },
      companyTitle: { value: data.companyTitle, mode: filterModes.companyTitle },
      status: { value: data.status, mode: filterModes.status },
    }
    const isValid = Object.keys(appliedFilters).some((key) => {
      return appliedFilters[key].value && appliedFilters[key].mode
    })

    if (!isValid) {
      return
    }
    _filter && _filter(appliedFilters)
    setFilters(data)
    handlePopoverClose()
  }

  const hasFilters = Object.values(filters).some((value) => value !== '')

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
  })

  const clearFilter = () => {
    setFilters({
      fullName: '',
      email: '',
      clientCategory: '',
      companyTitle: '',
      status: '',
    })
    setStatusValue({ value: '', label: '' })
    setCategoryValue({ value: '', label: '' })
    reset()
    if (_filter) {
      _filter({})
    }
  }
  const clearSpecificFilter = (filterKey) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [filterKey]: '' }

      setValue(filterKey, '')
      setFilterModes((prevModes) => ({
        ...prevModes,
        [filterKey]: 'CONTAINS',
      }))

      if (filterKey === 'status') {
        setStatusValue({ value: '', label: '' })
      }
      if (filterKey === 'clientCategory') {
        setCategoryValue({ value: '', label: '' })
      }

      const appliedFilters = {
        fullName: { value: updatedFilters.fullName, mode: filterModes.fullName },
        email: { value: updatedFilters.email, mode: filterModes.email },
        clientCategory: { value: updatedFilters.clientCategory, mode: filterModes.clientCategory },
        companyTitle: { value: updatedFilters.companyTitle, mode: filterModes.companyTitle },
        status: { value: updatedFilters.status, mode: filterModes.status },
      }

      if (_filter) {
        _filter(appliedFilters)
      }

      return updatedFilters
    })
  }
  const filterFields = [
    { title: 'Name', value: 'fullName', type: 'text' },
    { title: 'Email', value: 'email', type: 'text' },
    { title: 'Client Category', value: 'clientCategory', type: 'dropdown', options: clientCategoryOptions },
    { title: 'Company', value: 'companyTitle', type: 'text' },
    { title: 'Status', value: 'status', type: 'dropdown', options: statusOptions },
  ]

  useEffect(() => {
    const handleResize = () => {
      handlePopoverClose()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false)
      setFilters({
        fullName: '',
        email: '',
        clientCategory: '',
        companyTitle: '',
        status: '',
      })
      setStatusValue({ value: '', label: '' })

      if (_filter) {
        _filter({})
      }
    }
  }, [isInitialLoad])

  // Update the scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const pageY = window.scrollY
      const columnHeight = data?.length > 0 ? data?.length * 91 + 200 : 91
      const innerHeight = window.innerHeight

      if (!isSmall && !isMedium && !isXs && pageY > 50 && columnHeight > innerHeight) {
        setIsScrolled(true)
      } else if ((isSmall || isMedium || isXs) && pageY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      if (pageY > 0) {
        handlePopoverClose()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [data, isMedium, isSmall, isXs])

  return (
    <>
      {/* Stats Cards */}
      {/* <Box
                ref={statsRef}
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "16px",
                    flexWrap: "wrap",
                    mb: isSmall ? "46px" : "76px",
                }}
            >
                {[
                    { label: "Total Clients:", value: stats.totalClients },
                    { label: "Total Projects:", value: stats.totalProjects },
                    { label: "Completed Tasks:", value: stats.completedTasks },
                    { label: "Tasks In Processing:", value: stats.inProcessing },
                ].map((stat, index) => (
                    <Card
                        key={index}
                        sx={{
                            width: "290px",
                            height: "80px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "16px",
                            minWidth: "200px",
                            boxShadow: "none",
                            border: "1px solid #F3F3F3",
                            backgroundColor: "#FFFFFF",
                            borderRadius: "4px",
                            flexGrow: 1,
                            boxShadow: "0px 1px 2px 0px #00000026",
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{ color: "#212121", fontSize: "16px", lineHeight: "18.75px", fontWeight: 400 }}
                        >
                            {stat.label}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ color: "#4489FE", fontSize: "16px", lineHeight: "18.75px", fontWeight: 400 }}
                        >
                            {stat.value}
                        </Typography>
                    </Card>
                ))}
            </Box> */}

      {/* Non-scrolled Add Client Button */}
      {!isScrolled && (
        <Box
          data-testid="add-client-button"
          sx={{
            ...addCategoryContainer,
            mb: isSmall ? '46px' : '76px',
            display: 'flex',
            gap: 2,
          }}
        >
          <Button variant="contained" sx={addCategoryButton} onClick={handleAddOpen}>
            Add Client
          </Button>
          <Button variant="contained" sx={addCategoryButton} onClick={handleAddSubUserOpen}>
            Add Sub-user
          </Button>
        </Box>
      )}

      {/* Header Container */}
      <Box
        ref={headerRef}
        id="client-table-header"
        sx={
          isScrolled
            ? {
                position: 'fixed',
                top: 70,
                left: 0,
                right: 0,
                zIndex: 1000,
                backgroundColor: '#fff',
                padding: '16px 40px',
                ml: isScrolled ? '110px' : '0px',
              }
            : {
                backgroundColor: '#fff',
                ml: isScrolled ? '110px' : '0px',
              }
        }
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: isScrolled ? '10px' : '0px',
          }}
        >
          <Typography variant="text24Weight400" sx={tableName}>
            Client List
          </Typography>

          {!isSmall && (
            <Box sx={searchFilterContainer}>
              {isScrolled && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <CustomTooltip arrow title="Add Client" placement="top">
                    <Typography
                      onClick={handleAddOpen}
                      sx={{
                        ...addIcon,
                        '& svg': {
                          color: '#4489FE',
                          fontSize: '24px',
                        },
                      }}
                    >
                      <PersonAdd />
                    </Typography>
                  </CustomTooltip>

                  <CustomTooltip arrow title="Add Sub-user" placement="top">
                    <Typography
                      onClick={handleAddSubUserOpen}
                      sx={{
                        ...addIcon,
                        '& svg': {
                          color: '#4489FE',
                          fontSize: '24px',
                        },
                      }}
                    >
                      <PersonAddAlt1 />
                    </Typography>
                  </CustomTooltip>
                </Box>
              )}

              <HeaderSearchInput isSmall={isSmall} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

              {/* Filter and Sort buttons */}
              {!isSmall && (
                <Typography onClick={handlePopoverOpen} variant="text14Weight400" sx={mobileFilterText}>
                  Filter{' '}
                  <span style={filterText}>
                    <img src="/icons/filterIcon.svg" alt="filter" />
                  </span>
                </Typography>
              )}

              {/* {!isSmall && (
                                <Typography
                                    onClick={handlePopoverOpen}
                                    variant="text14Weight400"
                                    sx={mobileFilterText}
                                >
                                    Sort{" "}
                                    <span style={filterText}>
                                        <img src="/icons/filterIcon.svg" alt="filter" />
                                    </span>
                                </Typography>
                            )} */}
            </Box>
          )}
        </Box>
      </Box>

      {/* Spacer */}
      {isScrolled && <Box sx={{ height: '72px' }} />}

      {/* Search Input for Mobile */}
      {isSmall && (
        <Box mt={2}>
          <HeaderSearchInput isSmall={isSmall} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </Box>
      )}

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        disableScrollLock={true}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: paperProps,
        }}
      >
        <form onSubmit={handleSubmit(submitData)}>
          <Box sx={filterFormContainer}>
            <Grid container spacing={2.5}>
              {filterFields.map(({ title, value, type, options }) => (
                <Grid key={value} item xs={12} width={'100%'}>
                  <Typography variant="body1">{`Filter by ${title}`}</Typography>
                  <Typography sx={filterbyText}>
                    {type === 'text' && (
                      <FormControl fullWidth sx={{ mb: '6px' }}>
                        <Controller
                          name={value}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <CustomFilterInput
                              value={value}
                              onChange={onChange}
                              label={`Filter by ${title}`}
                              handleClear={() => clearSpecificFilter(value)}
                            />
                          )}
                        />
                      </FormControl>
                    )}

                    {type === 'dropdown' && (
                      <FormControl fullWidth sx={{ mb: '6px' }}>
                        <Controller
                          name={value}
                          control={control}
                          render={({ field: { value: fieldValue, onChange } }) => (
                            <CustomFilterList
                              value={value === 'clientCategory' ? categoryValue : statusValue}
                              setValue={(newValue) => {
                                onChange(newValue?.value || null)
                                if (value === 'clientCategory') {
                                  setCategoryValue(newValue)
                                } else if (value === 'status') {
                                  setStatusValue(newValue)
                                }
                              }}
                              option={options}
                              placeHolder={`Filter by ${title}`}
                              width={'100%'}
                            />
                          )}
                        />
                      </FormControl>
                    )}

                    <DropdownWithCustomStyle
                      field={value}
                      filterValue={(value) => handleFilterModeChange(value, value)}
                      setFilterModes={setFilterModes}
                      filterModes={filterModes}
                    />
                  </Typography>
                </Grid>
              ))}
            </Grid>

            <Box sx={applyFilter}>
              <Button type="submit" sx={applyFilterButton} variant="contained" onClick={handlePopoverClose}>
                Apply Filter
              </Button>
            </Box>
          </Box>
        </form>
      </Popover>

      {hasFilters && Object.values(filters).some((value) => value && value !== '') && (
        <Box sx={filtersContainer}>
          {Object.keys(filters).map((key) => {
            if (filters[key]) {
              let displayValue = filters[key]

              return (
                <Box key={key} sx={filtersInnerContainer}>
                  <Typography sx={filtersText}>
                    {displayValue}{' '}
                    <span onClick={() => clearSpecificFilter(key)} style={filtersCrossIcon}>
                      <img src="/icons/removeIcon.svg" alt="remove" />
                    </span>
                  </Typography>
                </Box>
              )
            }
            return null
          })}
          <Box>
            <Typography onClick={clearFilter} sx={clearFilterButton}>
              Clear Filter
            </Typography>
          </Box>
        </Box>
      )}

      {/* Add Client Modal */}
      {addOpen && <AddClientModal open={addOpen} close={handleAddClose} fetchClientData={fetchClientData} />}

      {/* Add Sub-user Modal */}
      {addSubUserOpen && (
        <AddSubUserModal
          open={addSubUserOpen}
          close={handleAddSubUserClose}
          clients={data}
          fetchClientData={fetchClientData}
        />
      )}
    </>
  )
}

export default TableHeader
