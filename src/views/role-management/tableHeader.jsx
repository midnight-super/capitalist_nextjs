import React, { useState, useEffect } from 'react'
import { Box, Button, Typography, useMediaQuery, Popover, FormControl, Grid } from '@mui/material'
import { servicesCategHeader } from '@/styles/table-styles'
import HeaderSearchInput from '@/layouts/shared-components/HeaderSearchInput'
import CustomTooltip from '../componenets/customTooltip'
import { PersonAdd } from '@mui/icons-material'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import CustomFilterInput from '@/components/customFilterInput'
import CustomFilterList from '@/components/customFilterList'
import DropdownWithCustomStyle from '@/components/CustomFilterDropdown'

const TableHeader = ({ data, filter: _filter, searchQuery, setSearchQuery }) => {
  const {
    addCategoryContainer,
    addCategoryButton,
    tableName,
    searchFilterContainer,
    addIcon,
    addIconMainContainer,
    filter,
    filterText,
    mobileFilterText,
    paperProps,
    filterFormContainer,
    filterbyText,
    applyFilter,
    applyFilterButton,
    filtersContainer,
    filtersInnerContainer,
    filtersText,
    filtersCrossIcon,
    clearFilterButton,
  } = servicesCategHeader

  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const isSmall = useMediaQuery('(max-width:720px)')
  const isXs = useMediaQuery('(max-width:480px)')

  // Filter states
  const [filterModes, setFilterModes] = useState({
    roleName: 'EQUAL',
    description: 'EQUAL',
    status: 'EQUAL',
  })

  const [filters, setFilters] = useState({
    roleName: '',
    description: '',
    status: '',
  })

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'DELETED', label: 'Deleted' },
  ]

  const [statusValue, setStatusValue] = useState(null)

  const handleAddOpen = () => {
    router.push('/user-management/role-management/permission')
  }

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget)
  const handlePopoverClose = () => setAnchorEl(null)
  const open = Boolean(anchorEl)

  const { control, handleSubmit, setValue, reset } = useForm({
    mode: 'onChange',
  })

  const handleFilterModeChange = (field, value) => {
    setFilterModes((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const submitData = (data) => {
    const appliedFilters = {
      roleName: { value: data.roleName, mode: filterModes.roleName },
      description: { value: data.description, mode: filterModes.description },
      status: { value: data.status, mode: 'EQUAL' },
    }

    const validFilters = Object.entries(appliedFilters)
      .filter(([_, filter]) => filter.value)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

    if (Object.keys(validFilters).length > 0) {
      _filter && _filter(validFilters)
      setFilters(data)
    }
    handlePopoverClose()
  }

  const clearFilter = () => {
    setFilters({
      roleName: '',
      description: '',
      status: '',
    })
    setStatusValue(null)
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
        [filterKey]: 'EQUAL',
      }))

      if (filterKey === 'status') {
        setStatusValue(null)
      }

      const appliedFilters = {
        roleName: { value: updatedFilters.roleName, mode: filterModes.roleName },
        description: { value: updatedFilters.description, mode: filterModes.description },
        status: { value: updatedFilters.status, mode: filterModes.status },
      }

      if (_filter) {
        _filter(appliedFilters)
      }

      return updatedFilters
    })
  }

  const filterFields = [
    { title: 'Name', value: 'roleName', type: 'text' },
    { title: 'Description', value: 'description', type: 'text' },
    { title: 'Status', value: 'status', type: 'dropdown', options: statusOptions },
  ]

  const hasFilters = Object.values(filters).some((value) => value && value !== '')

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {!isScrolled && (
        <Box
          sx={{
            ...addCategoryContainer,
            mb: isSmall ? '0px' : '20px',
          }}
        >
          <Button variant="contained" sx={addCategoryButton} onClick={handleAddOpen}>
            Add Role
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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: isSmall ? 'wrap' : 'nowrap',
            gap: 2,
          }}
        >
          <Typography variant="text24Weight400" sx={tableName}>
            Role List
          </Typography>
          <Box
            sx={{
              ...searchFilterContainer,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {isScrolled && (
              <CustomTooltip arrow title="Add Role" placement="top">
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
            )}
            <HeaderSearchInput isSmall={isSmall} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <Typography onClick={handlePopoverOpen} variant="text14Weight400" sx={mobileFilterText}>
              Filter{' '}
              <span style={filterText}>
                <img src="/icons/filterIcon.svg" alt="filter" />
              </span>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Filter Popover */}
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
                          render={({ field: { onChange } }) => (
                            <CustomFilterList
                              value={statusValue}
                              setValue={(newValue) => {
                                onChange(newValue?.value || '')
                                setStatusValue(newValue)
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
              <Button type="submit" sx={applyFilterButton} variant="contained">
                Apply Filter
              </Button>
            </Box>
          </Box>
        </form>
      </Popover>

      {/* Active Filters Display */}
      {hasFilters && (
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

      {isSmall && !isScrolled && (
        <Box sx={{ mt: 2 }}>
          <HeaderSearchInput isSmall={isSmall} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </Box>
      )}
    </>
  )
}

export default TableHeader
