import React, { useState, useEffect } from 'react'
import { Box, Button, Typography, Popover, useMediaQuery, FormControl } from '@mui/material'
import Grid from '@mui/material/Grid2'
import HeaderSearchInput from '@/layouts/shared-components/HeaderSearchInput'
import DropdownWithCustomStyle from '@/components/CustomFilterDropdown'
import CustomTooltip from '../componenets/customTooltip'
import { Controller, useForm } from 'react-hook-form'
import CustomFilterInput from '@/components/customFilterInput'
import { servicesCategHeader } from '@/styles/table-styles'

const TableHeader = ({ data, filter: _filter, handleAddOpen, searchQuery, setSearchQuery }) => {
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

  // Handle scroll behavior
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
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [data, isMedium, isSmall, isXs])

  const [filterModes, setFilterModes] = useState({
    addonName: 'EQUAL',
    serviceDescription: 'EQUAL',
    serviceName: 'EQUAL',
    type: 'EQUAL',
    description: 'EQUAL',
  })

  const [filters, setFilters] = useState({
    addonName: '',
    serviceDescription: '',
    serviceName: '',
    type: '',
    description: '',
  })
  useEffect(() => {
    if (isInitialLoad) {
      const initialFilters = {
        ...filters,
      }
      setFilterModes({
        addonName: 'EQUAL',
        serviceDescription: 'EQUAL',
        serviceName: 'EQUAL',
        type: 'EQUAL',
        description: 'EQUAL',
      })
      _filter &&
        _filter({
          addonName: { value: initialFilters.addonName, mode: filterModes.addonName },
          serviceDescription: { value: initialFilters.serviceDescription, mode: filterModes.serviceDescription },
          serviceName: { value: initialFilters.serviceName, mode: filterModes.serviceName },
          type: { value: initialFilters.type, mode: filterModes.type },
          description: { value: initialFilters.description, mode: filterModes.description },
        })
      setIsInitialLoad(false)
    }
  }, [isInitialLoad, _filter, filters, filterModes])

  const handleFilterModeChange = (field, value) => {
    setFilterModes((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
  const submitData = (data) => {
    const appliedFilters = {
      addonName: { value: data.addonName, mode: filterModes.addonName },
      serviceDescription: { value: data.serviceDescription, mode: filterModes.serviceDescription },
      serviceName: { value: data.serviceName, mode: filterModes.serviceName },
      type: { value: data.type, mode: filterModes.type },
      description: { value: data.description, mode: filterModes.description },
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

  useEffect(() => {
    const handleResize = () => {
      handlePopoverClose()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const hasFilters = Object.values(filters).some((value) => value !== '')

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })

  const clearFilter = () => {
    setValue('addonName', '')
    setValue('serviceDescription', '')
    setValue('serviceName', '')
    setValue('type', '')
    setValue('description', '')
    setFilters({
      addonName: '',
      serviceDescription: '',
      serviceName: '',
      type: '',
      description: '',
    })
    setFilterModes({
      addonName: 'EQUAL',
      serviceDescription: 'EQUAL',
      serviceName: 'EQUAL',
      type: 'EQUAL',
      description: 'EQUAL',
    })

    _filter && _filter(null)
  }
  const clearSpecificFilter = (filterKey) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [filterKey]: '' }

      setValue(filterKey, '')
      setFilterModes((prevModes) => ({
        ...prevModes,
        [filterKey]: 'EQUAL',
      }))
      const appliedFilters = {
        addonName: { value: updatedFilters.addonName, mode: filterModes.addonName },
        serviceDescription: { value: updatedFilters.serviceDescription, mode: filterModes.serviceDescription },
        serviceName: { value: updatedFilters.serviceName, mode: filterModes.serviceName },
        type: { value: updatedFilters.type, mode: filterModes.type },
        description: { value: updatedFilters.description, mode: filterModes.description },
      }
      if (_filter) {
        _filter(appliedFilters)
      }

      return updatedFilters
    })
  }
  const filterFields = [
    { title: 'Name', value: 'addonName' },
    { title: 'Service Description', value: 'serviceDescription' },
    { title: 'Service', value: 'serviceName' },
    { title: 'Type', value: 'type' },
    { title: 'Description', value: 'description' },
  ]

  return (
    <>
      {!isScrolled && (
        <Box
          sx={{
            ...addCategoryContainer,
            mb: isSmall ? '46px' : '76px',
          }}
        >
          <Button variant="contained" sx={addCategoryButton} onClick={handleAddOpen}>
            Add Addons
          </Button>
        </Box>
      )}

      <Box
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
            ...headerContainer,
            mb: isScrolled ? '10px' : '0px',
          }}
        >
          <Typography variant="h1" sx={tableName}>
            Add-ons
          </Typography>
          {
            <Typography variant="buttonLabel" sx={addIconMainContainer}>
              {!isXs && isSmall && isScrolled && (
                <Box sx={addIconContainer}>
                  <CustomTooltip arrow title="Add service category" placement="top">
                    <Typography onClick={handleAddOpen} sx={addIcon}>
                      <img src="/icons/addBlue.svg" alt="download" />
                    </Typography>
                  </CustomTooltip>
                </Box>
              )}
              {(isXs && isScrolled) ||
                (isSmall && (
                  <Typography onClick={handlePopoverOpen} sx={filter}>
                    <span style={{ ...filterText, color: '#757575' }}> Filter </span>
                    <span style={filterText}>
                      <img src="/icons/filterIcon.svg" alt="filter" />
                    </span>
                  </Typography>
                ))}
            </Typography>
          }
          {!isSmall && (
            <Box sx={searchFilterContainer}>
              {isScrolled && (
                <Box sx={searchFilterContainer}>
                  <CustomTooltip arrow title="Add service category" placement="top">
                    <Typography onClick={handleAddOpen} sx={addIcon}>
                      <img src="/icons/addBlue.svg" alt="download" />
                    </Typography>
                  </CustomTooltip>
                </Box>
              )}
              {!isSmall && (
                <HeaderSearchInput isSmall={isSmall} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              )}

              {!isSmall && (
                <Typography onClick={handlePopoverOpen} variant="buttonLabel" sx={mobileFilterText}>
                  Filter{' '}
                  <span style={filterText}>
                    <img src="/icons/filterIcon.svg" alt="filter" />
                  </span>
                </Typography>
              )}
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
                  {filterFields.map(({ title, value }) => (
                    <Grid key={value} item xs={12} width={'100%'}>
                      <Typography variant="body1">{`Filter by ${title}`}</Typography>
                      <Typography sx={filterbyText}>
                        {value !== 'status' && (
                          <FormControl fullWidth sx={{ mb: '6px' }}>
                            <Controller
                              name={value}
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <CustomFilterInput
                                  value={value}
                                  onChange={onChange}
                                  label={`Filter by ${title}`}
                                  handleClear={() => clearSpecificFilter(value)} // Clear when the input is cleared
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
        </Box>
        {isXs && isScrolled && (
          <Box sx={{ ...searchFilterContainer, justifyContent: 'space-between' }}>
            {isScrolled && (
              <Box sx={searchFilterContainer}>
                <CustomTooltip arrow title="Add service category" placement="top">
                  <Typography onClick={handleAddOpen} sx={addIcon}>
                    <img src="/icons/addBlue.svg" alt="download" />
                  </Typography>
                </CustomTooltip>
              </Box>
            )}
            <Typography variant="buttonLabel" sx={xsFilter}>
              <Typography onClick={handlePopoverOpen} sx={xsFilterText}>
                <span style={{ ...filterText, color: '#757575' }}> Filter </span>
                <span style={filterText}>
                  <img src="/icons/filterIcon.svg" alt="filter" />
                </span>
              </Typography>
            </Typography>
          </Box>
        )}
        {isSmall && isScrolled && (
          <Box mt={'12px'}>
            <HeaderSearchInput isSmall={isSmall} />
          </Box>
        )}
      </Box>
      {isSmall && <HeaderSearchInput isSmall={isSmall} />}

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
    </>
  )
}

export default TableHeader
