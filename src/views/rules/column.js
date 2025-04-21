// ** React Imports
import React, { useEffect, useState } from 'react'
import { IconButton, useTheme } from '@mui/material'
import Typography from '@mui/material/Typography'
import toast from 'react-hot-toast'
import { Menu, MenuItem } from '@mui/material'

import CustomSwitch from '@/components/CustomSwitch'
import CustomTableHeaderTitle from '@/components/CustomTableHeaderTitle'
import { SuccessModal } from '@/views/componenets/successModal'
import DeleteModal from '../componenets/deleteModal'
import RuleAddModal from '@/views/rules/modal/addModal'
import AvatarWithNameTime from '@/components/avatarWithNameTime'
import MoreIcon from '@mui/icons-material/MoreHoriz'

import { updateRule, deleteRule, getRuleById } from '@/services/rule.service'

export const getColumns = ({ colSorting, setColSorting, fetchAllRules }) => {
  const theme = useTheme()

  const handleToggleStatus = async (newStatus, ruleId) => {
    const currentRule = await getRuleById(ruleId)
    const newRule = { ...currentRule, status: newStatus }
    const res = await updateRule(newRule)
    if (res) {
      fetchAllRules()
      if (res === 'OPERATION_SUCCESS') {
        setTimeout(() => {
          toast.success(`Rule ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`)
        }, 200)
      }
    }
  }

  const RowOptions = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const rowOptionsOpen = Boolean(anchorEl)
    const [addOpen, setAddOpen] = useState(false)
    const [success, setSuccess] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [isView, setIsView] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)

    const handleDeleteUser = async () => {
      handleRowOptionsClose()
      const res = await deleteRule(row?.ruleId)
      if (res === 'OPERATION_SUCCESS') {
        toast.success('Client Deleted Successfully.')
        fetchAllRules()
      }
    }

    const handleRowOptionsClick = (event) => {
      setAnchorEl(event.currentTarget)
      event.stopPropagation()
    }

    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }

    const handleAddOpen = (id) => {
      setAddOpen(true)
      setSelectedItem(id)
      handleRowOptionsClose()
    }
    const handleAddClose = () => {
      setAddOpen(false)
      setSelectedItem(null)
      setIsView(false)
    }

    const handleDeleteOpen = () => {
      handleRowOptionsClose()
      setOpenDelete(true)
    }
    const handleDeleteClose = () => {
      setOpenDelete(false)
    }

    useEffect(() => {
      const handleResize = () => {
        handleRowOptionsClose()
      }

      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, [])

    useEffect(() => {
      if (success) {
        const timer = setTimeout(() => {
          setSuccess(false)
        }, 2000)

        return () => clearTimeout(timer)
      }
    }, [success])
    useEffect(() => {
      const handleScroll = () => {
        const scrollHeight = window.scrollY
        if (scrollHeight > 0) {
          handleRowOptionsClose()
        }
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
      <>
        <IconButton onClick={handleRowOptionsClick}>
          <MoreIcon />
        </IconButton>

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
            sx={{ '& svg': { mr: 2 } }}
            onClick={() => {
              handleAddOpen(row?.ruleId), setIsView(true)
            }}
          >
            <Typography sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}>View Details</Typography>
          </MenuItem>
          <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => handleAddOpen(row?.ruleId)}>
            <Typography sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}>Edit Rule</Typography>
          </MenuItem>
          <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => handleDeleteOpen()}>
            <Typography sx={{ fontSize: '15px', fontWeight: 400, color: '#212121' }}>Delete</Typography>
          </MenuItem>
        </Menu>
        {success && <SuccessModal open={success} close={() => setSuccess(false)} />}
        {addOpen && (
          <RuleAddModal
            fetchAllRules={fetchAllRules}
            isView={isView}
            editId={selectedItem}
            open={addOpen}
            close={handleAddClose}
          />
        )}

        {openDelete && (
          <DeleteModal text={'rule'} open={openDelete} close={handleDeleteClose} deleteClick={handleDeleteUser} />
        )}
      </>
    )
  }

  const columns = [
    {
      field: 'ruleName',
      flex: 3,
      minWidth: 150,
      sortable: false,
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Name of the Rule'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      renderCell: (params) => <Typography variant="body1">{params.value}</Typography>,
    },
    {
      field: 'objectName',
      flex: 1,
      minWidth: 100,
      sortable: false,
      renderHeader: (params) => (
        <CustomTableHeaderTitle {...params} title={'Type'} colSorting={colSorting} setColSorting={setColSorting} />
      ),
      renderCell: (params) => <Typography variant="body1">{params.value}</Typography>,
    },
    {
      field: 'createdAt',
      flex: 1,
      minWidth: 140,
      sortable: false,
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Date of creation'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
      renderCell: (params) => (
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.custom.neutral450,
          }}
        >
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: 'lastActivity',
      flex: 2,
      minWidth: 180,
      sortable: false,
      renderHeader: (params) => (
        <CustomTableHeaderTitle
          {...params}
          title={'Last Activity'}
          colSorting={colSorting}
          setColSorting={setColSorting}
        />
      ),

      renderCell: (params) => {
        const name = params.value?.userName || ''
        const profileUrl = params.value?.profileUrl || ''
        const time = params.value?.executiontime

        return <AvatarWithNameTime name={name} profileUrl={profileUrl} time={time} />
      },
    },
    {
      field: 'status',
      flex: 0.5,
      sortable: false,
      minWidth: 120,
      renderHeader: (params) => (
        <CustomTableHeaderTitle {...params} title={'State'} colSorting={colSorting} setColSorting={setColSorting} />
      ),
      headerAlign: 'center',
      align: 'center',
      minWidth: 100,
      renderCell: (params) => {
        const isActive = params.value === 'ACTIVE'

        const handleToggle = () => {
          const newStatus = isActive ? 'INACTIVE' : 'ACTIVE'
          handleToggleStatus(newStatus, params.row.id)
        }

        return (
          <CustomSwitch
            checked={isActive}
            onChange={handleToggle}
            size="small"
            sx={{
              width: '43px',
              height: '26px',
              borderRadius: '13px',
              '& .MuiSwitch-thumb': {
                borderRadius: '13px',
                width: '22px',
                height: '22px',
              },
            }}
          />
        )
      },
    },
    {
      flex: 0.5,
      minWidth: 70,
      maxWidth: 70,
      sortable: false, // turn off default sorting
      field: 'actions',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Actions',
      renderCell: ({ row }) => <RowOptions row={row} />,
    },
  ]

  return columns
}
