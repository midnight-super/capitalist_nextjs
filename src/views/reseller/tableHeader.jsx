import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Box, Button, Typography, Popover, useMediaQuery, FormControl, Card } from '@mui/material'
import Grid from '@mui/material/Grid2'
import HeaderSearchInput from '@/layouts/shared-components/HeaderSearchInput'
import DropdownWithCustomStyle from '@/components/CustomFilterDropdown'
import CustomTooltip from '../componenets/customTooltip'
import { Controller, useForm } from 'react-hook-form'
import CustomFilterInput from '@/components/customFilterInput'
import CustomFilterList from '@/components/customFilterList'
import { servicesCategHeader } from '@/styles/table-styles'
import { getAllResellers } from '@/services/reseller.service' // Adjusted service
import { PersonAdd, PersonAddAlt1 } from '@mui/icons-material'
import AddResellerModal from '@/views/reseller/modal/addResellerModal' // Adjusted modal
import AddSubUserModal from '@/views/reseller/modal/addSubUserModal'

const TableHeader = ({ data, filter: _filter, searchQuery, setSearchQuery, fetchResellerData, setFilteredData }) => {
  const {
    addCategoryContainer,
    addCategoryButton,
    headerContainer,
    tableName,
    addIcon,
    searchFilterContainer,
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

  const [anchorEl, setAnchorEl] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget)
  const handlePopoverClose = () => setAnchorEl(null)

  const open = Boolean(anchorEl)
  const isSmall = useMediaQuery('(max-width:720px)')
  const isXs = useMediaQuery('(max-width:480px)')
  const isMedium = useMediaQuery('(max-width:920px)')

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'BLOCKED', label: 'Blocked' },
  ]

  const [filterModes, setFilterModes] = useState({
    fullName: 'CONTAINS',
    email: 'CONTAINS',
    companyTitle: 'CONTAINS',
    status: 'EQUAL',
  })

  const [filters, setFilters] = useState({
    fullName: '',
    email: '',
    companyTitle: '',
    status: '',
  })

  const [addSubUserOpen, setAddSubUserOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  const handleAddSubUserOpen = () => setAddSubUserOpen(true)
  const handleAddSubUserClose = () => setAddSubUserOpen(false)
  const handleAddOpen = () => setAddOpen(true)
  const handleAddClose = () => setAddOpen(false)

  const headerRef = useRef(null)

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false)
      setFilters({
        fullName: '',
        email: '',
        companyTitle: '',
        status: '',
      })
      if (_filter) {
        _filter({})
      }
    }
  }, [isInitialLoad, _filter])

  useEffect(() => {
    if (searchQuery) {
      console.log('Searching with query:', searchQuery)
      const filtered = []

      data?.forEach((reseller) => {
        const searchTerm = searchQuery.toLowerCase()
        let mainUserMatch = false
        let matchedSubUsers = []

        // Check main user (admin) match
        const adminName = reseller.admin?.fullName?.toLowerCase() || ''
        const adminEmail = reseller.admin?.email?.toLowerCase() || ''
        const companyTitle = reseller.company?.title?.toLowerCase() || ''
        const adminContact = reseller.admin?.contactNumber?.toLowerCase() || ''

        mainUserMatch = [adminName, adminEmail, companyTitle, adminContact].some((field) => field.includes(searchTerm))

        // If main user matches, add it to filtered results
        if (mainUserMatch) {
          filtered.push({
            ...reseller,
            fullName: reseller.admin.fullName,
            email: reseller.admin.email,
            contactNumber: reseller.admin.contactNumber,
            status: reseller.admin.status,
            isMainUser: true,
            subUsers: reseller.subUsers || [],
          })
        }

        // Check sub-users
        if (reseller.subUsers?.length > 0) {
          matchedSubUsers = reseller.subUsers.filter((subUser) => {
            const subUserName = subUser.fullName?.toLowerCase() || ''
            const subUserEmail = subUser.email?.toLowerCase() || ''
            const subUserContact = subUser.contactNumber?.toLowerCase() || ''

            return [subUserName, subUserEmail, subUserContact].some((field) => field.includes(searchTerm))
          })

          // Add matched sub-users to filtered results
          matchedSubUsers.forEach((subUser) => {
            filtered.push({
              resellerId: reseller.resellerId,
              company: reseller.company,
              fullName: subUser.fullName || `${subUser.firstName} ${subUser.lastName}`,
              email: subUser.email,
              contactNumber: subUser.contactNumber,
              status: subUser.status,
              staffId: subUser.staffId,
              isMainUser: false,
              createdAt: subUser.createdAt || subUser.createAt,
              updatedAt: subUser.updatedAt || subUser.updateAt,
            })
          })
        }
      })

      console.log('Filtered results:', filtered.length)
      setFilteredData(filtered || [])
    } else {
      console.log('No search query, showing all data')
      // When no search query, show all data with both main users and sub-users
      const allData = []
      data?.forEach((reseller, idx) => {
        if (reseller.admin) {
          // Add main user
          allData.push({
            ...reseller,
            fullName: reseller.admin.fullName,
            email: reseller.admin.email,
            contactNumber: reseller.admin.contactNumber,
            status: reseller.admin.status,
            isMainUser: true,
            subUsers: reseller.subUsers || [],
          })

          // Add sub-users
          if (reseller.subUsers?.length > 0) {
            reseller.subUsers.forEach((subUser) => {
              if (subUser.staffId !== reseller.admin.staffId) {
                allData.push({
                  resellerId: reseller.resellerId,
                  company: reseller.company,
                  fullName: subUser.fullName || `${subUser.firstName} ${subUser.lastName}`,
                  email: subUser.email,
                  contactNumber: subUser.contactNumber,
                  status: subUser.status,
                  staffId: subUser.staffId,
                  isMainUser: false,
                  createdAt: subUser.createdAt || subUser.createAt,
                  updatedAt: subUser.updatedAt || subUser.updateAt,
                })
              }
            })
          }
        }
      })
      setFilteredData(allData || [])
    }
  }, [searchQuery, data, setFilteredData])

  // Add logging for search query updates
  useEffect(() => {
    console.log('Search Query Updated:', searchQuery)
  }, [searchQuery])

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
      companyTitle: {
        value: data.companyTitle,
        mode: filterModes.companyTitle,
      },
      status: { value: data.status, mode: filterModes.status },
    }
    const isValid = Object.keys(appliedFilters).some((key) => appliedFilters[key].value && appliedFilters[key].mode)
    if (!isValid) return

    _filter && _filter(appliedFilters)
    setFilters(data)
    handlePopoverClose()
  }

  const hasFilters = Object.values(filters).some((value) => value !== '')

  const { control, handleSubmit, setValue, reset } = useForm({
    mode: 'onChange',
  })

  const clearFilter = () => {
    setFilters({
      fullName: '',
      email: '',
      companyTitle: '',
      status: '',
    })
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

      const appliedFilters = {
        fullName: {
          value: updatedFilters.fullName,
          mode: filterModes.fullName,
        },
        email: { value: updatedFilters.email, mode: filterModes.email },
        companyTitle: {
          value: updatedFilters.companyTitle,
          mode: filterModes.companyTitle,
        },
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
    {
      title: 'Company',
      value: 'companyTitle',

      type: 'text',
    },
    {
      title: 'Status',
      value: 'status',
      type: 'dropdown',
      options: statusOptions,
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const pageY = window.scrollY
      setIsScrolled(pageY > 50)
      if (pageY > 0) handlePopoverClose()
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
            mb: isSmall ? '46px' : '76px',
            display: 'flex',
            gap: 2,
          }}
        >
          <Button variant="contained" sx={addCategoryButton} onClick={handleAddOpen}>
            Add Reseller
          </Button>
          <Button variant="contained" sx={addCategoryButton} onClick={handleAddSubUserOpen}>
            Add Sub-user
          </Button>
        </Box>
      )}

      <Box
        ref={headerRef}
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
                ml: '110px',
              }
            : {
                backgroundColor: '#fff',
                ml: '0px',
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
            Reseller List
          </Typography>

          {!isSmall && (
            <Box sx={searchFilterContainer}>
              {isScrolled && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <CustomTooltip arrow title="Add Reseller" placement="top">
                    <Typography onClick={handleAddOpen} sx={{ ...addIcon }}>
                      <PersonAdd sx={{ color: '#4489FE', fontSize: '24px' }} />
                    </Typography>
                  </CustomTooltip>
                  <CustomTooltip arrow title="Add Sub-user" placement="top">
                    <Typography onClick={handleAddSubUserOpen} sx={{ ...addIcon }}>
                      <PersonAddAlt1 sx={{ color: '#4489FE', fontSize: '24px' }} />
                    </Typography>
                  </CustomTooltip>
                </Box>
              )}
              <HeaderSearchInput isSmall={isSmall} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              <Typography onClick={handlePopoverOpen} variant="text14Weight400" sx={mobileFilterText}>
                Filter{' '}
                <span>
                  <img src="/icons/filterIcon.svg" alt="filter" />
                </span>
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {isScrolled && <Box sx={{ height: '72px' }} />}
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: paperProps }}
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
                          render={({ field: { value, onChange } }) => (
                            <CustomFilterList
                              value={value}
                              setValue={(newValue) => onChange(newValue?.value || null)}
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
                      filterValue={(val) => handleFilterModeChange(value, val)}
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

      {hasFilters && (
        <Box sx={filtersContainer}>
          {Object.keys(filters).map((key) => {
            if (filters[key]) {
              return (
                <Box key={key} sx={filtersInnerContainer}>
                  <Typography sx={filtersText}>
                    {filters[key]}{' '}
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

      {addOpen && <AddResellerModal open={addOpen} close={handleAddClose} fetchResellerData={fetchResellerData} />}

      {addSubUserOpen && (
        <AddSubUserModal
          open={addSubUserOpen}
          close={handleAddSubUserClose}
          resellers={data}
          fetchResellerData={fetchResellerData}
        />
      )}
    </>
  )
}

export default TableHeader
