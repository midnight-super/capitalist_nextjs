import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import BoxSvg from '@/menu-icons/box';
import { useRouter } from 'next/router';
import { routeName } from '@/utils';

const RightSidebar = ({ editors, confidenceClrs, isMobile }) => {
  const router = useRouter();
  const route = routeName(router?.pathname);
  function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  function stringAvatar(name) {
    const getInitials = (name) => {
      if (!name) return '??'; // Handle empty cases

      const isEmail = name.includes('@'); // Check if it's an email
      if (isEmail) {
        const cleanName = name.split('@')[0]; // Get the part before '@'
        return cleanName.slice(0, 2).toUpperCase(); // First two letters of the username
      }

      const parts = name.split(' ').filter(Boolean); // Split by space and remove empty parts
      return parts.length > 1
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() // First letter of first & last word
        : parts[0].slice(0, 2).toUpperCase(); // First two letters of a single-word name
    };

    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 32,
        height: 32,
        fontSize: 14,
      },
      children: getInitials(name),
    };
  }

  return (
    <Box
      sx={{
        padding: !isMobile && '28px 0px',
        margin: isMobile && '5px 0px',
        height: '100%',
        maxHeight: isMobile ? 'calc(100vh - 80px)' : 'calc(100vh - 244px)',
        overflowY: 'auto',
      }}
    >
      <Box
        sx={{
          padding: '16px 40px',
        }}
      >
        <Typography
          sx={{
            color: '#212121',
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '20px',
            mb: '16px',
          }}
        >
          Editors
        </Typography>
        <Typography
          sx={{
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          {editors.length > 0 ? (
            <div
              style={{
                display: 'flex',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                padding: '5px',
              }}
            >
              {editors.map((editor, index) => (
                <div
                  key={index}
                  style={{ display: 'inline-block', marginRight: '5px' }}
                >
                  <Avatar {...stringAvatar(editor)} />
                </div>
              ))}
            </div>
          ) : (
            'No Editors Currently Connected !'
          )}
        </Typography>
      </Box>
      {route === 'admin' && (
        <>
          <Divider sx={{ color: '#ECE9E9' }} />
          <Box
            sx={{
              padding: '16px 40px',
            }}
          >
            <Typography
              sx={{
                color: '#212121',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '20px',
                mb: '16px',
              }}
            >
              Confidence Text Colors
            </Typography>
            <Box
              sx={{
                display: 'flex',
                mb: '24px',
              }}
            >
              <Typography
                sx={{
                  pr: '10px',
                }}
              >
                <BoxSvg color={confidenceClrs?.highConfidence || '#FFFFFF'} />
              </Typography>
              <Box>
                <Typography
                  sx={{
                    color: '#212121',
                    fontWeight: 500,
                    fontSize: '14px',
                  }}
                >
                  Very Confident
                </Typography>
                <Typography
                  sx={{
                    color: '#212121',
                    fontSize: '12px',
                    fontWeight: 400,
                    lineHeight: '16px',
                  }}
                >
                  {'95-100% Confidence'}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                mb: '24px',
              }}
            >
              <Typography
                sx={{
                  pr: '10px',
                }}
              >
                <BoxSvg color={confidenceClrs?.mediumConfidence || '#FFFFFF'} />
              </Typography>
              <Box>
                <Typography
                  sx={{
                    color: '#212121',
                    fontWeight: 500,
                    fontSize: '14px',
                  }}
                >
                  Fairly Confident
                </Typography>
                <Typography
                  sx={{
                    color: '#212121',
                    fontSize: '12px',
                    fontWeight: 400,
                    lineHeight: '16px',
                  }}
                >
                  {'85-94% Confidence'}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                mb: '24px',
              }}
            >
              <Typography
                sx={{
                  pr: '10px',
                }}
              >
                <BoxSvg color={confidenceClrs?.lowConfidence || '#FFFFFF'} />
              </Typography>
              <Box>
                <Typography
                  sx={{
                    color: '#212121',
                    fontWeight: 500,
                    fontSize: '14px',
                  }}
                >
                  Slightly Confident
                </Typography>
                <Typography
                  sx={{
                    color: '#212121',
                    fontSize: '12px',
                    fontWeight: 400,
                    lineHeight: '16px',
                  }}
                >
                  {'0-85% Confidence'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default RightSidebar;
