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
import BoxSvg from '@/menu-icons/box';

export const getColumns = ({ handleFormOpen, fetchEventList }) => {
  const RowOptions = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const rowOptionsOpen = Boolean(anchorEl);
    const [transcriptOpen, setTranscriptOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isChecked, setIsChecked] = useState(true);
    const [selectedItem, setSelectedItem] = useState(false);
    const [editId, setEditId] = useState(null);
    const [canceledEvent, setCancelEvent] = useState(false);

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

    const handleViewOpen = (row) => {
      setAddOpen(true);
      setSelectedItem(true);
      handleRowOptionsClose();
      setEditId(row);
    };
    const handleViewClose = () => {
      setAddOpen(false);
      setSelectedItem(false);
      setEditId(null);
    };

    const handleOpenEdit = (row) => {
      setAddOpen(true);
      setEditId(row);
      handleRowOptionsClose();
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
      if (isChecked === true) {
        handleStop();
      } else {
        handleStart();
      }
      handleRowOptionsClose();
    };
    const handleDeleteEvent = async (row) => {
      handleRowOptionsClose();
      const res = await remove(row?.eventId);
      if (res === 'OPERATION_SUCCESS') {
        toast.success('Event Deleted Successfully.');
        fetchEventList();
      }
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
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <Typography
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            onClick={() => handleFormOpen(row?.id)}
          >
            <img
              style={{
                paddingRight: '8px',
              }}
              src="/icons/edit.svg"
              alt="edit"
            />
          </Typography>
          <Typography
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <img src="/icons/delete.svg" alt="delete" />
          </Typography>
        </Box>
      </>
    );
  };

  const columns = [
    {
      flex: 0.2,
      minWidth: 100,
      field: 'themeName',
      headerAlign: 'start',
      align: 'start',
      headerName: 'Theme Name',
      sortable: false,
      renderCell: ({ row }) => {
        const { themeName } = row;
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
              sx={{
                color: '#212121',
                fontSize: '12px',
                fontWeight: 400,
                lineHeight: '20px',
              }}
            >
              {themeName}
            </Typography>
          </Box>
        );
      },
    },
    {
      flex: 0.3,
      minWidth: 140,
      field: 'fontFamily',
      headerName: 'Font Family',
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const { fontFamily } = row;

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
              sx={{
                color: '#212121',
                fontSize: '12px',
                fontWeight: 400,
                lineHeight: '20px',
              }}
            >
              {fontFamily}
            </Typography>
          </Box>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 60,
      field: 'fontSize',
      headerName: 'Font Size',
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
                justifyContent: 'start',
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: '#212121',
                    fontSize: '12px',
                    fontWeight: 400,
                    lineHeight: '20px',
                  }}
                >
                  {row?.fontSize}
                </Typography>
              </Box>
            </Box>
          </>
        );
      },
    },
    {
      minWidth: 110,
      maxWidth: 110,
      field: 'fontColor',
      headerName: 'Font Color',
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BoxSvg height={'24px'} width={'24px'} color={row?.fontColor} />
            <Typography
              sx={{
                ml: '5px',
                color: '#212121',
                fontSize: '12px',
                fontWeight: 400,
                lineHeight: '20px',
              }}
            >
              {row?.fontColor}
            </Typography>
          </Box>
        );
      },
    },
    {
      // flex: 0.2,
      minWidth: 120,
      maxWidth: 120,
      field: 'backgroundColor',
      headerName: 'Background Color',
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
              <BoxSvg
                height={'24px'}
                width={'24px'}
                color={row?.backgroundColor}
              />
              <Typography
                sx={{
                  ml: '5px',
                  color: '#212121',
                  fontSize: '12px',
                  fontWeight: 400,
                  lineHeight: '20px',
                }}
              >
                {row?.backgroundColor}{' '}
              </Typography>
            </Box>
          </>
        );
      },
    },

    //         {
    //             minWidth: 70,
    //             maxWidth: 70,
    //             sortable: false,
    //             field: 'actions',
    //             align: 'center',
    //             headerAlign: 'center',
    //             headerName: 'Actions',
    //             renderCell: ({ row }) => <RowOptions row={row} />
    //
    //         },
  ];

  return columns;
};
