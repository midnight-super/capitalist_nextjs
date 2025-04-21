import React, { useState, useEffect } from 'react'

import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import { Sort as FilterIcon } from '@mui/icons-material'

import HeaderSearchInput from '@/layouts/shared-components/HeaderSearchInput'
import PreviewModal from './modal/PreviewModal'
import ShareModal from './modal/ShareFileModal'
import IconActionButtons from './IconActionButtons'
import TopActionButtons from './TopActionButtons'
import FileFilterTags from './FileFilterTags'

export default function PageHeader({
  globalSearchedTxt,
  setIsSearch,
  setFileFilter,
  selectedFiles,
  downloadSelectedFiles,
}) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchedTxt, setSearchedTxt] = useState('')
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const isSmall = useMediaQuery('(max-width:720px)')

  function openFileFilterForm(event) {
    console.log('openFileFilterForm', event.currentTarget)
    setAnchorEl(event.currentTarget)
  }

  function closeFileFilterForm() {
    setAnchorEl(null)
  }

  // Handle scroll behavior
  useEffect(() => {
    function onScroll() {
      const pageY = window.scrollY

      setIsScrolled((isSmall && pageY > 50) || (!isSmall && pageY > 150))
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [isSmall])

  // Search useEffect
  useEffect(() => {
    const value = `${searchedTxt || globalSearchedTxt}`.trim()
    let criteria = {}

    if (value.length > 0) {
      criteria = {
        fileName: {
          value,
          mode: 'CONTAINS',
        },
        createdAt: {
          value,
          mode: 'CONTAINS',
        },
        updatedAt: {
          value,
          mode: 'CONTAINS',
        },
        uploadedBy: {
          value,
          mode: 'CONTAINS',
        },
        updatedBy: {
          value,
          mode: 'CONTAINS',
        },
        tag: {
          value,
          mode: 'EQUAL',
        },
        status: {
          value,
          mode: 'EQUAL',
        },
      }
      setIsSearch(true)
    }

    setFileFilter(criteria)
  }, [searchedTxt, globalSearchedTxt])

  useEffect(() => {
    const handleResize = () => {
      closeFileFilterForm()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
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
                marginLeft: '110px',
              }
            : {
                backgroundColor: '#fff',
                marginLeft: 0,
              }
        }
      >
        {!isScrolled && (
          <TopActionButtons
            {...{
              disabled: !selectedFiles.length,
              downloadSelectedFiles,
              setIsPreviewModalOpen,
              setIsShareModalOpen,
            }}
          />
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: isScrolled ? '10px' : '0px',
          }}
        >
          <Typography variant="h1">File List</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isScrolled && (
              <IconActionButtons
                {...{
                  disabled: !selectedFiles.length,
                  downloadSelectedFiles,
                  setIsPreviewModalOpen,
                  setIsShareModalOpen,
                }}
              />
            )}
            <HeaderSearchInput isSmall={isSmall} setSearchedTxt={setSearchedTxt} />
            <Button variant="text" color="secondary" endIcon={<FilterIcon />} onClick={openFileFilterForm}>
              Filter
            </Button>
          </Box>
        </Box>
      </Box>

      <FileFilterTags
        {...{
          anchorEl,
          closeFileFilterForm,
          setFileFilter,
          setIsSearch,
        }}
      />

      {isPreviewModalOpen && (
        <PreviewModal files={selectedFiles} open={isPreviewModalOpen} close={() => setIsPreviewModalOpen(false)} />
      )}

      {isShareModalOpen && (
        <ShareModal files={selectedFiles} open={isShareModalOpen} close={() => setIsShareModalOpen(false)} />
      )}
    </>
  )
}
