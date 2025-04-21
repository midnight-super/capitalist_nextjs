import { Box, CircularProgress } from '@mui/material'
import React from 'react'

const CustomLoading = () => {
    return (
        <Box sx={{
            width: {
                xs: '100%',
                lg: 'calc(100% + 110px)'
            },
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
        }}>
            <CircularProgress />
        </Box>
    )
}

export default CustomLoading