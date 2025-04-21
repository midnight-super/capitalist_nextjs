import React, { useEffect, useState } from 'react'

import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import MoreIcon from '@mui/icons-material/MoreHoriz'
import OnlineIcon from '@/menu-icons/online'
import FlagIcon from '@/menu-icons/flag'

import CustomTableHeaderTitle from '@/components/CustomTableHeaderTitle'
import DetailModal from './modal/detailModal'
import FlagModal from './modal/FlagModal'
import ShareModal from './modal/ShareFileModal'
import ActionMenu from './FileActionMenu'

import { getFlagFromTag, isoDateToReadable } from '@/utils'

const baseURL = process.env.NEXT_PUBLIC_BASE_URL

export const getColumns = ({ colSorting, setColSorting, patchFile }) => {
  const theme = useTheme()

  const RowOptions = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isFlagModalOpen, setIsFlagModalOpen] = useState(false)
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)

    function openRowActionMenu(event) {
      setAnchorEl(event.currentTarget)
      event.stopPropagation()
      closeShareModal()
      closeFlagModal()
      closeDetailModal()
    }

    function closeRowActionMenu() {
      setAnchorEl(null)
    }

    function openDetailModal() {
      setIsDetailModalOpen(true)
      closeShareModal()
      closeFlagModal()
      closeRowActionMenu()
    }

    function closeDetailModal() {
      setIsDetailModalOpen(false)
    }

    function openFlagModal() {
      setIsFlagModalOpen(true)
      closeDetailModal()
      closeShareModal()
      closeRowActionMenu()
    }

    function closeFlagModal() {
      setIsFlagModalOpen(false)
    }

    function openShareModal() {
      setIsShareModalOpen(true)
      closeDetailModal()
      closeFlagModal()
      closeRowActionMenu()
    }

    function closeShareModal() {
      setIsShareModalOpen(false)
    }

    useEffect(() => {
      const handleResize = () => {
        closeRowActionMenu()
      }

      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, [])

    useEffect(() => {
      const handleScroll = () => {
        const scrollHeight = window.scrollY
        if (scrollHeight > 0) {
          closeRowActionMenu()
        }
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
      <>
        <IconButton onClick={openRowActionMenu}>
          <MoreIcon />
        </IconButton>
        <ActionMenu {...{ anchorEl, closeRowActionMenu, openDetailModal, openFlagModal, openShareModal, row }} />

        {isDetailModalOpen && <DetailModal file={row} open={isDetailModalOpen} close={closeDetailModal} />}
        {isFlagModalOpen && (
          <FlagModal file={row} open={isFlagModalOpen} close={closeFlagModal} patchFile={patchFile} />
        )}
        {isShareModalOpen && <ShareModal fileId={row.fileId} open={isShareModalOpen} close={closeShareModal} />}
      </>
    )
  }

  const columns = [
    {
      flex: 2,
      minWidth: 120,
      field: 'fileName',
      renderHeader: (params) => (
        <CustomTableHeaderTitle {...params} title={'Filename'} colSorting={colSorting} setColSorting={setColSorting} />
      ),
      sortable: false, // turn off default sorting
      renderCell: ({ row }) => <Typography variant="body1">{row.fileName}</Typography>,
    },
    {
      flex: 1,
      minWidth: 120,
      field: 'category',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Category / Department'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      sortable: false, // turn off default sorting
      renderCell: ({ row }) => <Typography variant="body1">{row.category}</Typography>,
    },
    {
      flex: 1,
      minWidth: 150,
      field: 'createdAt',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Uploaded On / By'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      sortable: false, // turn off default sorting
      renderCell: ({ row }) => (
        <Stack>
          <Typography variant="body1">{isoDateToReadable(row.createdAt)}</Typography>
          <Typography variant="body1">{`${row.uploadedByName}`.split('(')[0]}</Typography>
        </Stack>
      ),
    },
    {
      flex: 1,
      minWidth: 150,
      field: 'updatedAt',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Last Modified'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      sortable: false, // turn off default sorting
      renderCell: ({ row }) => (
        <Stack>
          <Typography variant="body1">{isoDateToReadable(row.updatedAt)}</Typography>
          <Typography variant="body1">{`${row.updatedByName}`.split('(')[0]}</Typography>
        </Stack>
      ),
    },
    {
      flex: 0.5,
      minWidth: 132,
      field: 'status',
      renderHeader: (params) => (
        <CustomTableHeaderTitle {...params} title={'Status'} colSorting={colSorting} setColSorting={setColSorting} />
      ),
      sortable: false, // turn off default sorting
      renderCell: ({ row }) => {
        const { status } = row
        const statusColors = {
          active: '#0FAA58',
          uploaded: '#0FAA58',
          archived: '#FF8477',
          transcribed: '#FF8477',
          default: '#C4C4C4',
        }
        const normalizedStatus = `${status}`.toLowerCase()
        const statusColor = statusColors[normalizedStatus] || statusColors.default
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <OnlineIcon color={statusColor} />
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 400,
                color: statusColor,
                ml: '12px',
              }}
            >
              {status}
            </Typography>
          </Box>
        )
      },
    },
    {
      flex: 0.5,
      minWidth: 120,
      field: 'customTags',
      align: 'center',
      renderHeader: (params) => (
        <CustomTableHeaderTitle {...params} title={'Flag'} colSorting={colSorting} setColSorting={setColSorting} />
      ),
      sortable: false, // turn off default sorting
      renderCell: ({ row }) => {
        const { customTags } = row
        const flagTag = customTags.find((tag) => tag.toLowerCase().startsWith('flag_'))
        const flag = getFlagFromTag(flagTag)

        return flag ? (
          <Tooltip title={flag.note} placement="top" arrow>
            {/* wrap custom icon in element to make tooltip work */}
            <span>
              <FlagIcon color={theme.palette.flags[flag.color] || theme.palette.secondary.main} />
            </span>
          </Tooltip>
        ) : null
      },
    },
    {
      flex: 0.5,
      minWidth: 70,
      maxWidth: 70,
      sortable: false, // turn off default sorting
      field: 'actions',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Actions',
      renderCell: ({ row }) => <RowOptions row={row} />,
    },
  ]

  return columns
}
