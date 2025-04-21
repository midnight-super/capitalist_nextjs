import CustomTable from '@/components/CustomTable';
import {
  Box,
  Button,
  Grid2,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { getColumns } from './column';
import { DataGrid } from '@mui/x-data-grid';
import CustomPagination from '@/components/customPagination';
const EditTheme = ({ handleFormOpen }) => {
  const [pageSize, setPageSize] = useState(25);
  const [pageNo, setPageNo] = useState(0);

  const columns = getColumns({ handleFormOpen });
  const data = [
    // {
    //     "id": 1,
    //     "themeName": "Custom",
    //     "fontFamily": "Times New Roman",
    //     "fontSize": "18",
    //     "fontColor": "#212121",
    //     "backgroundColor": "#FFFFFF"
    // },
    {
      id: 2,
      themeName: 'Classic Light',
      fontFamily: 'Arial',
      fontSize: '16',
      fontColor: '#000000',
      backgroundColor: '#FFFFFF',
    },
    {
      id: 3,
      themeName: 'Midnight Dark',
      fontFamily: 'Helvetica',
      fontSize: '16',
      fontColor: '#FFFFFF',
      backgroundColor: '#000000',
    },
    {
      id: 4,
      themeName: 'High Contrast',
      fontFamily: 'Verdana',
      fontSize: '18',
      fontColor: '#FFFF00',
      backgroundColor: '#000000',
    },
    {
      id: 5,
      themeName: 'Sunny Day',
      fontFamily: 'Arial',
      fontSize: '16',
      fontColor: '#0000CC',
      backgroundColor: '#FFFF99',
    },
    {
      id: 6,
      themeName: 'Cool Breeze',
      fontFamily: 'Helvetica',
      fontSize: '16',
      fontColor: '#990000',
      backgroundColor: '#CCFFFF',
    },
    {
      id: 7,
      themeName: 'Monochrome',
      fontFamily: 'Verdana',
      fontSize: '16',
      fontColor: '#000000',
      backgroundColor: '#FFFFFF',
    },
    {
      id: 8,
      themeName: 'Gentle Gray',
      fontFamily: 'Arial',
      fontSize: '18',
      fontColor: '#000000',
      backgroundColor: '#D3D3D3',
    },
    {
      id: 9,
      themeName: 'Dyslexia-Friendly',
      fontFamily: 'OpenDyslexic',
      fontSize: '16',
      fontColor: '#333333',
      backgroundColor: '#F5F5DC',
    },
  ];
  const handlePageChange = (event, value) => {
    setPageNo(value - 1);
    // setClientUsers([])
  };
  const isMedium = useMediaQuery('(max-width:995px)');
  return (
    <>
      {/* <Box
                onClick={() => handleFormOpen(null)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: '28px',
                }}>
                <img style={{
                    cursor: 'pointer',

                }} src='/icons/add_circle.svg' alt='' />
                <Typography sx={{
                    cursor: 'pointer',
                    ml: '4px',
                    color: '#4489FE',
                    fontSize: '14px',
                    fontWeight: 700
                }}>Add Theme</Typography>
            </Box> */}

      <DataGrid
        autoHeight
        rows={data}
        columns={columns}
        pageSize={pageSize}
        disableSelectionOnClick
        sx={{
          color: '#212121',
          fontSize: '12px',
          fontWeight: 500,
          marginTop: '20px',
          border: 'none',
          height: '100% !important',
          maxHeight: '350px !important',
          '&.MuiDataGrid-root': {
            border: 'none',
            p: 0,
          },
          '& .MuiDataGrid-columnHeaders': {
            color: '#212121',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            display: 'flex',
            color: '#212121',
            border: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            overflow: isMedium ? 'auto' : 'hidden',
            overflowY: 'auto !important',
          },
          '& .MuiDataGrid-virtualScrollerContent': {
            maxHeight: '350px !important',
          },
          '& .MuiDataGrid-row': {
            width: 'calc(100% - 2px) !important',
            margin: '4px 0px', // Use padding instead of margin
            textAlign: 'center',
            height: '52px !important',
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #E5E9EE',
            borderRadius: '4px',
            boxSizing: 'border-box', // Ensure border-box for proper sizing
            overflow: 'hidden !important',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontSize: '12px',
            color: '#212121',
            fontWeight: '500',
          },
          '& .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-footerContainer': {
            height: '0px',
            minHeight: '0px',
            border: 'none',
          },
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-columnHeader:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-checkboxInput': {
            backgroundColor: 'transparent',
            m: 0,
            p: 0,
            outline: 'none',
            '&:hover': {
              backgroundColor: 'transparent',
              outline: 'none',
            },
            '&:focus': {
              outline: 'none',
              backgroundColor: 'transparent',
            },
            '&:active': {
              backgroundColor: 'transparent',
              outline: 'none',
            },
          },
          overflow: 'hidden !important',
        }}
        headerHeight={100}
        rowHeight={52}
        disableColumnMenu
        hideFooterPagination
        hideFooterSelectedRowCount
        disableColumnSelector
      />

      <Box sx={{ marginTop: '20px' }}>
        <CustomPagination
          themeSetting={true}
          page={pageNo}
          setPageSize={setPageSize}
          pageSize={pageSize}
          setPageNo={setPageNo}
          onChange={handlePageChange}
          pageCount={1}
        />
      </Box>
    </>
  );
};

export default EditTheme;
