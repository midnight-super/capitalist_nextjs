import React, { useState } from 'react'
import { Box, Typography, Collapse, MenuItem, Menu } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { IoCloseSharp } from 'react-icons/io5'

const Sidebar = ({
  activeTab,
  setActiveTab,
  orderParts,
  setOrderParts,
  setIsTask,
  isTask,
  deleteOrderPart,
  isDeleting,
  setInitialState,
  isSidebarOpen,
  setIsSidebarOpen,
  selectedWorkflow,
  setSelectedTask,
  setSelectedPartId,
  onTaskSelect,
  isPreviewing,
}) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedFileIndex, setSelectedFileIndex] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [loadingTasks, setLoadingTasks] = useState(false)

  const handleTabClick = async (tab) => {
    setActiveTab(tab)
    setIsSidebarOpen(false)
    if (tab === 'general') {
      orderParts?.forEach((part) => (part.isOpen = false))
      setInitialState((prev) => ({
        ...prev,
        orderParts: prev?.orderParts?.map((part) => ({
          ...part,
          isOpen: false,
        })),
      }))
    } else {
      const clickedPart = orderParts?.find((part) => part?.id === tab)
      if (clickedPart) {
        // Update order parts with fetched tasks
        setOrderParts((prev) =>
          prev?.map((part) =>
            part.id === tab
              ? {
                  ...part,
                  isOpen: true,
                  steps: {
                    ...part.steps,
                    tasks: [],
                  },
                }
              : { ...part, isOpen: false }
          )
        )
        setInitialState((prev) => ({
          ...prev,
          orderParts: prev?.orderParts?.map((part) =>
            part.id === tab
              ? { ...part, isOpen: true, steps: { ...part.steps, tasks: [] } }
              : { ...part, isOpen: false }
          ),
        }))
        setIsTask(null)
        // try {
        //   setLoadingTasks(true);
        //   const response = await getOrderPartTasks(tab);
        //   if (response && response?.length > 0) {

        //   }
        //   setIsTask(null);
        // } catch (error) {
        //   toast.error('Failed to fetch tasks');
        // } finally {
        //   setLoadingTasks(false);
        // }
      }
    }
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedFileIndex(null)
    setSelectedItem(null)
  }

  const handleActionClick = (event, index, data) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedFileIndex(index)
    setSelectedItem(data)
  }

  return (
    <Box
      sx={{
        width: '200px',
        minHeight: '100%',
        bgcolor: '#fff',
        display: 'flex',
        transition: 'left 0.3s ease-in-out',
        flexDirection: 'column',
        '@media (max-width: 1299px)': {
          position: 'absolute',
          top: 0,
          left: isSidebarOpen ? '-15px' : '-320px',
          zIndex: 1000,
          boxShadow: 'rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 10,
          zIndex: 1000,
          cursor: 'pointer',
          '@media (max-width: 1299px)': {
            display: 'block',
          },
          '@media (min-width: 1300px)': {
            display: 'none',
          },
        }}
        onClick={() => setIsSidebarOpen(false)}
      >
        <IoCloseSharp size={22} color="#000" />
      </Box>
      <Box>
        <Typography
          component="a"
          href="/order-management/order-list"
          sx={{
            display: 'block',
            color: '#666',
            fontSize: '14px',
            textDecoration: 'none',
            cursor: 'pointer',
            mb: 2,
            '&:hover': {
              color: '#1976d2',
            },
          }}
        >
          {'< Back to Order List'}
        </Typography>

        <Box
          onClick={() => handleTabClick('general')}
          sx={{
            pointerEvents: isPreviewing ? 'none' : '',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: '8px',
            cursor: 'pointer',
            bgcolor: activeTab === 'general' ? '#E3F2FD' : 'transparent',
            borderTopRightRadius: '100px',
            borderBottomRightRadius: '100px',
            '&:hover': {
              bgcolor: activeTab === 'general' ? '#E3F2FD' : '#F5F5F5',
            },
          }}
        >
          <Image
            src={`/icons/star_icon${activeTab === 'general' ? '' : '_inactive'}.svg`}
            alt=""
            width={20}
            height={20}
          />
          <Typography
            sx={{
              fontSize: '15px',
              color: activeTab === 'general' ? '#4489FE' : '#666',
              fontWeight: 500,
            }}
          >
            General Information
          </Typography>
        </Box>

        {/* Dynamic Order Parts */}
        {orderParts?.map((part, index) => (
          <React.Fragment key={part.id}>
            <Box
              onClick={() => handleTabClick(part?.id)}
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: '8px',
                cursor: 'pointer',
                pointerEvents: isPreviewing ? 'none' : '',
                color: activeTab === part.id ? '#4489FE' : '#666',
                bgcolor: activeTab === part.id ? '#E3F2FD' : 'transparent',
                borderTopRightRadius: '100px',
                borderBottomRightRadius: '100px',
                '&:hover': {
                  bgcolor: activeTab === part.id ? '#E3F2FD' : '#F5F5F5',
                },
              }}
            >
              <Image
                src={`/icons/order_part_${activeTab === part.id ? 'active' : 'inactive'}_icon.svg`}
                alt=""
                width={20}
                height={20}
              />
              <Typography sx={{ fontSize: '15px', color: 'inherit', fontWeight: 500 }}>{part?.label}</Typography>

              <Box
                style={{ position: 'absolute', top: '8px', right: '10px' }}
                className="action-icon"
                onClick={(e) => handleActionClick(e, index, part)}
                sx={{
                  cursor: 'pointer',
                }}
              >
                <img src="/icons/actionIcon.svg" alt="action" />
              </Box>
            </Box>
            {/* {part?.steps && (
              <Collapse in={part.isOpen}>
                <Box sx={{ pl: 4 }}>
                  {loadingTasks ? (
                    <Typography sx={{ p: 2, color: '#666' }}>
                      Loading tasks...
                    </Typography>
                  ) : (
                    <>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          color: '#666',
                          p: '8px',
                        }}
                      >
                        {part?.steps?.name}
                      </Typography>

                      {part?.steps?.tasks?.map((step, index) => (
                        <Box
                          key={`${part.id}-step-${index + 1}`}
                          onClick={() => {
                            // const newPart = { ...part, steps: `step-${index + 1}` };
                            // Update the part's steps in parent component
                            setIsTask(step);
                          }}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: '8px',
                            cursor: 'pointer',
                            bgcolor:
                              isTask === step
                                ? '#E3F2FD'
                                : 'transparent',
                            borderTopRightRadius: '100px',
                            borderBottomRightRadius: '100px',
                            '&:hover': {
                              bgcolor:
                                isTask === step
                                  ? '#E3F2FD'
                                  : '#F5F5F5',
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '14px',
                              color:
                                part.steps === `step-${index + 1}`
                                  ? '#4489FE'
                                  : '#666',
                            }}
                          >
                            {step}
                          </Typography>
                        </Box>
                      ))}
                    </>
                  )}
                </Box>
              </Collapse>
            )} */}

            {selectedWorkflow && selectedWorkflow[part?.id] && (
              <Collapse in={part?.isOpen}>
                <Box sx={{ pl: 4 }}>
                  <>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#666',
                        p: '8px',
                      }}
                    >
                      {selectedWorkflow[part?.id]?.workflowName}
                    </Typography>

                    {selectedWorkflow[part?.id]?.workflowTasks?.map((task) => (
                      <Box
                        key={task.workflowTaskId}
                        onClick={() => onTaskSelect(task, part.id)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: '8px',
                          cursor: 'pointer',
                          bgcolor: isTask === task?.workflowTaskId ? '#E3F2FD' : 'transparent',
                          borderTopRightRadius: '100px',
                          borderBottomRightRadius: '100px',
                          '&:hover': {
                            bgcolor: isTask === task?.workflowTaskId ? '#E3F2FD' : '#F5F5F5',
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '14px',
                            color: part.steps === `step-${index + 1}` ? '#4489FE' : '#666',
                          }}
                        >
                          {task?.taskNameTag}
                        </Typography>
                      </Box>
                    ))}
                  </>
                </Box>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </Box>

      {/* {showConfigureWorkflow && (
        <Box sx={{ mt: 'auto', borderTop: '1px solid #E0E0E0', pt: 2 }}>
          <Box
            onClick={() => handleTabClick('configure-workflow')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: '8px',
              cursor: 'pointer',
              color: activeTab === 'configure-workflow' ? '#4489FE' : '#666',
              bgcolor:
                activeTab === 'configure-workflow' ? '#E3F2FD' : 'transparent',
              borderTopRightRadius: '100px',
              borderBottomRightRadius: '100px',
              '&:hover': {
                bgcolor:
                  activeTab === 'configure-workflow' ? '#E3F2FD' : '#F5F5F5',
              },
              mx: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: '15px',
                color: 'inherit',
                fontWeight: 500,
                fontStyle: 'italic',
              }}
            >
              Configure Workflow
            </Typography>
          </Box>
        </Box>
      )} */}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 0.5,
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            '& .MuiMenuItem-root': {
              fontSize: '14px',
              color: '#666',
              py: 1,
              px: 2,
              minWidth: '120px',
            },
          },
        }}
        MenuListProps={{
          sx: { py: 0.5 },
        }}
      >
        <MenuItem
          disabled={isDeleting}
          style={{ color: 'red' }}
          onClick={() => deleteOrderPart(selectedItem, handleMenuClose)}
        >
          {isDeleting ? 'Please wait...' : 'Delete'}
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Sidebar
