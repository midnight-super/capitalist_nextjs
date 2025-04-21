// ** React Imports
import CustomTableHeaderTitle from '@/components/CustomTableHeaderTitle'
import { useAuth } from '@/hooks/useAuth'
import OnlineIcon from '@/menu-icons/online'
import FileModal from '@/views/componenets/file.modal'
import { Menu, MenuItem } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export const getColumns = ({ colSorting, setColSorting, isMobile, fetchEventList }) => {
  const RowOptions = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const rowOptionsOpen = Boolean(anchorEl)
    // const [transcriptOpen, setTranscriptOpen] = useState(false);
    // const [addOpen, setAddOpen] = useState(false);
    // const [advanceOpen, setAdvanceOpen] = useState(false);
    // const [basicData, setBasicData] = useState(null);
    // const [advanceData, setAdvanceData] = useState(null);
    const [success, setSuccess] = useState(false)
    // const [isChecked, setIsChecked] = useState(true);
    // const [selectedItem, setSelectedItem] = useState(false);
    // const [editId, setEditId] = useState(null);
    // const [canceledEvent, setCancelEvent] = useState(false);
    const router = useRouter()
    // const auth = useAuth();
    const handleRowOptionsClick = (event) => {
      setAnchorEl(event.currentTarget)
      event.stopPropagation()
    }

    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }

    // const handleTranscriptOpen = () => {
    //   setTranscriptOpen(true);
    //   handleRowOptionsClose();
    // };

    // const handleTranscriptClose = () => {
    //   setTranscriptOpen(false);
    // };

    // const handleViewClose = () => {
    //   setAdvanceOpen(false);
    //   setAddOpen(false);
    //   setBasicData(null);
    //   setAdvanceData(null);
    //   setSelectedItem(false);
    //   setEditId(null);
    // };

    // const handleOpenEdit = (row) => {
    //   setAddOpen(true);
    //   setEditId(row);
    //   handleRowOptionsClose();
    // };

    // const handleAdvanceAddOpen = () => {
    //   setAdvanceOpen(true);
    //   setAddOpen(false);
    // };

    // const handleViewOpen = (row) => {
    //   setAddOpen(true);
    //   setAdvanceOpen(false);
    //   setSelectedItem(true);
    //   handleRowOptionsClose();
    //   setEditId(row);
    // };

    // const handleBack = () => {
    //   setAdvanceOpen(false);
    //   setAddOpen(true);
    // };

    // const handleStart = async () => {
    //   const res = await startEvent(row?.eventId);
    //   if (res === 'OPERATION_SUCCESS') {
    //     toast.success('Event Start Successfully.');
    //     fetchEventList();
    //   }
    // };

    // const handleStop = async () => {
    //   const res = await stopEvent(row?.eventId);
    //   if (res === 'OPERATION_SUCCESS') {
    //     toast.success('Event Stop Successfully.');
    //     fetchEventList();
    //   }
    // };

    // const handleSwitchChange = (isChecked) => {
    //   if (isChecked === true) {
    //     handleStop();
    //   } else {
    //     handleStart();
    //   }
    //   handleRowOptionsClose();
    // };

    // const handleDeleteEvent = async (row) => {
    //   handleRowOptionsClose();
    //   const res = await remove(row?.eventId);
    //   if (res === 'OPERATION_SUCCESS') {
    //     toast.success('Event Deleted Successfully.');
    //     fetchEventList();
    //   }
    // };

    // const handleCancel = async () => {
    //   handleRowOptionsClose();
    //   const res = await cancelEvent(row?.eventId);
    //   if (res === 'OPERATION_SUCCESS') {
    //     toast.success('Event cancel Successfully.');
    //     fetchEventList();
    //   }
    // };

    // const openCancel = () => {
    //   setCancelEvent(true);
    //   setSelectedItem(row?.event);
    //   handleRowOptionsClose();
    // };
    // const closeCancel = () => {
    //   setCancelEvent(false);
    //   setSelectedItem(null);
    // };

    useEffect(() => {
      const handleResize = () => {
        handleRowOptionsClose()
      }

      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, [])
    useEffect(() => {
      if (success) {
        const timer = setTimeout(() => {
          setSuccess(false)
        }, 2000)

        return () => clearTimeout(timer)
      }
    }, [success])

    useEffect(() => {
      const handleScroll = () => {
        const scrollHeight = window.scrollY
        if (scrollHeight > 0) {
          handleRowOptionsClose()
        }
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
      <>
        <Typography sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={handleRowOptionsClick}>
          <img style={{ width: '24px' }} src="/icons/actionIcon.svg" alt="action" />
        </Typography>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          open={rowOptionsOpen}
          onClose={handleRowOptionsClose}
          disableScrollLock={true}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            zIndex: 1,
            mt: '10px',
            '& .MuiPaper-root': {
              width: '207px',
              fontSize: '15px',
              color: '#212121',
              boxShadow: ' 0px 0px 4px 0px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          <MenuItem
            sx={{ '& svg': { mr: 2 } }}
            onClick={() => router.push(`/order-management/order/${row?.id}/edit`)}
            // disabled={
            //   row?.status === 'LIVE_CAPTION' ||
            //   row?.status === 'COMPLETED_CAPTION'
            // }
          >
            <Typography sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}>View Details</Typography>
          </MenuItem>
          {/* <MenuItem sx={{ '& svg': { mr: 2 } }}>
            <Typography
              sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}
            >
              Manage Jobs
            </Typography>
          </MenuItem>
          <MenuItem sx={{ '& svg': { mr: 2 } }}>
            <Typography
              sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}
            >
              Manage Files
            </Typography>
          </MenuItem>
          <MenuItem sx={{ '& svg': { mr: 2 } }}>
            <Typography
              sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}
            >
              View Details
            </Typography>
          </MenuItem> */}
          <MenuItem sx={{ '& svg': { mr: 2 } }}>
            <Typography sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}>Cancel Order</Typography>
          </MenuItem>
        </Menu>
      </>
    )
  }

  const FileOptions = ({ row }) => {
    const [fileOpen, setFileOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const handleOpen = (id) => {
      setFileOpen(true)
      setSelectedItem(id)
    }
    const handleClose = () => {
      setFileOpen(false)
      setSelectedItem(null)
    }
    return (
      <>
        <Typography
          sx={{ display: 'flex', alignItems: 'center' }}
          onClick={(event) => {
            handleOpen(row?.id)
            event.stopPropagation()
          }}
        >
          <Image style={{ cursor: 'pointer' }} width={24} height={24} src="/icons/fileIcon.svg" alt="file" />
        </Typography>
        {fileOpen && <FileModal data={row} status={row?.status} open={fileOpen} close={handleClose} />}
      </>
    )
  }

  const columns = [
    {
      flex: 0.8,
      minWidth: 100,
      maxWidth: 100,
      field: 'orderId',
      renderHeader: (params) => (
        <CustomTableHeaderTitle {...params} title={'Order ID'} colSorting={colSorting} setColSorting={setColSorting} />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const { orderSequencer } = row
        return (
          <Box
            sx={{
              // display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            <Typography variant="body1">{orderSequencer === 'DRAFT' ? '--' : orderSequencer}</Typography>
          </Box>
        )
      },
    },
    {
      flex: 0.4,
      minWidth: 300,
      // maxWidth: 130,
      field: 'clientName',
      renderHeader: (params) => (
        <CustomTableHeaderTitle {...params} title={'Client'} colSorting={colSorting} setColSorting={setColSorting} />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const { clientName, clientEmail, clientAvatar } = row
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            {/* Client Image */}
            <Box
              component="img"
              src={!clientAvatar ? '/images/avatar-placeholder.png' : clientAvatar}
              alt={clientName}
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                marginRight: 2,
              }}
            />
            {/* Client Info */}
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: '400',
                  color: '#212121',
                  textTransform: 'capitalize',
                }}
              >
                {clientName ? clientName : '--'}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#BDBDBD',
                }}
              >
                {clientEmail ? clientEmail : '--'}
              </Typography>
            </Box>
          </Box>
        )
      },
    },
    {
      flex: 0.7,
      minWidth: 150,
      // maxWidth: 250,
      field: 'orderServices',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Service Type'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        return (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#4489FE',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                  }}
                >
                  Standard Transcription
                </Typography>
              </Box>
            </Box>
          </>
        )
      },
    },
    {
      flex: 0.7,
      minWidth: 120,
      // maxWidth: 250,
      field: 'createdAt',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Created Date'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const formattedTime = row?.createdAt && moment(row?.createdAt).format('hh:mm A')
        const formattedDate = row?.createdAt && moment(row?.createdAt).format('DD MMM YYYY')

        return (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#757575',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                  }}
                >
                  {!isMobile ? formattedDate + ' , ' + formattedTime : formattedDate + ' , '}
                </Typography>
                {isMobile && (
                  <Typography variant="body1" sx={{ color: '#757575' }}>
                    {formattedTime}
                  </Typography>
                )}
              </Box>
            </Box>
          </>
        )
      },
    },
    {
      flex: 0.7,
      minWidth: 120,
      field: 'dueDate',
      renderHeader: (params) => (
        <CustomTableHeaderTitle {...params} title={'Due Date'} colSorting={colSorting} setColSorting={setColSorting} />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const { dueDate } = row
        if (!dueDate) return '--'
        const formattedTime = row?.dueDate && moment(row?.dueDate).format('hh:mm A')
        const formattedDate = row?.dueDate && moment(row?.dueDate).format('DD MMM YYYY')
        return (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#757575',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                  }}
                >
                  {!isMobile ? formattedDate + ' , ' + formattedTime : formattedDate + ' , '}
                </Typography>
                {isMobile && (
                  <Typography variant="body1" sx={{ color: '#757575' }}>
                    {formattedTime}
                  </Typography>
                )}
              </Box>
            </Box>
          </>
        )
      },
    },
    {
      flex: 0.5,
      minWidth: 140,
      // maxWidth: 220,
      field: 'status',
      renderHeader: (params) => (
        <CustomTableHeaderTitle {...params} title={'Status'} colSorting={colSorting} setColSorting={setColSorting} />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const { status } = row
        const statusColor =
          status === 'DRAFT'
            ? '#4489FE'
            : status === 'PENDING_APPROVAL'
              ? '#757575'
              : status === 'Unassigned'
                ? '#E9B80C'
                : status === 'APPROVED'
                  ? '#0FAA58'
                  : status === 'CANCELLED'
                    ? '#FF8477'
                    : ''
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <OnlineIcon color={statusColor} />
            <Typography variant="body1" sx={{ color: statusColor, ml: '12px' }}>
              {status === 'PRODUCTION'
                ? 'Production'
                : status === 'NOT_CONFIRMED'
                  ? 'Not Confirmed'
                  : status === 'UN_ASSIGNED'
                    ? 'Un assigned'
                    : status === 'COMPLETE '
                      ? 'Complete'
                      : status === 'CANCELLED'
                        ? 'Cancelled'
                        : status}
            </Typography>
          </Box>
        )
      },
    },
    {
      flex: 0.2,
      minWidth: 90,
      maxWidth: 100,
      field: 'files',
      headerName: (
        <Typography
          sx={{
            fontSize: '12px',
            color: '#212121',
            fontWeight: '500',
            lineHeight: 'normal',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
          }}
        >
          {'Files'}
        </Typography>
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => <FileOptions row={row} />,
    },
    {
      flex: 0.2,
      minWidth: 70,
      maxWidth: 70,
      sortable: false,
      field: 'actions',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Actions',
      renderCell: ({ row }) => <RowOptions row={row} />,
    },
  ]

  return columns
}
