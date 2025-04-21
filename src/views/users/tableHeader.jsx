import React, { useState, useEffect } from 'react'
import { Box, Button, Menu, MenuItem, Checkbox, Typography, Popover, useMediaQuery, FormControl } from '@mui/material'
import Grid from '@mui/material/Grid2'
import HeaderSearchInput from '@/layouts/shared-components/HeaderSearchInput'
import DropdownWithCustomStyle from '@/components/CustomFilterDropdown'
import CustomTooltip from '../componenets/customTooltip'
import { Controller, useForm } from 'react-hook-form'
import CustomFilterInput from '@/components/customFilterInput'
import AutoCompleteMenu from '@/components/customDropdown'
import CustomFilterList from '@/components/customFilterList'

const TableHeader = ({ globalSearchedTxt, setIsSearch, handleAddOpen, userFilter, data }) => {
  const [selectedItems, setSelectedItems] = useState({
    machineTranscript: false,
    editedTranscript: false,
  })
  const [anchorEl, setAnchorEl] = useState(null)
  const [anchorEl2, setAnchorEl2] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchedTxt, setSearchedTxt] = useState('')
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const statusData = [
    {
      value: 'ACTIVE',
      label: 'Active',
    },
    {
      value: 'INACTIVE',
      label: 'InActive',
    },
  ]
  const [statusValue, setStatusValue] = useState({
    value: 'ACTIVE',
    label: 'Active',
  })

  const defaultProps = {
    options: statusData || [],
    getOptionLabel: (statusData) => String(statusData.label),
  }

  const handleClick2 = (event) => setAnchorEl2(event.currentTarget)
  const handleClose2 = () => setAnchorEl2(null)

  const handleToggle = (item) => {
    setSelectedItems((prevState) => ({
      ...prevState,
      [item]: !prevState[item],
    }))
  }

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget)
  const handlePopoverClose = () => setAnchorEl(null)

  const open = Boolean(anchorEl)
  const open2 = Boolean(anchorEl2)
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

      if (pageY > 0) {
        handleClose2()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [data, isMedium, isSmall, isXs])

  useEffect(() => {
    if (searchedTxt === '' && globalSearchedTxt === '' && userFilter) {
      const initialFilters = {
        status: { value: 'ACTIVE', mode: 'EQUAL' },
      }
      userFilter(initialFilters)
    }
  }, [])

  const [filterModes, setFilterModes] = useState({
    nameTitle: 'CONTAINS',
    email: 'CONTAINS',
    status: 'EQUAL',
  })

  const [filters, setFilters] = useState({
    nameTitle: '',
    email: '',
    status: 'ACTIVE',
  })
  useEffect(() => {
    if (isInitialLoad) {
      setIsSearch(false)
      // On initial load, apply the default status filter with mode 'EQUAL'
      const initialFilters = {
        ...filters,
        status: 'ACTIVE',
      }
      setValue('status', 'ACTIVE')
      setFilterModes({
        nameTitle: 'CONTAINS',
        email: 'CONTAINS',
        status: 'CONTAINS',
      })
      userFilter &&
        userFilter({
          nameTitle: {
            value: initialFilters.nameTitle,
            mode: filterModes.nameTitle,
          },
          email: { value: initialFilters.email, mode: filterModes.email },
          status: { value: initialFilters.status, mode: 'EQUAL' },
        })
      setIsInitialLoad(false)
    }
  }, [isInitialLoad, userFilter, filters, filterModes])

  // Search useEffect
  useEffect(() => {
    if (searchedTxt?.length > 0 && userFilter) {
      const searhingPayload = {
        nameTitle: {
          value: searchedTxt,
          mode: 'CONTAINS',
        },
        email: {
          value: searchedTxt,
          mode: 'CONTAINS',
        },
        status: {
          value: filters.status,
          mode: 'EQUAL',
        },
      }
      setIsSearch(true)
      userFilter(searhingPayload)
    } else {
      const appliedDefaultFilter = {
        status: {
          value: filters.status,
          mode: 'EQUAL',
        },
      }
      userFilter && userFilter(appliedDefaultFilter)
    }
  }, [searchedTxt])

  //Global Search useEffect
  useEffect(() => {
    if (globalSearchedTxt?.length > 0 && userFilter) {
      const gSearhingPayload = {
        eventName: {
          value: globalSearchedTxt,
          mode: 'CONTAINS',
        },
        createdBy: {
          value: globalSearchedTxt,
          mode: 'CONTAINS',
        },
      }
      setIsSearch(true)
      userFilter(gSearhingPayload)
    }
  }, [globalSearchedTxt])

  const handleFilterModeChange = (field, value) => {
    setFilterModes((prev) => ({
      ...prev,
      [field]: value, // Update mode for the respective field
    }))
  }
  const submitData = (data) => {
    // Validation: Check if value and mode are required
    const appliedFilters = {
      nameTitle: { value: data.nameTitle, mode: filterModes.nameTitle },
      email: { value: data.email, mode: filterModes.email },
      status: { value: data.status, mode: filterModes.status },
    }
    const isValid = Object.keys(appliedFilters).some((key) => {
      return appliedFilters[key].value && appliedFilters[key].mode
    })

    if (!isValid) {
      return
    }
    setIsSearch(false)
    userFilter && userFilter(appliedFilters)
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
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })

  const clearFilter = () => {
    setValue('nameTitle', '')
    setValue('email', '')
    setValue('status', '')
    setStatusValue({ value: '', label: '' })
    setFilters({
      nameTitle: '',
      email: '',
      status: '',
    })
    setFilterModes({
      nameTitle: 'CONTAINS',
      email: 'CONTAINS',
      status: 'CONTAINS',
    })

    userFilter && userFilter(null)
  }
  const clearSpecificFilter = (filterKey) => {
    // Clear the specific filter field
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [filterKey]: '' }
      setValue(filterKey, '')
      setFilterModes((prevModes) => ({
        ...prevModes,
        [filterKey]: 'CONTAINS',
      }))
      filterKey === 'status' && setStatusValue({ value: '', label: '' })
      // Create the appliedFilters object based on updated filters
      const appliedFilters = {
        nameTitle: {
          value: updatedFilters.nameTitle,
          mode: filterModes.nameTitle,
        },
        email: { value: updatedFilters.email, mode: filterModes.email },
        status: { value: updatedFilters.status, mode: filterModes.status },
      }
      // Notify the parent with the updated appliedFilters
      if (userFilter) {
        setIsSearch(false)
        userFilter(appliedFilters)
      }

      return updatedFilters
    })
  }
  const filterFields = [
    { title: 'Name', value: 'nameTitle' },
    { title: 'Email', value: 'email' },
    { title: 'Status', value: 'status' },
  ]

  return (
    <>
      {/* Hide this box on scroll */}
      {!isScrolled && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
            mb: isSmall ? '46px' : '76px',
          }}
        >
          <Button
            variant="contained"
            sx={{
              width: '217px',
              height: '50px',
              fontSize: '14px',
              fontWeight: 500,
              textTransform: 'capitalize',
            }}
            onClick={handleAddOpen}
          >
            Create User
          </Button>
        </Box>
      )}

      {/* Sticky Header */}
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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: isScrolled ? '10px' : '0px',
          }}
        >
          <Typography variant="h1" sx={{ fontSize: '24px', mb: { xs: '12px' } }}>
            Users List
          </Typography>
          {
            <Typography
              variant="buttonLabel"
              sx={{
                color: '#757575',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginLeft: '12px',
              }}
            >
              {!isXs && isSmall && isScrolled && (
                <Box sx={{ ml: '12px', display: 'flex', alignItems: 'center' }}>
                  <CustomTooltip arrow title="Create Event" placement="top">
                    <Typography
                      onClick={handleAddOpen}
                      sx={{
                        cursor: 'pointer',
                        background: '#D8E6FF',
                        padding: '12px',
                        borderRadius: '4px',
                        height: '44px',
                        width: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1,
                      }}
                    >
                      <img src="/icons/addBlue.svg" alt="download" />
                    </Typography>
                  </CustomTooltip>
                </Box>
              )}
              {(isXs && isScrolled) ||
                (isSmall && (
                  <Typography
                    onClick={handlePopoverOpen}
                    sx={{
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ marginLeft: '12px', color: '#757575' }}> Filter </span>
                    <span style={{ marginLeft: '12px' }}>
                      <img src="/icons/filterIcon.svg" alt="filter" />
                    </span>
                  </Typography>
                ))}
            </Typography>
          }
          {!isSmall && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isScrolled && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomTooltip arrow title="Create User" placement="top">
                    <Typography
                      onClick={handleAddOpen}
                      sx={{
                        cursor: 'pointer',
                        background: '#D8E6FF',
                        padding: '12px',
                        borderRadius: '4px',
                        height: '44px',
                        width: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1,
                      }}
                    >
                      <img src="/icons/addBlue.svg" alt="download" />
                    </Typography>
                  </CustomTooltip>
                </Box>
              )}
              {!isSmall && <HeaderSearchInput isSmall={isSmall} setSearchedTxt={setSearchedTxt} />}

              {!isSmall && (
                <Typography
                  onClick={handlePopoverOpen}
                  variant="buttonLabel"
                  sx={{
                    color: '#757575',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginLeft: '12px',
                  }}
                >
                  Filter{' '}
                  <span style={{ marginLeft: '12px' }}>
                    <img src="/icons/filterIcon.svg" alt="filter" />
                  </span>
                </Typography>
              )}

              <Menu
                anchorEl={anchorEl2}
                open={open2}
                onClose={handleClose2}
                disableScrollLock={true}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: isSmall ? 'right' : 'left',
                }}
                PaperProps={{
                  sx: {
                    zIndex: 1,
                    boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.15)',
                    borderRadius: '4px',
                    marginLeft: isSmall ? 0 : '-43px',
                    marginTop: '6px',
                  },
                }}
              >
                <MenuItem onClick={() => handleToggle('machineTranscript')}>
                  <Checkbox checked={selectedItems.machineTranscript} edge="start" />
                  <Typography variant="body1" sx={{ color: '212121', fontSize: '15px' }}>
                    {'Machine Transcript'}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => handleToggle('editedTranscript')}>
                  <Checkbox checked={selectedItems.editedTranscript} edge="start" />
                  <Typography variant="body1" sx={{ color: '212121', fontSize: '15px' }}>
                    {'Edited Transcript'}
                  </Typography>
                </MenuItem>
              </Menu>
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
              sx: {
                mt: '16px',
                boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.15)',
                borderRadius: '4px',
                width: '292px',
                height: '395px',
              },
            }}
          >
            <form onSubmit={handleSubmit(submitData)}>
              <Box sx={{ width: '300px', padding: 4 }}>
                <Grid container spacing={2.5}>
                  {filterFields.map(({ title, value }) => (
                    <Grid key={value} item xs={12} sx={{ width: '100%' }}>
                      <Typography variant="body1">{`Filter by ${title}`}</Typography>
                      <Typography
                        sx={{
                          textAlign: 'right',
                          color: '#898989',
                          fontSize: '12px',
                          fontWeight: 400,
                        }}
                      >
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

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: '12px' }}>
                  <Button
                    type="submit"
                    sx={{
                      width: '200px',
                      textTransform: 'capitalize',
                      height: '50px',
                      fontWeight: 500,
                      fontSize: '14px',
                      borderRadius: '4px',
                    }}
                    variant="contained"
                  >
                    Apply Filter
                  </Button>
                </Box>
              </Box>
            </form>
          </Popover>
        </Box>
        {isXs && isScrolled && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {isScrolled && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CustomTooltip arrow title="Create Event" placement="top">
                  <Typography
                    onClick={handleAddOpen}
                    sx={{
                      cursor: 'pointer',
                      background: '#D8E6FF',
                      padding: '12px',
                      borderRadius: '4px',
                      height: '44px',
                      width: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 1,
                    }}
                  >
                    <img src="/icons/addBlue.svg" alt="download" />
                  </Typography>
                </CustomTooltip>
              </Box>
            )}
            <Typography
              variant="buttonLabel"
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: '12px',
              }}
            >
              <Typography
                onClick={handlePopoverOpen}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'end',
                  alignItems: 'center',
                }}
              >
                <span style={{ marginLeft: '12px', color: '#757575' }}> Filter </span>
                <span style={{ marginLeft: '12px' }}>
                  <img src="/icons/filterIcon.svg" alt="filter" />
                </span>
              </Typography>
            </Typography>
          </Box>
        )}
        {isSmall && isScrolled && (
          <Box sx={{ mt: '12px' }}>
            <HeaderSearchInput isSmall={isSmall} setSearchedTxt={setSearchedTxt} />
          </Box>
        )}
      </Box>
      {isSmall && <HeaderSearchInput isSmall={isSmall} setSearchedTxt={setSearchedTxt} />}

      {hasFilters && Object.values(filters).some((value) => value && value !== '') && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            my: '16px',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {Object.keys(filters).map((key) => {
            if (filters[key]) {
              let displayValue = filters[key]

              // Check if the key is 'status' and get the corresponding label
              if (key === 'status') {
                const status = statusData.find((item) => item.value === filters[key])
                displayValue = status ? status.label : filters[key] // Use label or fallback to value
              }

              return (
                <Box
                  key={key}
                  sx={{
                    background: '#E9F0FD',
                    padding: '6px 12px',
                    borderRadius: '3px',
                  }}
                >
                  <Typography
                    sx={{
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      color: '#4489FE',
                      lineHeight: 'normal',
                      fontSize: '12px',
                      fontWeight: 400,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {displayValue}{' '}
                    <span
                      onClick={() => clearSpecificFilter(key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: '7px',
                      }}
                    >
                      <img src="/icons/removeIcon.svg" alt="remove" />
                    </span>
                  </Typography>
                </Box>
              )
            }
            return null
          })}
          <Box>
            <Typography
              onClick={clearFilter}
              sx={{
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
                borderBottom: '1px solid #4489FE',
              }}
            >
              Clear Filter
            </Typography>
          </Box>
        </Box>
      )}
    </>
  )
}

export default TableHeader
