import { Box, IconButton, Typography, useTheme } from '@mui/material'
import moment from 'moment'
// import RowOptions from './RowOptions'
import TaskAssigneesOptions from './TaskAssigneesOptions'
import CustomTableHeaderTitle from '@/components/CustomTableHeaderTitle'
import { useEffect, useState } from 'react'
import MoreIcon from '@mui/icons-material/MoreHoriz'
import ActionMenu from './TaskActionMenu'
import TaskDetailModal from '../modals/TaskDetailModal'
// import mockTaskData from '@/dummyData/task_info'
import { statusOptions, getColorMap } from '../OrderStatus'
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const iso = moment(dateString, moment.ISO_8601, true)
  if (iso.isValid()) return iso.format('MM/DD/YYYY')
  const timestamp = moment(Number(dateString))
  return timestamp.isValid() ? timestamp.format('MM/DD/YYYY') : '-'
}

export const getColumns = ({
  colSorting,
  setColSorting,
  fetchTaskLists,
  staffList,
  serviceCategoryList,
  serviceList,
  addonList,
  taskTypeList,
}) => {
  const theme = useTheme()

  const RowOptions = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

    function openRowActionMenu(event) {
      setAnchorEl(event.currentTarget)
      event.stopPropagation()
    }

    function closeRowActionMenu() {
      setAnchorEl(null)
    }

    function openDetailModal() {
      setIsDetailModalOpen(true)
      closeRowActionMenu()
    }

    function closeDetailModal() {
      setIsDetailModalOpen(false)
    }
    useEffect(() => {
      const handleScroll = () => {
        const scrollHeight = window.scrollY
        if (scrollHeight > 0) {
          closeRowActionMenu()
        }
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
      <>
        <IconButton onClick={openRowActionMenu}>
          <MoreIcon />
        </IconButton>
        <ActionMenu
          anchorEl={anchorEl}
          closeRowActionMenu={closeRowActionMenu}
          openDetailModal={openDetailModal}
          row={row}
        />
        {isDetailModalOpen && <TaskDetailModal task={row} open={isDetailModalOpen} close={closeDetailModal} />}
      </>
    )
  }

  const columns = [
    {
      field: 'orderId',
      headerName: 'Order Id',
      flex: 0.8,
      minWidth: 150,
      maxWidth: 200,
      renderHeader: (params) => (
        <CustomTableHeaderTitle {...params} title="Order Id" colSorting={colSorting} setColSorting={setColSorting} />
      ),
      renderCell: ({ row }) => <Typography>{row.orderId == 'N/A' ? 'Custom' : row.orderId}</Typography>,
    },
    {
      field: 'jobId',
      headerName: 'Job Id',
      flex: 0.4,
      minWidth: 200,
      maxWidth: 250,
      sortable: false,
      renderHeader: (params) => (
        <CustomTableHeaderTitle {...params} title="Job Id" colSorting={colSorting} setColSorting={setColSorting} />
      ),
      renderCell: ({ row }) => <Typography>{row.jobId}</Typography>,
    },
    {
      field: 'taskTitle',
      headerName: 'Task Name',
      flex: 0.7,
      minWidth: 120,
      maxWidth: 250,
      renderHeader: (params) => (
        <CustomTableHeaderTitle {...params} title="Task Name" colSorting={colSorting} setColSorting={setColSorting} />
      ),
      renderCell: ({ row }) => (
        <Typography variant="body1" color="primary">
          {row.taskTitle}
        </Typography>
      ),
    },
    {
      field: 'assignees',
      headerName: 'Staff',
      flex: 0.7,
      minWidth: 120,
      maxWidth: 250,
      renderCell: ({ row }) => (
        <TaskAssigneesOptions
          row={row}
          staffList={staffList}
          fetchTaskLists={fetchTaskLists}
          serviceCategoryList={serviceCategoryList}
          serviceList={serviceList}
          addonList={addonList}
          taskTypeList={taskTypeList}
        />
      ),
    },
    {
      field: 'dueDate',
      headerName: 'Create/Due Date',
      flex: 0.7,
      minWidth: 150,
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title="Create/Due Date"
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography color="textSecondary">{formatDate(row.createdAt)}</Typography>
          <Typography color="textSecondary">{row.dueDate ? `Due ${formatDate(row.dueDate)}` : '-'}</Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Order Status',
      flex: 0.5,
      minWidth: 150,
      maxWidth: 220,
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title="Order Status"
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      renderCell: ({ row }) => {
        const status = row.status
        const matchedOption = statusOptions.find((option) => option.value === status)
        const label = matchedOption?.label || status

        // Set colors based on status (customize these as needed)
        const colorMap = getColorMap(theme)
        const color = colorMap[status] || theme.palette.text.primary

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', color }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: color,
                mr: 1,
              }}
            />
            {label}
          </Box>
        )
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.2,
      minWidth: 70,
      maxWidth: 70,
      renderCell: ({ row }) => <RowOptions row={row} />, // Replace with real handler
    },
  ]

  return columns
}
export default getColumns
