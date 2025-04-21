import React, { useState, useEffect } from 'react'
import { Box, Button, Menu, MenuItem, Checkbox, Typography, Popover, useMediaQuery, FormControl } from '@mui/material'
import moment from 'moment'
import Grid from '@mui/material/Grid2'
import { Controller, useForm } from 'react-hook-form'
import CustomTooltip from '../componenets/customTooltip'
import CustomFilterList from '@/components/customFilterList'
import CustomFilterInput from '@/components/customFilterInput'
import { downloadTranscriptionFile } from '@/services/event.service'
import HeaderSearchInput from '@/layouts/shared-components/HeaderSearchInput'
import DropdownWithCustomStyle from '@/components/CustomFilterDropdown'
import DownloadSVG from '@/menu-icons/downloadIcon'

const TableHeader = ({ globalSearchedTxt, setIsSearch, selectedIds, handleAddOpen, userFilter, data }) => {
  const [selectedItems, setSelectedItems] = useState({
    initialTranscript: false,
  })
  const [searchedTxt, setSearchedTxt] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [anchorEl2, setAnchorEl2] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const handleClick2 = (event) => setAnchorEl2(event.currentTarget)
  const handleClose2 = () => setAnchorEl2(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

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
      // handlePopoverClose()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  const platformData = [
    {
      value: 'zoom',
      label: 'Zoom',
    },
    {
      value: 'teams',
      label: 'Teams',
    },
    {
      value: 'google Meet',
      label: 'Google Meet',
    },
  ]

  const statusData = [
    // {
    //     value: 'CREATED', label: 'Not Started'
    // },
    {
      value: 'COMPLETED_CAPTION',
      label: 'Completed',
    },
    {
      value: 'BOT_CONNECTING',
      label: 'Started',
    },
    {
      value: 'LIVE_CAPTION',
      label: 'Live Caption',
    },
    {
      value: 'PENDING',
      label: 'Pending',
    },
    {
      value: 'STREAM_CONNECTED',
      label: 'Stream Connected',
    },
    {
      value: 'CANCELLED',
      label: 'Cancelled',
    },
    // {
    //     value: 'EDITED', label: 'Edited'
    // },
    // {
    //     value: 'SUBMITTED', label: 'Submitted'
    // },
    // {
    //     value: 'EMAILED', label: 'Emailed'
    // },
  ]
  const [selectedPlatform, setSlectedPlatform] = useState()
  const [selectedStatus, setSelectedStatus] = useState()

  const [filterModes, setFilterModes] = useState({
    eventName: 'CONTAINS',
    platform: 'CONTAINS',
    createdBy: 'CONTAINS',
    dueDate: 'CONTAINS',
    status: 'CONTAINS',
    createdAt: 'CONTAINS',
  })

  const [filters, setFilters] = useState({
    eventName: '',
    platform: '',
    createdBy: '',
    dueDate: '',
    status: '',
    createdAt: '',
  })

  const handleFilterModeChange = (field, value) => {
    setFilterModes((prev) => ({
      ...prev,
      [field]: value, // Update mode for the respective field
    }))
  }
  const submitData = (data) => {
    const appliedFilters = {
      eventName: { value: data.eventName, mode: filterModes.eventName },
      platform: { value: data.platform, mode: filterModes.platform },
      createdBy: { value: data.createdBy, mode: filterModes.createdBy },
      dueDate: { value: data.dueDate, mode: filterModes.dueDate },
      status: { value: data.status, mode: filterModes.status },
      createdAt: { value: data.createdAt, mode: filterModes.createdAt },
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
  const hasFilters = Object.values(filters).some((value) => value !== '')

  const {
    reset,
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      eventName: filters.eventName,
      platform: filters.platform,
      createdBy: filters.createdBy,
      dueDate: filters.dueDate,
      status: filters.status,
      createdAt: filters.createdAt,
    },
    mode: 'onChange',
  })
  const clearFilter = () => {
    setValue('eventName', '')
    setValue('platform', ''), setValue('createdBy', '')
    setValue('dueDate', '')
    setValue('status', '')
    setValue('createdAt', '')
    setFilters({
      eventName: '',
      platform: '',
      createdBy: '',
      dueDate: '',
      status: '',
      createdAt: '',
    })
    setFilterModes({
      eventName: 'CONTAINS',
      platform: 'CONTAINS',
      createdBy: 'CONTAINS',
      dueDate: 'CONTAINS',
      status: 'CONTAINS',
      createdAt: 'CONTAINS',
    })
    setSlectedPlatform({ value: '', label: '' })
    setSelectedStatus({ value: '', label: '' })
    setIsSearch(false)
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
      filterKey === 'platform' && setSlectedPlatform({ value: '', label: '' })
      filterKey === 'status' && setSelectedStatus({ value: '', label: '' })

      const appliedFilters = {
        eventName: {
          value: updatedFilters.eventName,
          mode: filterModes.eventName,
        },
        platform: {
          value: updatedFilters.platform,
          mode: filterModes.platform,
        },
        createdBy: {
          value: updatedFilters.createdBy,
          mode: filterModes.createdBy,
        },
        dueDate: { value: updatedFilters.dueDate, mode: filterModes.dueDate },
        status: { value: updatedFilters.status, mode: filterModes.status },
        createdAt: {
          value: updatedFilters.createdAt,
          mode: filterModes.createdAt,
        },
      }
      if (userFilter) {
        setIsSearch(false)
        userFilter(appliedFilters)
      }

      return updatedFilters
    })
  }
  const filterFields = [
    { title: 'Event Name', fieldvalue: 'eventName' },
    { title: 'Platform', fieldvalue: 'platform' },
    { title: 'Created By', fieldvalue: 'createdBy' },
    { title: 'Due Date', fieldvalue: 'dueDate' },
    { title: 'Transcription Status', fieldvalue: 'status' },
    { title: 'Date & Time', fieldvalue: 'createdAt' },
  ]

  // Search useEffect
  useEffect(() => {
    if (searchedTxt?.length > 0 && userFilter) {
      const searhingPayload = {
        eventName: {
          value: searchedTxt,
          mode: 'CONTAINS',
        },
        createdBy: {
          value: searchedTxt,
          mode: 'CONTAINS',
        },
      }
      setIsSearch(true)
      userFilter(searhingPayload)
    } else {
      userFilter && userFilter(null)
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

  const handleDownloadTranscriptions = async (fileId) => {
    try {
      const blob = await downloadTranscriptionFile(fileId)

      // Ensure the file is a .docx
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url

      // Set the correct filename with .docx extension
      a.download = `${fileId} transcription.docx`

      // Append to document, trigger download, and remove
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      // Release memory
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  const handleDownloads = () => {
    if (selectedIds?.length > 0) {
      if (selectedItems?.initialTranscript) {
        selectedIds.forEach((id) => {
          handleDownloadTranscriptions(id)
        })
      }
    }
  }
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
            Create Event
          </Button>
          <Button
            variant="outlined"
            sx={{
              cursor: selectedIds?.length === 0 ? 'not-allowed' : 'pointer',
              width: '217px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
              position: 'relative',
              border: '1px solid #BDBDBD',
            }}
            // disabled={selectedIds?.length === 0}
            onClick={handleDownloads}
          >
            <Typography
              sx={{
                cursor: selectedIds?.length === 0 ? 'not-allowed' : 'pointer',
                flex: 1,
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: 500,
                color: selectedIds?.length === 0 ? '#BDBDBD' : '#4489FE',
                textTransform: 'capitalize',
              }}
            >
              Download
            </Typography>
            {selectedIds?.length > 0 && (
              <span
                onClick={(e) => {
                  // if (selectedIds?.length > 0) {
                  handleClick2(e)
                  // }
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  background: isHovered ? '#639cfe' : '#4489FE', // Change background on hover
                  height: '100%',
                  width: '43px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <img
                  src="/icons/dropdown.svg"
                  alt="arrow"
                  style={{
                    transition: 'transform 0.3s ease',
                    transform: open2 ? 'rotate(0deg)' : 'rotate(180deg)',
                  }}
                />
              </span>
            )}
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
            Event List
          </Typography>
          <Typography
            variant="buttonLabel"
            sx={{
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
                {selectedIds?.length > 0 ? (
                  <CustomTooltip arrow title="Download Initial Transcript" placement="top">
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
                      <img src="/icons/downloadIcon.svg" alt="download" />
                    </Typography>
                  </CustomTooltip>
                ) : (
                  <Typography
                    onClick={(e) => {
                      if (selectedIds?.length > 0) {
                        handleClick2(e)
                      }
                    }}
                    disabled={selectedIds?.length === 0}
                    sx={{
                      cursor: 'not-allowed',
                      background: selectedIds?.length === 0 ? '#f8f9fa' : '#D8E6FF',
                      justifyContent: 'center',
                      padding: '12px',
                      borderRadius: '4px',
                      height: '44px',
                      width: '44px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <DownloadSVG color={'#BDBDBD'} />
                  </Typography>
                )}
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
                  {selectedIds?.length > 0 ? (
                    <CustomTooltip arrow title="Download Initial Transcript" placement="top">
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
                        <img src="/icons/downloadIcon.svg" alt="download" />
                      </Typography>
                    </CustomTooltip>
                  ) : (
                    <Typography
                      onClick={(e) => {
                        if (selectedIds?.length > 0) {
                          handleClick2(e)
                        }
                      }}
                      disabled={selectedIds?.length === 0}
                      sx={{
                        cursor: 'not-allowed',
                        background: selectedIds?.length === 0 ? '#f8f9fa' : '#D8E6FF',
                        justifyContent: 'center',
                        padding: '12px',
                        borderRadius: '4px',
                        height: '44px',
                        width: '44px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <DownloadSVG color={'#BDBDBD'} />
                    </Typography>
                  )}
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
                        {fieldvalue !== 'platform' && fieldvalue !== 'status' && (
                          <FormControl fullWidth sx={{ mb: '6px' }}>
                            <Controller
                              name={fieldvalue}
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <CustomFilterInput
                                  type={
                                    fieldvalue === 'createdAt' || fieldvalue === 'dueDate' ? 'datetime-local' : 'text'
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

                        {/* Platform Filter */}
                        {fieldvalue === 'platform' && (
                          <FormControl fullWidth sx={{ mb: '6px' }}>
                            <Controller
                              name={fieldvalue}
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <CustomFilterList
                                  value={selectedPlatform}
                                  setValue={(newValue) => {
                                    onChange(newValue?.value || null)
                                    setSlectedPlatform(newValue)
                                  }}
                                  option={platformData}
                                  placeHolder={'Filter by Platform'}
                                  width={'100%'}
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
                                  placeHolder={'Filter by Transcription Status'}
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
                isXs && isScrolled ? '-43px' : isSmall && isScrolled ? 0 : isMedium && !isScrolled ? 0 : '-43px',
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
              onClick={() => handleToggle('initialTranscript')}
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
            {/* <MenuItem disableRipple
                            sx={{
                                padding: '12px 21px'
                            }}

                            onClick={() => handleToggle("machineTranscript")}>
                            <Checkbox
                                checked={selectedItems.machineTranscript}
                                edge="start"
                                disableRipple
                                icon={<img src="/icons/globalCheckBox.svg" alt="" />} checkedIcon={<img src="/icons/globalChecked.svg" alt="" />}
                                sx={{
                                    height: '18px',
                                    width: '18px',
                                }}
                            />
                            <Typography
                                variant="body1"
                                sx={{ color: "#212121", fontSize: "15px", ml: '8px', fontWeight: 400 }}
                            >
                                {"Machine Transcript"}
                            </Typography>
                        </MenuItem>
                        <MenuItem disableRipple sx={{
                            m: 0,
                            padding: '12px 21px'
                        }}
                            onClick={() => handleToggle("editedTranscript")}>
                            <Checkbox
                                disableRipple
                                icon={<img src="/icons/globalCheckBox.svg" alt="" />} checkedIcon={<img src="/icons/globalChecked.svg" alt="" />}
                                checked={selectedItems.editedTranscript}
                                edge="start"
                                sx={{
                                    height: '18px',
                                    width: '18px',
                                }}
                            />
                            <Typography
                                variant="body1"
                                sx={{ color: "#212121", fontSize: "15px", ml: '8px', fontWeight: 400 }}
                            >
                                {"Edited Transcript"}
                            </Typography>
                        </MenuItem> */}
          </Box>
        </Menu>
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
                {selectedIds?.length > 0 ? (
                  <CustomTooltip arrow title="Download Machine Transcript or Edited Transcript" placement="top">
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
                      <img src="/icons/downloadIcon.svg" alt="download" />
                    </Typography>
                  </CustomTooltip>
                ) : (
                  <Typography
                    onClick={(e) => {
                      if (selectedIds?.length > 0) {
                        handleClick2(e)
                      }
                    }}
                    disabled={selectedIds?.length === 0}
                    sx={{
                      cursor: 'not-allowed',
                      background: selectedIds?.length === 0 ? '#f8f9fa' : '#D8E6FF',
                      justifyContent: 'center',
                      padding: '12px',
                      borderRadius: '4px',
                      height: '44px',
                      width: '44px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <DownloadSVG color={'#BDBDBD'} />
                  </Typography>
                )}
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

              // Check if the key is 'platform' and get the corresponding label
              if (key === 'platform') {
                const platform = platformData.find((item) => item.value === filters[key])
                displayValue = platform ? platform.label : filters[key] // Use label or fallback to value
              }

              // Check if the key is 'status' and get the corresponding label
              if (key === 'status') {
                const status = statusData.find((item) => item.value === filters[key])
                displayValue = status ? status.label : filters[key] // Use label or fallback to value
              }

              // Check if the key is 'dueDate' or 'createdAt' and format the value using moment
              if (key === 'dueDate' || key === 'createdAt') {
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
