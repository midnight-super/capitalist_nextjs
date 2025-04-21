import { DataGrid } from '@mui/x-data-grid'
import CustomCheckBox from './customCheckBox'

const CustomTable = ({ rows, columns, pageSize, onSelectionChange, ...props }) => {
  return (
    <DataGrid
      {...props}
      rows={rows}
      columns={columns}
      pageSize={pageSize}
      disableSelectionOnClick
      onRowSelectionModelChange={(ids) => {
        if (onSelectionChange) {
          onSelectionChange(ids, rows)
        }
      }}
      components={{
        BaseCheckbox: CustomCheckBox,
      }}
      sx={{
        border: 0,
        '& .MuiDataGrid-columnHeaders': {
          color: '#212121',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
        },
        '& .MuiDataGrid-cell': {
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          color: '#212121',
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
      }}
      checkboxSelection
      headerHeight={100}
      rowHeight={92}
      disableColumnMenu
      hideFooterPagination
      hideFooterSelectedRowCount
      disableColumnSelector
    />
  )
}

export default CustomTable
