import { createTheme } from '@mui/material/styles'

// Excerpts from color palette from the Capital Typing Admin Site Figma
// https://www.figma.com/design/NhSpseZGcH25ZOpQIJe0Bg/Real-Time-Transcription--12-16-?node-id=332-4999&t=YrFMg5wevuG6KE8w-1
const ctColors = {
  primaryBlue50: '#DFEBFE',
  primaryBlue200: '#D6E7FF',
  primaryBlue400: '#639CFE',
  primaryBlue500: '#4489FE',
  primaryBlue600: '#3872D3',
  primaryBlue800: '#22447F',
  primaryBlue950: '#0B162A',

  neutral50: '#FFFFFF',
  neutral75: '#DEE0E4',
  neutral100: '#E7E7E7',
  neutral200: '#DCDCDC',
  neutral400: '#7C7C7C',
  neutral450: '#757575',
  neutral500: '#6D6D6D',
  neutral750: '#757575',
  neutral800: '#454545',
  neutral900: '#3D3D3D',
  neutral950: '#212121',

  red500: '#EF4444',
  red600: '#e64e18',
  green500: '#0ABF7C',
  green200: '#C7F3E3',
  green600: '#0AAE71',
  green50: '#EBFEF4',
  yellow500: '#FF9500',
  yellow200: '#FFE5B8',
}

const theme = createTheme({
  palette: {
    primary: {
      main: ctColors.primaryBlue500,
      light: ctColors.primaryBlue400,
      dark: ctColors.primaryBlue600,
      contrastText: ctColors.primaryBlue950,
    },
    secondary: {
      main: ctColors.neutral950,
      light: ctColors.neutral200,
      dark: ctColors.neutral800,
      contrastText: ctColors.neutral950,
    },
    error: {
      main: ctColors.red500,
    },
    warning: {
      main: ctColors.yellow500,
    },
    info: {
      main: ctColors.primaryBlue500,
    },
    success: {
      main: ctColors.green500,
      light: ctColors.green50,
    },
    textBackgroundColors: {
      neutral50: ctColors.neutral50,
      neutral75: ctColors.neutral75,
      neutral100: ctColors.neutral100,
      neutral200: ctColors.neutral200,
      neutral400: ctColors.neutral400,
      neutral500: ctColors.neutral500,
      neutral750: ctColors.neutral750,
      neutral800: ctColors.neutral800,
      neutral900: ctColors.neutral900,
      neutral950: ctColors.neutral950,
    },
    // app specific custom colors (light,dark, etc. are NOT auto-calculated)
    // https://mui.com/material-ui/customization/palette/#custom-colors
    background: {
      main: ctColors.neutral50,
    },
    flags: {
      red: ctColors.red500,
      yellow: ctColors.yellow500,
      green: ctColors.green500,
      blue: ctColors.primaryBlue500,
    },
    status: {
      ASSIGNED: ctColors.green500, // success.main
      Production: ctColors.primaryBlue500, // info.main
      '-': ctColors.green500, // success.main
      string: ctColors.yellow500, // warning.main
      CREATED: ctColors.yellow500, // warning.main
      null: ctColors.yellow500, // warning.main
    },
    statusBackground: {
      ASSIGNED: ctColors.green200, // success.main
      Production: ctColors.primaryBlue200, // info.main
      '-': ctColors.green200, // success.main
      string: ctColors.yellow200, // warning.main
      CREATED: ctColors.yellow200, // warning.main
      null: ctColors.yellow200, // warning.main
    },
    custom: {
      neutral450: ctColors.neutral450,
    },
    actionColors: {
      add: ctColors.green500,
      addHover: ctColors.green600,
      delete: ctColors.red500,
      deleteHover: ctColors.red600,
      contrastText: ctColors.neutral50,
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    color: ctColors.neutral950,

    h1: {
      fontSize: '1.5rem', // 24px
      fontWeight: 400,
      lineHeight: '2rem', // 32px
    },
    h2: {
      fontSize: '1.125rem', // 18px
      fontWeight: 600,
    },
    h3: {
      fontSize: '1rem', // 16px
      fontWeight: 400,
    },
    h4: {
      fontSize: '0.75rem', // 12px
      fontWeight: 500,
    },
    body1: {
      fontWeight: 400,
      fontSize: '0.875rem', // 14px
      lineHeight: '1.25rem', // 20px
    },
    body2: {
      fontSize: '0.875rem', // 14px
      fontWeight: 600,
    },
    // TODO: Use MUI text buttons and stop reinventing the wheel!
    //       https://mui.com/material-ui/react-button/#text-button
    //
    // used for text buttons made with Box and Typography
    buttonLabel: {
      fontWeight: 400,
      fontSize: '14px',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          zIndex: 1000,
          height: '70px',
          boxShadow: 'none',
          borderBottomWidth: '1px',
          borderColor: ctColors.neutral200,
          backgroundColor: 'white',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: 'normal',
          textTransform: 'capitalize',
        },
        contained: {
          color: ctColors.neutral50,
          height: '50px',
          width: '200px',
          borderRadius: '4px',
        },
        text: {
          width: 'auto',
          height: 'auto',
        },
        outlined: {
          height: '50px',
          width: '200px',
          borderRadius: '4px',
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true, // Disable ripple globally for all buttons
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { variant: 'details' },
              style: {
                borderColor: ctColors.neutral200,
                borderStyle: 'solid',
                borderWidth: '1px',
                borderRadius: '4px',

                marginBottom: '24px',
              },
            },
          ],
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { variant: 'details' },
              style: {
                textAlign: 'center',
                color: ctColors.neutral400,

                '& .MuiCardHeader-title': {
                  fontSize: '14px',
                  fontWeight: 600,
                },
              },
            },
          ],
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: ctColors.primaryBlue50,
          color: ctColors.primaryBlue500,

          height: '28px',
          fontSize: '12px',
          lineHeight: 'normal',
          fontWeight: 400,

          borderRadius: '3px',

          '& .MuiChip-deleteIcon': {
            color: ctColors.primaryBlue500,
            fontSize: '16px',
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${ctColors.neutral200}`,
          marginBottom: '24px',
        },
      },
    },
    MuiIconButton: {
      variants: [
        {
          props: { variant: 'addAction' },
          style: ({ theme }) => ({
            backgroundColor: theme.palette.actionColors.add,
            color: theme.palette.actionColors.contrastText,
            width: '25px',
            height: '25px',
            borderRadius: '50%',
            padding: '12px',
            '&:hover': {
              backgroundColor: theme.palette.actionColors.addHover,
            },
            '& .MuiSvgIcon-root': {
              fontSize: '20px',
              fontWeight: 'bold',
            },
          }),
        },
        {
          props: { variant: 'deleteAction' },
          style: ({ theme }) => ({
            backgroundColor: theme.palette.actionColors.delete,
            color: theme.palette.actionColors.contrastText,
            width: '25px',
            height: '25px',
            borderRadius: '50%',
            padding: '12px',
            '&:hover': {
              backgroundColor: theme.palette.actionColors.deleteHover,
            },
            '& .MuiSvgIcon-root': {
              fontSize: '20px',
              fontWeight: 'bold',
            },
          }),
        },
      ],
    },
    MuiLink: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          textDecoration: 'none',
          color: ctColors.neutral950,
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: '10px',
          color: ctColors.neutral450,
          textTransform: 'uppercase',
        },
      },
    },
    MuiStack: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { variant: 'vertical' },
              style: {
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 100,
                background: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100px',
                height: '100vh',

                '& .MuiTabs-root': {
                  margin: '64px 0',
                },
                '& .MuiTab-root': {
                  padding: 8,
                },

                '& .MuiTabs-indicator': {
                  left: 0,
                  width: '5px',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                },
              },
            },
            {
              props: { variant: 'horizontal' },
              style: {
                position: 'fixed',
                bottom: 0,
                left: 0,
                zIndex: 100,
                background: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100vw',
                height: '88px',
              },
            },
          ],
        },
      },
    },
  },
})

export default theme
