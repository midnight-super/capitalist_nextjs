// ** React Imports
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import OnlineIcon from '@/menu-icons/online';
import { Button, Dialog, DialogContent, Menu, MenuItem } from '@mui/material';
import FileModal from '@/views/componenets/file.modal';
import UploadTranscript from '@/views/events/modals/uploadTranscript';
import { SuccessModal } from '@/views/componenets/successModal';
import AddModal from '@/views/events/modals/addModal';
import Image from 'next/image';
import CustomSwitch from '@/components/CustomSwitch';
import CustomTableHeaderTitle from '@/components/CustomTableHeaderTitle';
import moment from 'moment';
import {
  cancelEvent,
  remove,
  startEvent,
  stopEvent,
} from '@/services/event.service';
import toast from 'react-hot-toast';
import AddBasicModal from './modals/addBasicModal';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import DeleteModal from '../componenets/deleteModal';

export const getColumns = ({
  colSorting,
  setColSorting,
  isMobile,
  fetchEventList,
}) => {
  const RowOptions = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const rowOptionsOpen = Boolean(anchorEl);
    const [transcriptOpen, setTranscriptOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [advanceOpen, setAdvanceOpen] = useState(false);
    const [basicData, setBasicData] = useState(null);
    const [advanceData, setAdvanceData] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isChecked, setIsChecked] = useState(true);
    const [selectedItem, setSelectedItem] = useState(false);
    const [editId, setEditId] = useState(null);
    const [canceledEvent, setCancelEvent] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const router = useRouter();
    const auth = useAuth();
    const handleRowOptionsClick = (event) => {
      setAnchorEl(event.currentTarget);
      event.stopPropagation();
    };

    const handleRowOptionsClose = () => {
      setAnchorEl(null);
    };
    const handleTranscriptOpen = () => {
      setTranscriptOpen(true);
      handleRowOptionsClose();
    };
    const handleTranscriptClose = () => {
      setTranscriptOpen(false);
    };

    const handleViewClose = () => {
      setAdvanceOpen(false);
      setAddOpen(false);
      setBasicData(null);
      setAdvanceData(null);
      setSelectedItem(false);
      setEditId(null);
    };

    const handleOpenEdit = (row) => {
      setAddOpen(true);
      setEditId(row);
      handleRowOptionsClose();
    };
    const handleLiveStream = (row) => {
      localStorage.setItem('streamId', row.streamFileId);
      const url =
        auth.user?.role === 'ENTERPRISEADMIN' ||
        auth.user?.role === 'ENTERPRISESTAFF'
          ? `/admin-editor/${row?.streamKey}/${row?.status}/${row?.meetingId}`
          : `/enduser/${row?.streamKey}/${row?.status}/${row?.meetingId}`;

      window.open(url, '_blank');
    };
    const handleAdvanceAddOpen = () => {
      setAdvanceOpen(true);
      setAddOpen(false);
    };
    const handleViewOpen = (row) => {
      setAddOpen(true);
      setAdvanceOpen(false);
      setSelectedItem(true);
      handleRowOptionsClose();
      setEditId(row);
    };
    const handleBack = () => {
      setAdvanceOpen(false);
      setAddOpen(true);
    };
    const handleStart = async () => {
      const res = await startEvent(row?.eventId);
      if (res === 'OPERATION_SUCCESS') {
        toast.success('Event Start Successfully.');
        fetchEventList();
      }
    };
    const handleStop = async () => {
      const res = await stopEvent(row?.eventId);
      if (res === 'OPERATION_SUCCESS') {
        toast.success('Event Stop Successfully.');
        fetchEventList();
      }
    };

    const handleSwitchChange = (isChecked) => {
      if (isChecked) {
        handleStart();
      } else {
        handleStop();
      }
      handleRowOptionsClose();
    };

    const handleDeleteOpen = () => {
      handleRowOptionsClose();
      setOpenDelete(true);
    };
    const handleDeleteClose = () => {
      setOpenDelete(false);
    };

    const handleDeleteEvent = async () => {
      const res = await remove(row?.eventId);
      if (res === 'OPERATION_SUCCESS') {
        toast.success('Event Deleted Successfully.');
        fetchEventList();
      }
      setOpenDelete(false);
    };

    const handleCancel = async () => {
      handleRowOptionsClose();
      const res = await cancelEvent(row?.eventId);
      if (res === 'OPERATION_SUCCESS') {
        toast.success('Event cancel Successfully.');
        fetchEventList();
      }
    };

    const openCancel = () => {
      setCancelEvent(true);
      setSelectedItem(row?.event);
      handleRowOptionsClose();
    };
    const closeCancel = () => {
      setCancelEvent(false);
      setSelectedItem(null);
    };
    useEffect(() => {
      const handleResize = () => {
        handleRowOptionsClose();
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
    useEffect(() => {
      if (success) {
        const timer = setTimeout(() => {
          setSuccess(false);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }, [success]);

    useEffect(() => {
      const handleScroll = () => {
        const scrollHeight = window.scrollY;
        if (scrollHeight > 0) {
          handleRowOptionsClose();
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
      <>
        <Typography
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          onClick={handleRowOptionsClick}
        >
          <img src="/icons/actionIcon.svg" alt="action" />
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
            onClick={() => handleViewOpen(row)}
          >
            <Typography
              sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}
            >
              View Details
            </Typography>
          </MenuItem>
          <MenuItem
            sx={{ '& svg': { mr: 2 } }}
            onClick={() => handleOpenEdit(row)}
            disabled={
              row?.status === 'LIVE_CAPTION' ||
              row?.status === 'COMPLETED_CAPTION'
            }
          >
            <Typography
              sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}
            >
              Edit Configuration
            </Typography>
          </MenuItem>
          <MenuItem
            sx={{ '& svg': { mr: 2 } }}
            onClick={handleTranscriptOpen}
            disabled={row?.status !== 'COMPLETED_CAPTION'}
          >
            <Typography
              sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}
            >
              Upload Edited Transcript
            </Typography>
          </MenuItem>
          {row?.status !== 'DELETED' && row?.status !== 'CANCELLED' && (
            <MenuItem
              disabled={row?.status === 'COMPLETED_CAPTION'}
              sx={{ '& svg': { mr: 2 } }}
            >
              <Typography
                sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}
              >
                {row?.status === 'PENDING' ? 'Start' : 'Stop'}
              </Typography>
              <CustomSwitch
                disableRipple
                disabled={row?.status === 'COMPLETED_CAPTION'}
                checked={
                  row?.status === 'STREAM_CONNECTED' ||
                  row?.status === 'LIVE_CAPTION' ||
                  row?.status === 'BOT_CONNECTING'
                }
                onChange={() =>
                  handleSwitchChange(row?.status === 'PENDING' ? true : false)
                }
                inputProps={{ 'aria-label': 'controlled' }}
                sx={{ ml: '10px' }}
              />
            </MenuItem>
          )}
          <MenuItem
            sx={{ '& svg': { mr: 2 } }}
            onClick={() => {
              localStorage.removeItem('accessibilitySetting');
              localStorage.removeItem('adminBasicSetting');
              localStorage.removeItem('languageSetting');
              handleLiveStream(row);
            }}
          >
            <Typography
              sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}
            >
              Launch Editor
            </Typography>
          </MenuItem>
          <MenuItem
            disabled={row?.status === 'COMPLETED_CAPTION'}
            onClick={openCancel}
            sx={{ '& svg': { mr: 2 } }}
          >
            <Typography
              sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}
            >
              Cancel Event
            </Typography>
          </MenuItem>
          <MenuItem
            disabled={
              row?.status === 'LIVE_CAPTION' || row?.status === 'DELETED'
            }
            sx={{ '& svg': { mr: 2 } }}
            onClick={() => handleDeleteOpen(row)}
          >
            <Typography
              sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}
            >
              Delete
            </Typography>
          </MenuItem>
        </Menu>
        {transcriptOpen && (
          <UploadTranscript
            open={transcriptOpen}
            close={handleTranscriptClose}
            setSuccess={setSuccess}
            text={
              'Transcript has been uploaded. Do you want to send an Email notification to client?'
            }
          />
        )}
        {success && (
          <SuccessModal open={success} close={() => setSuccess(false)} />
        )}
        {/* {addOpen && <AddModal fetchData={fetchEventList} editData={editId} viewId={selectedItem} open={addOpen} close={handleViewClose} />} */}
        {addOpen && (
          <AddBasicModal
            handleAdvanceAddOpen={handleAdvanceAddOpen}
            fetchData={fetchEventList}
            editData={editId}
            viewId={selectedItem}
            open={addOpen}
            close={handleViewClose}
            savedData={setBasicData}
            basicData={basicData}
            advanceData={advanceData}
          />
        )}
        {advanceOpen && (
          <AddModal
            fetchData={fetchEventList}
            editData={editId}
            viewId={selectedItem}
            open={advanceOpen}
            close={handleViewClose}
            handleBack={handleBack}
            basicData={basicData}
            savedData={setAdvanceData}
            advanceData={advanceData}
          />
        )}
        {canceledEvent && (
          <Dialog
            fullWidth
            open={open}
            maxWidth="md"
            scroll="body"
            onClose={close}
            sx={{ px: '12px' }}
            PaperProps={{
              sx: {
                width: '420px',
                height: '200px',
                boxShadow: 'none',
              },
            }}
            BackdropProps={{
              sx: {
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
              },
            }}
            disableScrollLock={true}
          >
            <DialogContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: '24px',
                py: '0px',
                height: '100%',
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        textAlign: 'center',
                        color: '#212121',
                        fontWeight: 400,
                        lineHeight: '36px',
                        fontSize: '24px',
                      }}
                    >
                      {'Are you sure you want to cancel?'}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    mt: '24px',
                  }}
                >
                  <Button
                    variant="outlined"
                    sx={{
                      textTransform: 'capitalize',
                      color: '#757575',
                      height: '50px',
                      width: '100px',
                      borderRadius: '4px',
                      border: '1px solid #DEE0E4',
                      fontWeight: 700,
                      lineHeight: 'normal',
                    }}
                    onClick={closeCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="contained"
                    sx={{
                      textTransform: 'capitalize',
                      height: '50px',
                      width: '100px',
                      borderRadius: '4px',
                      color: '#fff',
                      fontWeight: 700,
                      lineHeight: 'normal',
                    }}
                  >
                    {'Yes'}
                  </Button>
                </Box>
              </Box>
            </DialogContent>
          </Dialog>
        )}
        {openDelete && (
          <DeleteModal
            text={'event'}
            open={openDelete}
            close={handleDeleteClose}
            deleteClick={handleDeleteEvent}
          />
        )}
      </>
    );
  };
  const FileOptions = ({ row }) => {
    const [fileOpen, setFileOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const handleOpen = (id) => {
      setFileOpen(true);
      setSelectedItem(id);
    };
    const handleClose = () => {
      setFileOpen(false);
      setSelectedItem(null);
    };
    return (
      <>
        <Typography
          sx={{ display: 'flex', alignItems: 'center' }}
          onClick={(event) => {
            handleOpen(row?.id);
            event.stopPropagation();
          }}
        >
          <Image
            style={{ cursor: 'pointer' }}
            width={24}
            height={24}
            src="/icons/fileIcon.svg"
            alt="file"
          />
        </Typography>
        {fileOpen && (
          <FileModal
            data={row}
            status={row?.status}
            open={fileOpen}
            close={handleClose}
          />
        )}
      </>
    );
  };
  const columns = [
    {
      flex: 0.8,
      minWidth: 150,
      field: 'eventName',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Event Name'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const { eventName } = row;
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
            <Typography variant="body1">{eventName}</Typography>
          </Box>
        );
      },
    },
    {
      flex: 0.4,
      minWidth: 115,
      // maxWidth: 130,
      field: 'platform',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Platform'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const { platform } = row;

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
            <Typography
              variant="body1"
              sx={{
                fontWeight: '500',
                color: '#4489FE',
                textTransform: 'capitalize',
              }}
            >
              {platform}
            </Typography>
          </Box>
        );
      },
    },
    {
      flex: 0.7,
      minWidth: 120,
      // maxWidth: 250,
      field: 'time',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Date & Time'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const formattedTime =
          row?.createdAt && moment(row?.createdAt).format('hh:mm A');
        const formattedDate =
          row?.createdAt && moment(row?.createdAt).format('DD MMM YYYY');

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
                  {!isMobile
                    ? formattedDate + ' , ' + formattedTime
                    : formattedDate + ' , '}
                </Typography>
                {isMobile && (
                  <Typography variant="body1" sx={{ color: '#757575' }}>
                    {formattedTime}
                  </Typography>
                )}
              </Box>
            </Box>
          </>
        );
      },
    },
    {
      flex: 0.5,
      minWidth: 150,
      // maxWidth: 220,
      field: 'createdBy',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Created By'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ color: '#757575' }}>
              {row?.createdBy}
            </Typography>
          </Box>
        );
      },
    },
    {
      flex: 0.7,
      minWidth: 120,
      field: 'dueDate',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Due Date'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const formattedTime =
          row?.dueDate && moment(row?.dueDate).format('hh:mm A');
        const formattedDate =
          row?.dueDate && moment(row?.dueDate).format('DD MMM YYYY');
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
                  {!isMobile
                    ? formattedDate + ' , ' + formattedTime
                    : formattedDate + ' , '}
                </Typography>
                {isMobile && (
                  <Typography variant="body1" sx={{ color: '#757575' }}>
                    {formattedTime}
                  </Typography>
                )}
              </Box>
            </Box>
          </>
        );
      },
    },
    {
      flex: 0.5,
      minWidth: 140,
      // maxWidth: 220,
      field: 'status',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Transcription Status'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const { status } = row;
        const statusColor =
          status === 'COMPLETED_CAPTION'
            ? '#0FAA58'
            : status === 'LIVE_CAPTION'
              ? '#4489FE'
              : '#C4C4C4';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <OnlineIcon color={statusColor} />
            <Typography variant="body1" sx={{ color: statusColor, ml: '12px' }}>
              {status === 'LIVE_CAPTION'
                ? 'Live Caption'
                : status === 'COMPLETED_CAPTION'
                  ? 'Completed'
                  : status === 'PENDING'
                    ? 'Pending'
                    : status === 'STREAM_CONNECTED '
                      ? 'Stream Connected'
                      : status === 'CREATED'
                        ? 'Not Started'
                        : status === 'CANCELLED'
                          ? 'Cancelled'
                          : status}
            </Typography>
          </Box>
        );
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
  ];

  return columns;
};
