import React, { useState, useEffect } from 'react'
import { Box, Button, Menu, MenuItem, Checkbox, Typography, Popover, useMediaQuery, FormControl } from '@mui/material'
import HeaderSearchInput from '@/layouts/shared-components/HeaderSearchInput'
import CustomTooltip from '../componenets/customTooltip'
import RulesFilterTags from './RulesFilterTags'

const RulePageHeader = ({
  globalSearchedTxt,
  isSearch,
  setIsSearch,
  handleAddOpen,
  ruleFilter,
  setRuleFilter,
  data,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchedTxt, setSearchedTxt] = useState('')

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget)
  const handlePopoverClose = () => setAnchorEl(null)

  function closeRuleFilterForm() {
    setAnchorEl(null)
  }

  const isSmall = useMediaQuery('(max-width:720px)')
  const isXs = useMediaQuery('(max-width:480px)')
  const isMedium = useMediaQuery('(max-width:920px)')

  useEffect(() => {
    if (!isSearch) {
      setSearchedTxt('')
    }
  }, [isSearch])

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

  useEffect(() => {
    if (searchedTxt === '' && globalSearchedTxt === '') {
      const initialFilters = {
        status: { value: 'ACTIVE', mode: 'EQUAL' },
      }
      setRuleFilter(initialFilters)
    }
  }, [])

  // Search useEffect
  useEffect(() => {
    if (!searchedTxt && !globalSearchedTxt) {
      return
    }
    const value = `${searchedTxt || globalSearchedTxt}`.trim()
    const searhingPayload = {
      ruleName: {
        value,
        mode: 'CONTAINS',
      },
      objectName: {
        value,
        mode: 'CONTAINS',
      },
      createdAt: {
        value,
        mode: 'EQUAL',
      },
      status: {
        value,
        mode: 'EQUAL',
      },
    }
    setIsSearch(true)
    setRuleFilter(searhingPayload)
  }, [searchedTxt, globalSearchedTxt])

  useEffect(() => {
    const handleResize = () => {
      handlePopoverClose()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

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
            Create Rule
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
            Rules List
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
                        padding: '10px',
                        borderRadius: '4px',
                        height: '44px',
                        width: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
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
                        padding: '10px',
                        borderRadius: '4px',
                        height: '44px',
                        width: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                        mr: 1,
                      }}
                    >
                      <img src="/icons/addBlue.svg" alt="download" />
                    </Typography>
                  </CustomTooltip>
                </Box>
              )}
              {!isSmall && (
                <HeaderSearchInput isSmall={isSmall} searchQuery={searchedTxt} setSearchQuery={setSearchedTxt} />
              )}

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
            <HeaderSearchInput isSmall={isSmall} searchQuery={searchedTxt} setSearchQuery={setSearchedTxt} />
          </Box>
        )}

        <RulesFilterTags
          {...{
            anchorEl,
            closeRuleFilterForm,
            setRuleFilter,
            isSearch,
            setIsSearch,
          }}
        />
      </Box>
    </>
  )
}

export default RulePageHeader
