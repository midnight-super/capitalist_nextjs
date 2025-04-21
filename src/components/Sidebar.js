import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import getMenuIcon from '@/menu-icons';
import { useTheme, useMediaQuery } from '@mui/material';
import { handleOrderCreate } from '@/services/order.service';

const Sidebar = ({ isOpen, onClose, menuItems, onMenuSelect }) => {
  const router = useRouter()
  const theme = useTheme()
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'))

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateButton = async () => {
    setIsLoading(true); // Ensure loading state is updated
    try {
      const body = {
        status: 'draft',
        createdAt: new Date().toISOString(),
      };
      const res = await handleOrderCreate(body);
      if (res?.success) {
      } else {
        // toast.error(res || 'Server Error: Failed to fetch');
        router.push(`/order-management/order/${res}/edit`);
      }
    } catch (err) {
      toast.error(err?.message || 'Unexpected Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Drawer
        variant="persistent"
        anchor="left"
        open={true}
        // onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: '110px',
            marginTop: '70px',
            boxSizing: 'border-box',
          },
        }}
      >
        <List
          sx={{
            height: 'calc(100% - 70px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          {menuItems.map((menuItem, index) => {
            const isActive = router.pathname === menuItem?.path
            const isFirstItem = index === 0

            return (
              <Link
                disabled={isLoading}
                onClick={() => {
                  if (menuItem?.title === 'Create Order') {
                    handleCreateButton();
                  }
                }}
                href={menuItem?.path}
                key={index}
                passHref
              >
                <ListItem
                  disablePadding
                  sx={{
                    display: 'flex',
                    width: '100%',
                    height: '80px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '10px',
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: '80px',
                      paddingLeft: '0',
                      paddingRight: '0',
                      overflow: 'hidden',
                    }}
                  >
                    {isFirstItem && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: '50%',
                          width: '40%',
                          height: '1px',
                          backgroundColor: '#DADCE0',
                          transform: 'translateX(-50%)',
                        }}
                      />
                    )}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        width: '40%',
                        height: '1px',
                        backgroundColor: '#DADCE0',
                        transform: 'translateX(-50%)',
                      }}
                    />

                    <Box
                      sx={{
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-10px',
                        width: '15px',
                        height: '100%',
                        background: isActive ? '#4489FE' : 'transparent',
                        borderTopRightRadius: isActive ? 60 : 0,
                        borderBottomRightRadius: isActive ? 60 : 0,
                      }}
                    />
                    <ListItemButton
                      onClick={() => onMenuSelect(menuItem)}
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '12px 0px',
                        color: isActive ? '#4489FE' : 'inherit',
                        width: '100%',
                        marginTop: menuItem?.title === 'Task Types' ? 6 : 0,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: '24px',
                          maxWidth: '24px',
                          marginBottom: '4px',
                          color: isActive ? '#4489FE' : 'inherit',
                        }}
                      >
                        {getMenuIcon({
                          path: menuItem?.icon,
                          color: isActive ? '#4489FE' : '',
                        })}
                      </ListItemIcon>
                      <ListItemText
                        primary={menuItem?.title}
                        primaryTypographyProps={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: isActive ? '#4489FE' : '#767676',
                          textTransform: 'upperCase',
                        }}
                        sx={{ width: '85%' }}
                      />
                    </ListItemButton>
                  </Box>
                </ListItem>
              </Link>
            )
          })}
        </List>
      </Drawer>

      {/* {isTablet && (

        <Drawer
          variant="temporary"
          anchor="left"
          open={isOpen}
          onClose={onClose}
          sx={{
            "& .MuiDrawer-paper": {
              width: isTablet ? "50%" : "7%",
              boxSizing: "border-box",
              ...(isTablet && {
                height: "100%",
                position: "fixed",
              }),
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: '24px 12px' }}>
            <Link href={"/"}>
              <Image width={100} height={40} src="/icons/capitalLogo.svg" alt="logo" />
            </Link>
            <span onClick={onClose} style={{ cursor: 'pointer' }}>
              <img src='/icons/closeIcon.svg' alt='close' />
            </span>
          </Box>
          <List
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: 0,
            }}
          >
            {menuItems.map((menuItem, index) => {
              const isActive = router.pathname === menuItem?.path;
              return (
                <Link href={menuItem?.path} key={index} passHref>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => onMenuSelect(menuItem)}
                      sx={{
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        color: isActive ? "#4489FE" : "#767676",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: "auto",
                          marginBottom: "4px",
                          color: isActive ? "#4489FE" : "inherit",
                        }}
                      >
                        {getMenuIcon({ path: menuItem?.icon, color: isActive ? "#4489FE" : "" })}
                      </ListItemIcon>
                      <ListItemText
                        primary={menuItem?.title}
                        primaryTypographyProps={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: isActive ? "#4489FE" : "#767676",
                          textTransform: "uppercase",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </Link>
              );
            })}
          </List>
        </Drawer>
      )} */}
    </>
  )
}

export default Sidebar
