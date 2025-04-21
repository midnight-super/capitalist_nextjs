import React, { useState, useEffect } from 'react'
import { Box, Button, Typography, Popover, useMediaQuery, FormControl } from '@mui/material'
import Grid from '@mui/material/Grid2'
import HeaderSearchInput from '@/layouts/shared-components/HeaderSearchInput'
import DropdownWithCustomStyle from '@/components/CustomFilterDropdown'
import CustomTooltip from '../componenets/customTooltip'
import { Controller, useForm } from 'react-hook-form'
import CustomFilterInput from '@/components/customFilterInput'
import { servicesCategHeader } from '@/styles/table-styles'

const TableHeader = ({ handleAddOpen, serviceFilter, data, searchQuery, setSearchQuery }) => {
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

  const open = Boolean(anchorEl)
  const isSmall = useMediaQuery('(max-width:720px)')
  const isXs = useMediaQuery('(max-width:480px)')
  const isMedium = useMediaQuery('(max-width:920px)')

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget)
  const handlePopoverClose = () => setAnchorEl(null)

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
    serviceName: 'EQUAL',
    serviceCategoryName: 'EQUAL',
    createdAt: 'EQUAL',
    updatedAt: 'EQUAL',
    status: 'EQUAL',
  })

  const [filters, setFilters] = useState({
    serviceName: '',
    serviceCategoryName: '',
    createdAt: '',
    updatedAt: '',
    status: '',
  })
  useEffect(() => {
    if (isInitialLoad) {
      const initialFilters = {
        ...filters,
      }
      setFilterModes({
        serviceName: 'EQUAL',
        serviceCategoryName: 'EQUAL',
        createdAt: 'EQUAL',
        updatedAt: 'EQUAL',
        status: 'EQUAL',
      })
      serviceFilter &&
        serviceFilter({
          serviceName: { value: initialFilters.serviceName, mode: filterModes.serviceName },
          serviceCategoryName: { value: initialFilters.serviceCategoryName, mode: filterModes.serviceCategoryName },
          createdAt: { value: initialFilters.createdAt, mode: filterModes.createdAt },
          updatedAt: { value: initialFilters.updatedAt, mode: filterModes.updatedAt },
          status: { value: initialFilters.status, mode: filterModes.status },
        })
      setIsInitialLoad(false)
    }
  }, [isInitialLoad, serviceFilter, filters, filterModes])

  const handleFilterModeChange = (field, value) => {
    setFilterModes((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
  const submitData = (data) => {
    const appliedFilters = {
      serviceName: { value: data.serviceName, mode: filterModes.serviceName },
      serviceCategoryName: { value: data.serviceCategoryName, mode: filterModes.serviceCategoryName },
      createdAt: { value: data.createdAt, mode: filterModes.createdAt },
      updatedAt: { value: data.updatedAt, mode: filterModes.updatedAt },
      status: { value: data.status, mode: filterModes.status },
    }
    const isValid = Object.keys(appliedFilters).some((key) => {
      return appliedFilters[key].value && appliedFilters[key].mode
    })

    if (!isValid) {
      return
    }
    serviceFilter && serviceFilter(appliedFilters)
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
    setValue('serviceName', '')
    setValue('serviceCategoryName', '')
    setValue('createdAt', '')
    setValue('updatedAt', '')
    setValue('status', '')
    setFilters({
      serviceName: '',
      serviceCategoryName: '',
      createdAt: '',
      updatedAt: '',
      status: '',
    })
    setFilterModes({
      serviceName: 'EQUAL',
      serviceCategoryName: 'EQUAL',
      createdAt: 'EQUAL',
      updatedAt: 'EQUAL',
      status: 'EQUAL',
    })

    serviceFilter && serviceFilter(null)
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
        serviceName: { value: updatedFilters.serviceName, mode: filterModes.serviceName },
        serviceCategoryName: { value: updatedFilters.serviceCategoryName, mode: filterModes.serviceCategoryName },
        createdAt: { value: updatedFilters.createdAt, mode: filterModes.createdAt },
        updatedAt: { value: updatedFilters.updatedAt, mode: filterModes.updatedAt },
        status: { value: updatedFilters.status, mode: filterModes.status },
      }
      if (serviceFilter) {
        serviceFilter(appliedFilters)
      }

      return updatedFilters
    })
  }

  const filterFields = [
    { title: 'Name', value: 'serviceName' },
    { title: 'Service Category', value: 'serviceCategoryName' },
    { title: 'Date Created', value: 'createdAt' },
    { title: 'Last Modified', value: 'updatedAt' },
    { title: 'Status', value: 'status' },
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
            Add Service
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
            Services
          </Typography>
          {
            <Typography variant="buttonLabel" sx={addIconMainContainer}>
              {!isXs && isSmall && isScrolled && (
                <Box sx={addIconContainer}>
                  <CustomTooltip arrow title="Add service" placement="top">
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
                  <CustomTooltip arrow title="Add service" placement="top">
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
                  {filterFields.map(({ title, value: fieldKey }) => (
                    <Grid key={fieldKey} item xs={12} width={'100%'}>
                      <Typography variant="body1">{`Filter by ${title}`}</Typography>
                      <Typography sx={filterbyText}>
                        <FormControl fullWidth sx={{ mb: '6px' }}>
                          <Controller
                            name={fieldKey}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <CustomFilterInput
                                type={fieldKey === 'createdAt' || fieldKey === 'updatedAt' ? 'datetime-local' : 'text'}
                                value={value}
                                onChange={onChange}
                                label={`Filter by ${title}`}
                                handleClear={() => clearSpecificFilter(fieldKey)}
                              />
                            )}
                          />
                        </FormControl>

                        <DropdownWithCustomStyle
                          field={fieldKey}
                          filterValue={(val) => handleFilterModeChange(fieldKey, val)}
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
                <CustomTooltip arrow title="Add service" placement="top">
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
