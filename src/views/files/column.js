// ** React Imports
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import OnlineIcon from '@/menu-icons/online';
import FileFlagIcon from '@/menu-icons/FileFlagIcon';
import { Menu, MenuItem } from '@mui/material';
import { SuccessModal } from '@/views/componenets/successModal';
import FileDetailsModal from '@/views/files/modal/fileDetailsModal';
import EmailSend from '@/views/users/modal/emailModa';
import CustomSwitch from '@/components/CustomSwitch';
import CustomTableHeaderTitle from '@/components/CustomTableHeaderTitle';
import { activate, deactivate, remove } from '@/services/client.service';
import toast from 'react-hot-toast';
import DeleteModal from '../componenets/deleteModal';
import { formatFileSize, formatFileType, downloadFile, previewFile, getFileLink } from '../../services/file.service';
import ShareModal from './modal/shareModal';

export const getColumns = ({
  colSorting,
  setColSorting,
  fetchFileList,
  clientUsers,
  pageNo,
  pageSize,
}) => {
  const RowOptions = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const rowOptionsOpen = Boolean(anchorEl);
    const [emailModal, setEmailModal] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [viewDetailOpen, setViewDetailOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isChecked, setIsChecked] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isView, setIsView] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [shareModal, setShareModal] = useState(false);
    const [shareLink, setShareLink] = useState('');



    const handleRowOptionsClick = (event) => {
      setAnchorEl(event.currentTarget);
      event.stopPropagation();
    };

    const handleRowOptionsClose = () => {
      setAnchorEl(null);
    };

    const handleViewDetailOpen = (id) => {
      setViewDetailOpen(true);
      setSelectedItem(id);
      handleRowOptionsClose();
    };
    const handleViewDetailClose = () => {
      setViewDetailOpen(false);
      setSelectedItem(null);
      setIsView(false);
    };


    const handleDownload = async () => {
      try {
        handleRowOptionsClose();
        await downloadFile(row);
        toast.success('File downloaded successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to download file');
      }
    };

    const handlePreview = async () => {
      try {
        handleRowOptionsClose();
        await previewFile(row);
        toast.success('File opened for preview');
      } catch (error) {
        toast.error(error.message || 'Failed to preview file');
      }
    };

    const handleShareOpen = async () => {
      try {
        handleRowOptionsClose();
        // const response = await getFileLink(row);
        setShareLink("https://www.google.com");
        setShareModal(true);
      } catch (error) {
        toast.error(error.message || 'Failed to generate share link');
      }
    };

    const handleShareClose = () => {
      setShareModal(false);
      setShareLink('');
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
            sx={{ '& svg': { mr: 2 }, py: 1, mb: 0.75 }}
            onClick={() => handleViewDetailOpen(row?.fileId)}
          >
            <Typography
              sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}
            >
              View Details
            </Typography>
          </MenuItem>
          <MenuItem
            sx={{ '& svg': { mr: 2 }, py: 1, mb: 0.75 }}
            onClick={handlePreview}
          >
            <Typography
              sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}
            >
              Preview
            </Typography>
          </MenuItem>
          <MenuItem
            sx={{ '& svg': { mr: 2 }, py: 1, mb: 0.75 }}
            onClick={handleShareOpen}
          >
            <Typography
              sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}
            >
              Share
            </Typography>
          </MenuItem>
          <MenuItem
            sx={{ '& svg': { mr: 2 }, py: 1, mb: 0 }}
            onClick={handleDownload}
          >
            <Typography
              sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}
            >
              Download
            </Typography>
          </MenuItem>
        </Menu>
        {success && (
          <SuccessModal open={success} close={() => setSuccess(false)} />
        )}
        {viewDetailOpen && (
          <FileDetailsModal
            open={viewDetailOpen}
            onClose={handleViewDetailClose}
            file={row}
          />
        )}
        {shareModal && (
          <ShareModal
            open={shareModal}
            onClose={handleShareClose}
            file={row}
            shareLink={shareLink}
          />
        )}
      </>
    );
  };

  const statusColors = {
    "Active": "#0ABF7C",
    "Archived": "#FF9500",
    "Deleted": "#EF4444"
  }

  const columns = [
    {
      flex: 1,
      minWidth: 120,
      field: 'fileName',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'File Name'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const { fileName, mediaType, size } = row;
        const formattedSize = formatFileSize(size);
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            <Typography variant="body1">{fileName}</Typography>
            <Typography
              sx={{
                fontSize: '12px',
                color: '#757575',
              }}
            >
              ({formatFileType(mediaType)}, {formattedSize})
            </Typography>
          </Box>
        );
      },
    },
    {
      flex: 1,
      minWidth: 150,
      field: 'category',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Category/Department'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const { categories } = row;
        const category = categories?.join(', ');
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
                fontWeight: 500,
                color: '#4489FE',
              }}
            >
              {!!category ? category : 'Ordering'}
            </Typography>
          </Box>
        );
      },
    },
    {
      flex: 1,
      minWidth: 150,
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
        const { createdAt } = row;
        const createdDate = !!createdAt ? moment(createdAt).format('DD MMM YYYY, h:mm A') : "02 Feb 2024, 2:00 PM";
        return (
          <Box
            sx={{
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
                color: '#7C7C7C',
              }}
            >
              {createdDate}
            </Typography>
          </Box>
        );
      },
    },
    {
      flex: 1,
      minWidth: 150,
      field: 'lastModified',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Last Modified'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const { updatedAt } = row;
        const updatedDate = !!updatedAt ? moment(updatedAt).format('DD MMM YYYY, h:mm A') : "02 Feb 2024, 2:00 PM";
        return (
          <Box
            sx={{
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
                color: '#7C7C7C',
              }}
            >
              {updatedDate}
            </Typography>
          </Box>
        );
      },
    },
    {
      flex: 0.5,
      minWidth: 120,
      field: 'status',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Status'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const { status } = row;
        const _status = "Archived";
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <OnlineIcon color={statusColors[_status]} />
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 400,
                color: statusColors[_status],
                ml: 1.5,
              }}
            >
              {_status}
            </Typography>
          </Box>
        );
      },
    },
    {
      flex: 0.5,
      minWidth: 120,
      field: 'flag',
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Flags'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      headerAlign: 'start',
      align: 'start',
      sortable: false,
      renderCell: ({ row }) => {
        const { status } = row;
        const _status = "Archived";
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FileFlagIcon color={statusColors[_status]} />
          </Box>
        );
      },
    },
    {
      flex: 0.5,
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
