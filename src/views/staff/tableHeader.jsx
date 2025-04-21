import React, { useState, useEffect } from 'react'
import { Box, Button, Typography, Popover, useMediaQuery, FormControl } from '@mui/material'
import Grid from '@mui/material/Grid2'
import HeaderSearchInput from '@/layouts/shared-components/HeaderSearchInput'
import DropdownWithCustomStyle from '@/components/CustomFilterDropdown'
import CustomTooltip from '../componenets/customTooltip'
import { Controller, useForm } from 'react-hook-form'
import CustomFilterInput from '@/components/customFilterInput'
import CustomFilterList from '@/components/customFilterList'

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

  const statusData = [
    {
      value: 'ACTIVE',
      label: 'Active',
    },
    {
      value: 'DEACTIVE',
      label: 'DeActive',
    },
  ]
  const [statusValue, setStatusValue] = useState({
    value: '',
    label: '',
  })

  const [filterModes, setFilterModes] = useState({
    fullName: 'EQUAL',
    email: 'EQUAL',
    designation: 'EQUAL',
    contactNumber: 'EQUAL',
    status: 'EQUAL',
  })

  const [filters, setFilters] = useState({
    fullName: '',
    email: '',
    designation: '',
    contactNumber: '',
    status: '',
  })

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
      designation: { value: data.designation, mode: filterModes.designation },
      contactNumber: { value: data.contactNumber, mode: filterModes.contactNumber },
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
  } = useForm({
    mode: 'onChange',
  })

  const clearFilter = () => {
    setValue('fullName', '')
    setValue('email', '')
    setValue('designation', '')
    setValue('contactNumber', '')
    setValue('status', '')
    setFilters({
      fullName: '',
      email: '',
      designation: '',
      contactNumber: '',
      status: '',
    })
    setFilterModes({
      fullName: 'EQUAL',
      email: 'EQUAL',
      designation: 'EQUAL',
      contactNumber: 'EQUAL',
      status: 'EQUAL',
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
      filterKey === 'status' && setStatusValue({ value: '', label: '' })

      const appliedFilters = {
        fullName: { value: updatedFilters.fullName, mode: filterModes.fullName },
        email: { value: updatedFilters.email, mode: filterModes.email },
        designation: { value: updatedFilters.designation, mode: filterModes.designation },
        contactNumber: { value: updatedFilters.contactNumber, mode: filterModes.contactNumber },
        status: { value: updatedFilters.status, mode: filterModes.status },
      }
      if (_filter) {
        _filter(appliedFilters)
      }

      return updatedFilters
    })
  }
  const filterFields = [
    { title: 'Name', value: 'fullName' },
    { title: 'Email', value: 'email' },
    { title: 'Designation', value: 'designation' },
    { title: 'contactNumber', value: 'contactNumber' },
    { title: 'Status', value: 'status' },
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
      const initialFilters = {
        ...filters,
        status: 'ACTIVE',
      }
      setFilterModes({
        fullName: 'EQUAL',
        email: 'EQUAL',
        designation: 'EQUAL',
        contactNumber: 'EQUAL',
        status: 'EQUAL',
      })
      _filter &&
        _filter({
          fullName: { value: initialFilters.fullName, mode: filterModes.fullName },
          email: { value: initialFilters.email, mode: filterModes.email },
          designation: { value: initialFilters.designation, mode: filterModes.designation },
          contactNumber: { value: initialFilters.contactNumber, mode: filterModes.contactNumber },
          status: { value: initialFilters.status, mode: 'EQUAL' },
        })
      setIsInitialLoad(false)
    }
  }, [isInitialLoad, _filter, filters, filterModes])

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
            Add Staff
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
            Staff List
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

                        {value === 'status' && (
                          <FormControl fullWidth sx={{ mb: '6px' }}>
                            <Controller
                              name={value}
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <CustomFilterList
                                  value={statusValue}
                                  setValue={(newValue) => {
                                    onChange(newValue?.value || null)
                                    setStatusValue(newValue)
                                  }}
                                  option={statusData}
                                  placeHolder={'Filter by Status'}
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
