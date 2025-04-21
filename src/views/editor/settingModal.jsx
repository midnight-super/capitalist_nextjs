import React, { useState } from 'react';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import BasicSettings from './basicSetting';
import EditTheme from './editTheme';
import ThemeModal from './themeModal';
import UserSettings from './userSettings';
import OutputLanguage from './userSettings/language';
import { useRouter } from 'next/router';
import { routeName } from '@/utils';

const AdminSettingModal = ({
  open,
  close,
  confidenceClrs,
  setConfidenceClrs,
}) => {
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
    setFormOpen(false);
    setEditId(null);
  };
  const router = useRouter();
  const route = routeName(router?.pathname);
  const tabNames =
    route === 'user'
      ? ['Accessibility', 'Output Language']
      : route === 'editor'
        ? ['Basic Settings', 'Accessibility', 'Output Language']
        : ['Basic Settings'];
  const handleClose = () => {
    close();
    setEditId(null);
    setFormOpen(false);
  };
  const handleFormOpen = (id) => {
    setFormOpen(true);
    setEditId(id);
  };
  const theme = useTheme();
  const isSmall = useMediaQuery('(max-width:768px)');
  const isMedium = useMediaQuery('(max-width:1008px)');
  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      PaperProps={{
        sx: {
          display: 'flex',
          flexDirection: 'row',
          width: '981px !important',
          minHeight: '572px',
          maxHeight: '572px',
          boxShadow: 'none',
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        },
      }}
      disableScrollLock
    >
      <DialogContent sx={{ p: 0, height: '100%', display: 'flex' }}>
        {loading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <CircularProgress />
          </div>
        )}

        <Box sx={{ display: 'flex', width: '100%', height: '572px' }}>
          {/* Left Side (Fixed) */}
          <Box
            sx={{
              height: '100%',
              width: isSmall ? '150px !important' : '286px !important',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              borderRight: '1px solid #ECE9E9',
            }}
          >
            <Typography
              sx={{
                pt: '19px',
                fontWeight: 700,
                fontSize: '18px',
                paddingBottom: '19px',
                px: '30px',
                color: '#212121',
              }}
            >
              {'Settings'}
            </Typography>
            <Divider />
            <Tabs
              orientation="vertical"
              value={tabIndex}
              onChange={handleTabChange}
              aria-label="settings tabs"
              sx={{
                pt: '21px',
                color: '#212121',
                background: '#F8FAFF',
                height: '100%',
                width: isSmall ? '150px !important' : '286px !important',

                '& .MuiTabs-indicator': {
                  display: 'none', // Removes the default indicator
                },
                '& .Mui-selected': {
                  color: '#212121 !important',
                  backgroundColor: '#DEEAFE', // Highlight for selected tab
                },
              }}
            >
              {tabNames.map((val, index) => (
                <Tab
                  sx={{
                    textAlign: 'start', // Ensures the text is aligned left
                    textTransform: 'capitalize', // Removes uppercase transformation
                    color: '#212121',
                    height: '50px', // Sets tab height
                    paddingLeft: '30px', // Optional: Adds padding for visual spacing
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'start',
                  }}
                  key={index}
                  label={val}
                />
              ))}
            </Tabs>
          </Box>

          {/* Right Side (Scrollable) */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'hidden',
              height: '100%',
            }}
          >
            <Typography
              sx={{
                pl: '44px',
                pt: '19px',
                marginBottom: '19px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '18px',
                  color: formOpen ? '#7C7C7C' : '#212121',
                }}
              >
                {tabNames[tabIndex]}
              </Typography>
              {tabIndex === 1 && route === 'admin' && formOpen && (
                <Typography
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <img src="/icons/forward.svg" alt="" />

                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '18px',
                      color: '#212121',
                    }}
                  >
                    {editId ? 'Edit' : 'Add'} Theme
                  </Typography>
                </Typography>
              )}
            </Typography>
            <Divider />
            <Box
              sx={{
                display:
                  (route === 'editor' && tabIndex === 0) ||
                  (route === 'editor' && tabIndex === 1) ||
                  (route === 'user' && tabIndex === 0) ||
                  (route === 'admin' && tabIndex === 0)
                    ? 'block'
                    : 'none',
                padding:
                  (route === 'user' && tabIndex === 1) ||
                  (route === 'editor' && tabIndex === 1) ||
                  (route === 'user' && tabIndex === 0) ||
                  (route === 'user' && tabIndex === 0)
                    ? '63px 63px 48px 43px'
                    : '24px 63px 48px 43px',
              }}
            >
              {route === 'user' && tabIndex === 0 ? (
                <UserSettings close={close} />
              ) : route === 'editor' && tabIndex === 1 ? (
                <UserSettings close={close} />
              ) : route === 'editor' && tabIndex === 0 ? (
                <BasicSettings close={handleClose} />
              ) : (
                <BasicSettings
                  close={handleClose}
                  confidenceClrs={confidenceClrs}
                  setConfidenceClrs={setConfidenceClrs}
                />
              )}
            </Box>
            <Box
              sx={{
                height: '100%',
                display:
                  (route === 'admin' && tabIndex === 1) ||
                  (route === 'user' && tabIndex === 1) ||
                  (route === 'editor' && tabIndex === 2)
                    ? 'block'
                    : 'none',
                padding:
                  formOpen || route === 'user' || route === 'editor'
                    ? '63px 63px 48px 43px'
                    : '28px 23px',
              }}
            >
              {route === 'user' || route === 'editor' ? (
                <OutputLanguage editId={editId} close={close} />
              ) : formOpen ? (
                <ThemeModal close={() => setFormOpen(false)} editId={editId} />
              ) : (
                <EditTheme handleFormOpen={handleFormOpen} />
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSettingModal;
