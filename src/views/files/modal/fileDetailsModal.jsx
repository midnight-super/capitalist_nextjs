import React from 'react';
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Typography,
    IconButton,
    Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { formatFileSize, formatFileType } from '../../../services/file.service';

const FileDetailsModal = ({ open, onClose, file }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            PaperProps={{
                sx: {
                    width: '786px',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 24px',
                    color: '#212121',
                    fontSize: '20px',
                    fontWeight: 600,
                }}
            >
                File Details
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{
                        '&:hover': {
                            '& .MuiSvgIcon-root': {
                                color: '#4489FE'
                            }
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ padding: '43px' }}>
                {/* Main File Details Section */}
                <Box sx={{
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    padding: '24px',
                    mb: 3
                }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#757575',
                            mb: 2,
                            textAlign: 'center'
                        }}
                    >
                        Main File Details
                    </Typography>

                    {/* File Name */}
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            sx={{
                                fontSize: '16px',
                                color: '#212121',
                                fontWeight: 500,
                                mb: 0.5
                            }}
                        >
                            {file?.fileName || 'Invoice_Q1_2024.pdf'}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '12px',
                                color: '#757575',
                            }}
                        >
                            ({formatFileType(file?.mediaType)}, {formatFileSize(file?.size)})
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '24px',
                        '& .MuiTypography-root': {
                            fontSize: '14px',
                        }
                    }}>
                        {/* Left Column */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Uploaded by */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
                                <Typography color="textSecondary">
                                    Uploaded by
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar
                                        src={file?.uploadedBy?.avatar}
                                        sx={{ width: 24, height: 24 }}
                                    />
                                    <Typography>{file?.uploadedBy?.name || 'Serhii Movchan'}</Typography>
                                </Box>
                            </Box>

                            {/* Upload Date */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
                                <Typography color="textSecondary">
                                    Uploaded Date
                                </Typography>
                                <Typography>{file?.uploadDate || '17 Mar 2024, 2:00 PM'}</Typography>
                            </Box>

                            {/* Last Modified By */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
                                <Typography color="textSecondary">
                                    Last Modified by
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar
                                        src={file?.lastModifiedBy?.avatar}
                                        sx={{ width: 24, height: 24 }}
                                    />
                                    <Typography>{file?.lastModifiedBy?.name || 'Vasilii Kovalchuk'}</Typography>
                                </Box>
                            </Box>

                            {/* Last Modified */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
                                <Typography color="textSecondary">
                                    Last Modified
                                </Typography>
                                <Typography>{file?.lastModified || '17 Mar 2024, 2:00 PM'}</Typography>
                            </Box>
                        </Box>

                        {/* Right Column */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Type */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
                                <Typography color="textSecondary">
                                    Type
                                </Typography>
                                <Typography>{formatFileType(file?.mediaType)}</Typography>
                            </Box>

                            {/* Format */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
                                <Typography color="textSecondary">
                                    Format
                                </Typography>
                                <Typography>{file?.mediaType || 'Application/pdf'}</Typography>
                            </Box>

                            {/* Size */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
                                <Typography color="textSecondary">
                                    Size
                                </Typography>
                                <Typography>{formatFileSize(file?.size)}</Typography>
                            </Box>

                            {/* Access Level */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
                                <Typography color="textSecondary">
                                    Access Level
                                </Typography>
                                <Typography>{file?.accessLevel || 'Order, Task, Reseller, Client'}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Linked Resources Section */}
                <Box sx={{
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    padding: '24px'
                }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#757575',
                            mb: 2,
                            textAlign: 'center'
                        }}
                    >
                        Linked Resources
                    </Typography>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '24px',
                        '& .MuiTypography-root': {
                            fontSize: '14px',
                        }
                    }}>
                        {/* Left Column */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Order ID */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
                                <Typography color="textSecondary">
                                    Order ID
                                </Typography>
                                <Typography
                                    sx={{
                                        color: '#4489FE',
                                        cursor: 'pointer',
                                        '&:hover': { textDecoration: 'underline' },
                                    }}
                                >
                                    {file?.orderId || '#2025031'}
                                </Typography>
                            </Box>

                            {/* Supplier/Customer Name */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
                                <Typography color="textSecondary">
                                    Supplier/Customer Name
                                </Typography>
                                <Typography>{file?.customerName || 'John Doe'}</Typography>
                            </Box>

                            {/* Related Resource */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
                                <Typography color="textSecondary">
                                    Related Resource
                                </Typography>
                                <Typography
                                    sx={{
                                        color: '#4489FE',
                                        cursor: 'pointer',
                                        '&:hover': { textDecoration: 'underline' },
                                    }}
                                >
                                    {file?.relatedResource || 'Production Tasks'}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Right Column */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Order Date */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
                                <Typography color="textSecondary">
                                    Order Date
                                </Typography>
                                <Typography>{file?.orderDate || '17 Mar 2024, 2:00 PM'}</Typography>
                            </Box>

                            {/* Delivery Date */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
                                <Typography color="textSecondary">
                                    Delivery Date
                                </Typography>
                                <Typography>{file?.deliveryDate || '19 Mar 2024, 2:00 PM'}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default FileDetailsModal; 