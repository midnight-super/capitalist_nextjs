import DropdownWithCustomStyle from '@/components/CustomFilterDropdown'
import CustomFilterInput from '@/components/customFilterInput'
import CustomFilterList from '@/components/customFilterList'
import HeaderSearchInput from '@/layouts/shared-components/HeaderSearchInput'
import { handleOrderCreate } from '@/services/order.service'
import { Box, Button, FormControl, Popover, Typography, useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Grid2'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import CustomTooltip from '../componenets/customTooltip'

const TableHeader = ({ selectedIds, userFilter, data, setSearchText, searchText }) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const [anchorEl2, setAnchorEl2] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const handleClick2 = (event) => setAnchorEl2(event.currentTarget)
  const handleClose2 = () => setAnchorEl2(null)

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget)
  const handlePopoverClose = () => setAnchorEl(null)

  const open = Boolean(anchorEl)
  const open2 = Boolean(anchorEl2)
  const isSmall = useMediaQuery('(max-width:768px)')
  const isMedium = useMediaQuery('(max-width:920px)')
  const isXs = useMediaQuery('(max-width:490px)')

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
    const handleResize = () => {
      handleClose2()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const statusData = [
    {
      value: 'PRODUCTION',
      label: 'Production',
    },
    {
      value: 'NOT_CONFIRMED',
      label: 'Not Confirmed',
    },
    {
      value: 'UN_ASSIGNED',
      label: 'Unassigned',
    },
    {
      value: 'COMPLETE',
      label: 'Complete',
    },
    {
      value: 'CANCELLED',
      label: 'Cancelled',
    },
    {
      value: 'DRAFT',
      label: 'Draft',
    },
  ]

  const [selectedStatus, setSelectedStatus] = useState()

  const [filterModes, setFilterModes] = useState({
    orderId: 'CONTAINS',
    client: 'CONTAINS',
    createdDate: 'CONTAINS',
    dueDate: 'CONTAINS',
    status: 'CONTAINS',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    orderId: '',
    client: '',
    createdDate: '',
    dueDate: '',
    status: '',
  })

  const handleFilterModeChange = (field, value) => {
    setFilterModes((prev) => ({
      ...prev,
      [field]: value, // Update mode for the respective field
    }))
  }
  const submitData = (data) => {
    const appliedFilters = {
      orderId: { value: data.orderId, mode: filterModes.orderId },
      client: { value: data.client, mode: filterModes.client },
      createdDate: { value: data.createdDate, mode: filterModes.createdDate },
      dueDate: { value: data.dueDate, mode: filterModes.dueDate },
      status: { value: data.status, mode: filterModes.status },
    }
    const isValid = Object.keys(appliedFilters).some((key) => {
      return appliedFilters[key].value && appliedFilters[key].mode
    })

    if (!isValid) {
      return
    }
    userFilter && userFilter(appliedFilters)
    setFilters(data)
    handlePopoverClose()
  }

  const handleCreateButton = async () => {
    setIsLoading(true) // Ensure loading state is updated
    try {
      const body = {
        status: 'draft',
        createdAt: new Date().toISOString(),
      }
      const res = await handleOrderCreate(body)
      if (res?.success) {
      } else {
        // toast.error(res || 'Server Error: Failed to fetch');
        router.push(`/order-management/order/${res}/edit`)
      }
    } catch (err) {
      toast.error(err?.message || 'Unexpected Error')
    } finally {
      setIsLoading(false)
    }
  }

  const {
    reset,
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      orderId: filters.orderId,
      client: filters.client,
      createdDate: filters.createdDate,
      dueDate: filters.dueDate,
      status: filters.status,
    },
    mode: 'onChange',
  })
  const clearFilter = () => {
    setValue('orderId', '')
    setValue('client', ''), setValue('createdDate', '')
    setValue('dueDate', '')
    setValue('status', '')
    setFilters({
      orderId: '',
      client: '',
      createdDate: '',
      dueDate: '',
      status: '',
    })
    setFilterModes({
      orderId: 'CONTAINS',
      client: 'CONTAINS',
      createdDate: 'CONTAINS',
      dueDate: 'CONTAINS',
      status: 'CONTAINS',
    })
    setSelectedStatus({ value: '', label: '' })

    userFilter && userFilter(null)
  }

  const clearSpecificFilter = (filterKey) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [filterKey]: '' }
      setValue(filterKey, '')
      setFilterModes((prevModes) => ({
        ...prevModes,
        [filterKey]: 'CONTAINS',
      }))
      filterKey === 'status' && setSelectedStatus({ value: '', label: '' })

      const appliedFilters = {
        orderId: {
          value: updatedFilters.orderId,
          mode: filterModes.orderId,
        },
        client: {
          value: updatedFilters.client,
          mode: filterModes.client,
        },
        createdDate: {
          value: updatedFilters.createdDate,
          mode: filterModes.createdDate,
        },
        dueDate: { value: updatedFilters.dueDate, mode: filterModes.dueDate },
        status: { value: updatedFilters.status, mode: filterModes.status },
      }
      if (userFilter) {
        userFilter(appliedFilters)
      }

      return updatedFilters
    })
  }

  const filterFields = [
    { title: 'Order ID', fieldvalue: 'orderId' },
    { title: 'Client', fieldvalue: 'client' },
    { title: 'Created Date', fieldvalue: 'createdDate' },
    { title: 'Due Date', fieldvalue: 'dueDate' },
    { title: 'Status', fieldvalue: 'status' },
  ]

  const statsData = [
    { title: 'Total Number:', value: '1024' },
    { title: 'Total New', value: '630' },
    { title: 'Reading for Invoicing', value: '210' },
    { title: 'How many in processing', value: '350' },
  ]

  return (
    <>
      {/* widget--------- */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          flexWrap: 'wrap',
          marginBottom: '70px',
        }}
      >
        {statsData?.map((ele, index) => {
          return (
            <Box
              key={index}
              sx={{
                width: '320px',
                padding: '30px 30px',
                background: '#fff',
                borderRadius: '5px',
                display: 'flex',
                gap: '20px',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
              }}
            >
              <Typography
                sx={{
                  color: '#000',
                  fontSize: '18px',
                  // flexShrink: '0',
                }}
              >
                {ele?.title}
              </Typography>
              <Typography
                sx={{
                  color: '#4489FE',
                  fontSize: '18px',
                }}
              >
                {ele?.value}
              </Typography>
            </Box>
          )
        })}
      </Box>
      {/* widget--------- */}
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
            onClick={handleCreateButton}
            disabled={isLoading}
          >
            Create New Order
          </Button>
          <Button
            variant="outlined"
            sx={{
              width: '217px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
              position: 'relative',
            }}
          >
            <Typography
              sx={{
                flex: 1,
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: 500,
                color: '#4489FE',
                textTransform: 'none',
              }}
            >
              Send an Invoice
            </Typography>
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
          <Typography variant="text24Weight400" sx={{ fontSize: '24px', mb: { xs: '12px' } }}>
            Order List
          </Typography>
          <Typography
            variant="text14Weight400"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginLeft: '12px',
            }}
          >
            {!isXs && isSmall && isScrolled && (
              <Box sx={{ ml: '12px', display: 'flex', alignItems: 'center' }}>
                <CustomTooltip arrow title="Create New Order" placement="top">
                  <Typography
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
                    onClick={handleCreateButton}
                    disabled={isLoading}
                  >
                    <img src="/icons/addBlue.svg" alt="download" />
                  </Typography>
                </CustomTooltip>
                <CustomTooltip arrow title="Send an Invoice" placement="top">
                  <Typography
                    onClick={(e) => {
                      if (selectedIds?.length > 0) {
                        handleClick2(e)
                      }
                    }}
                    sx={{
                      cursor: 'pointer',
                      background: '#D8E6FF',
                      justifyContent: 'center',
                      padding: '12px',
                      borderRadius: '4px',
                      height: '44px',
                      width: '44px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <img src="/icons/invoice_icon.png" alt="invoice" />
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

          {!isSmall && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isScrolled && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomTooltip arrow title="Create New Order" placement="top">
                    <Typography
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
                      onClick={handleCreateButton}
                      disabled={isLoading}
                    >
                      <img src="/icons/addBlue.svg" alt="download" />
                    </Typography>
                  </CustomTooltip>
                  <CustomTooltip arrow title="Send an Invoice" placement="top">
                    <Typography
                      onClick={(e) => {
                        if (selectedIds?.length > 0) {
                          handleClick2(e)
                        }
                      }}
                      sx={{
                        cursor: 'pointer',
                        background: '#D8E6FF',
                        justifyContent: 'center',
                        padding: '12px',
                        borderRadius: '4px',
                        height: '44px',
                        width: '44px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <img src="/icons/invoice_icon.png" alt="invoice" />
                    </Typography>
                  </CustomTooltip>
                </Box>
              )}
              {!isSmall && (
                <HeaderSearchInput setSearchText={setSearchText} searchText={searchText} isSmall={isSmall} />
              )}

              {!isSmall && (
                <Typography
                  onClick={handlePopoverOpen}
                  variant="text14Weight400"
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
            </Box>
          )}

          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            disableScrollLock={true}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
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
                  {filterFields.map(({ title, fieldvalue }) => (
                    <Grid key={fieldvalue} item xs={12} sx={{ width: '100%' }}>
                      <Typography variant="body1">{`Filter by ${title}`}</Typography>
                      <Typography
                        sx={{
                          textAlign: 'right',
                          color: '#898989',
                          fontSize: '12px',
                          fontWeight: 400,
                        }}
                      >
                        {/* Render Text or Date Filter */}
                        {fieldvalue !== 'status' && (
                          <FormControl fullWidth sx={{ mb: '6px' }}>
                            <Controller
                              name={fieldvalue}
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <CustomFilterInput
                                  type={
                                    fieldvalue === 'createdDate' || fieldvalue === 'dueDate' ? 'datetime-local' : 'text'
                                  }
                                  value={value}
                                  onChange={onChange}
                                  label={`Filter by ${title}`}
                                  handleClear={() => clearSpecificFilter(fieldvalue)} // Clear input field
                                />
                              )}
                            />
                          </FormControl>
                        )}

                        {/* Status Filter */}
                        {fieldvalue === 'status' && (
                          <FormControl fullWidth sx={{ mb: '6px' }}>
                            <Controller
                              name={fieldvalue}
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <CustomFilterList
                                  value={selectedStatus}
                                  setValue={(newValue) => {
                                    onChange(newValue?.value || null)
                                    setSelectedStatus(newValue)
                                  }}
                                  option={statusData}
                                  placeHolder={'Filter by Status'}
                                  width={'100%'}
                                />
                              )}
                            />
                          </FormControl>
                        )}

                        {/* Dropdown Filter for Mode */}
                        <DropdownWithCustomStyle
                          field={fieldvalue}
                          client={false}
                          filterValue={(value) => handleFilterModeChange(value, fieldvalue)}
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
        {/* <Menu
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
            horizontal:
              isXs && isScrolled
                ? 'left'
                : isSmall && isMedium && isScrolled
                  ? 'right'
                  : isMedium && !isScrolled && 'right',
          }}
          PaperProps={{
            sx: {
              // height: '104px',
              height: '55px',
              width: '207px',
              zIndex: 1,
              boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.15)',
              borderRadius: '4px',
              marginLeft:
                isXs && isScrolled
                  ? '-43px'
                  : isSmall && isScrolled
                    ? 0
                    : isMedium && !isScrolled
                      ? 0
                      : '-43px',
              marginTop: '6px',
              '& .MuiMenu-list': {
                padding: '0px !important',
              },
            },
          }}
        >
          <Box sx={{ mt: '5px' }}>
            <MenuItem
              disableRipple
              sx={{
                padding: '12px 21px',
              }}
              // onClick={() => handleToggle('initialTranscript')}
            >
              <Checkbox
                checked={selectedItems.initialTranscript}
                edge="start"
                disableRipple
                icon={<img src="/icons/globalCheckBox.svg" alt="" />}
                checkedIcon={<img src="/icons/globalChecked.svg" alt="" />}
                sx={{
                  height: '18px',
                  width: '18px',
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  color: '#212121',
                  fontSize: '15px',
                  ml: '8px',
                  fontWeight: 400,
                }}
              >
                {'Initial Transcript'}
              </Typography>
            </MenuItem>
          </Box>
        </Menu> */}
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
                <CustomTooltip arrow title="Create New Order" placement="top">
                  <Typography
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
                    onClick={handleCreateButton}
                    disabled={isLoading}
                  >
                    <img src="/icons/addBlue.svg" alt="download" />
                  </Typography>
                </CustomTooltip>
                <CustomTooltip arrow title="Send an Invoice" placement="top">
                  <Typography
                    onClick={handleClick2}
                    sx={{
                      cursor: 'pointer',
                      background: '#D8E6FF',
                      justifyContent: 'center',
                      padding: '12px',
                      borderRadius: '4px',
                      height: '44px',
                      width: '44px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <img src="/icons/invoice_icon.png" alt="invoice" />
                  </Typography>
                </CustomTooltip>
              </Box>
            )}
            <Typography
              variant="text14Weight400"
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
            <HeaderSearchInput setSearchText={setSearchText} searchText={searchText} isSmall={isSmall} />
          </Box>
        )}
      </Box>
      {isSmall && <HeaderSearchInput setSearchText={setSearchText} searchText={searchText} isSmall={isSmall} />}

      {Object.values(filters).some((value) => value && value !== '') && (
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

              // Check if the key is 'dueDate' or 'createdAt' and format the value using moment
              if (key === 'dueDate' || key === 'createdDate') {
                displayValue = moment(filters[key]).format('DD MMM YYYY, hh:mm A')
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
