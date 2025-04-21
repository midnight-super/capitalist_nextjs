import FallbackSpinner from '@/components/spinner'
import isMobileHook from '@/hooks/isMobileHook'
import { getAddOnsAll } from '@/services/addon.service'
import { deleteFiles } from '@/services/file.service'
import {
  getAllClients,
  getAllServices,
  getOPreviewFIle,
  getOrderDetail,
  handleOrderApproveFunction,
  handleOrderPartCreate,
  handleOrderPartDelete,
  handlePendingApprovalFunction,
  handleSubmitOrderFunction,
  handleUpdateOrder,
  moveFilesToGeneral,
  moveFilesToOrderPart,
  uploadOrderFiles,
  uploadOrderPartFiles,
} from '@/services/order.service'
import { applyWorkflowToOrderPart, getTaskTypeById, uploadTaskFiles } from '@/services/workflow.service'
import FilesSection from '@/views/order-management/components/FilesSection'
import OrderInformation from '@/views/order-management/components/OrderInformation'
import PreviewFile from '@/views/order-management/components/PreviewFile'
import Sidebar from '@/views/order-management/components/Sidebar'
import AreYouSureModal from '@/views/order-management/modal/AreYouSureModal/AreYouSureModal'
import ErrorModal from '@/views/order-management/modal/ErrorModal/ErrorModal'
import OrderSubmitModal from '@/views/order-management/modal/OrderSubmitModal/OrderSubmitModal'
import { Box, Button, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { GiHamburgerMenu } from 'react-icons/gi'

const CreateOrder = () => {
  const router = useRouter()
  const { id } = router.query
  const [checkedItems, setCheckedItems] = useState({})
  const [filesByTab, setFilesByTab] = useState({
    general: [],
  })
  const [uploadingFiles, setUploadingFiles] = useState([])
  const [activeTab, setActiveTab] = useState('general')
  const [previewFile, setPreviewFile] = useState(null)
  const [orderParts, setOrderParts] = useState([])
  const [sureModalOpen, setSureModalOpen] = useState(false)
  // apis-state-----
  const [isLoading, setIsLoading] = useState(false)
  const [isApiCall, setIsApiCall] = useState(false)
  const [allClients, setAllClients] = useState([])
  const [allServices, setAllServices] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  // workflow---
  const [isTask, setIsTask] = useState(null)

  const [generalInformationFields, setGeneralInformationFields] = useState({
    dueDate: null,
    clientId: '',
    instructions: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true)
  const [pendingAction, setPendingAction] = useState(null)
  const [initialState, setInitialState] = useState({
    generalInformation: {},
    orderParts: [],
  })
  // Store previous states for each service
  const [serviceStates, setServiceStates] = useState({})
  const [allAddOns, setAllAddOns] = useState([])
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false)

  const [isOrderApproved, setIsOrderApproved] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const [removedFile, setRemovedFile] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const windowWidth = isMobileHook()

  const uploadControllersRef = useRef({})
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState([])
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [taskTypeData, setTaskTypeData] = useState(null)
  const [taskFiles, setTaskFiles] = useState({})
  const [selectedPartId, setSelectedPartId] = useState(null)

  // New state for workflow data
  const [workflowInputData, setWorkflowInputData] = useState({})

  const handlePartStepChange = (partId, step) => {
    setOrderParts(orderParts.map((part) => (part.id === partId ? { ...part, steps: step } : part)))
  }

  useEffect(() => {
    setPreviewFile(null)
  }, [activeTab])

  const showConfigureWorkflow = filesByTab.general.length > 0

  const handlePreview = async (file, para) => {
    setIsPreviewing(true)
    try {
      const res = await getOPreviewFIle(file?.file?.fileId, file?.file)
      if (res) {
        const fileToPreview = {
          ...file,
          file: file?.file || file, // Handle both File objects and API responses
          name: file?.name || file.fileName,
          url: file.url || file.file?.url,
          imageUrl: res,
        }
        setPreviewFile(fileToPreview)
      }
    } catch (e) {
      toast.error(err?.message || 'Unexpected Error')
    } finally {
      setIsPreviewing(false)
    }
    setIsPreviewing(false)
  }

  const checkForChanges = () => {
    const generalInfoChanged =
      JSON.stringify(initialState.generalInformation) !== JSON.stringify(generalInformationFields)
    const orderPartsChanged = JSON.stringify(initialState.orderParts) !== JSON.stringify(orderParts)
    return generalInfoChanged || orderPartsChanged
  }

  const checkUnsavedChanges = (action) => {
    if (checkForChanges()) {
      setPendingAction(() => action)
      setSureModalOpen(true)
      return true
    }
    return false
  }

  // Handle tab close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (checkForChanges()) {
        // Show browser's default confirmation dialog
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return e.returnValue
      }
    }

    // Handle route changes (Next.js)
    const handleRouteChange = (url) => {
      if (checkForChanges()) {
        const shouldProceed = window.confirm('You have unsaved changes. Are you sure you want to leave?')
        if (!shouldProceed) {
          router.events.emit('routeChangeError')
          throw 'Route change aborted.'
        }
      }
    }

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload)
    router.events.on('routeChangeStart', handleRouteChange)

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [generalInformationFields, orderParts])

  const handleFilesUploaded = async (completedFiles) => {
    try {
      let response
      if (activeTab === 'general') {
        response = await uploadOrderFiles(
          id,
          completedFiles,
          (progress, fileName) => {
            setUploadingFiles((prev) => prev.map((file) => (file?.name === fileName ? { ...file, progress } : file)))
          },
          uploadControllersRef,
          handleOrderDetail,
          setUploadingFiles
        )
      } else if (activeTab === 'configure-workflow') {
        response = await uploadTaskFiles(
          '0',
          completedFiles,
          (progress, fileName) => {
            setUploadingFiles((prev) => prev.map((file) => (file?.name === fileName ? { ...file, progress } : file)))
          },
          uploadControllersRef,
          handleOrderDetail,
          setUploadingFiles
        )

        if (response?.success) {
          // toast.success('Files uploaded successfully');
          for (let key in response?.fileIds) {
            setUploadingFiles((prev) => prev.filter((file) => file?.name !== key))
          }

          // Update workflowInputData with the new files
          if (selectedTask && selectedPartId) {
            setWorkflowInputData((prev) => {
              const orderPartData = prev[selectedPartId] || []
              const fileData = response.data.map((file) => file.fileId)

              // Find if there's an existing entry for this task's file input
              const existingInputIndex = orderPartData.findIndex(
                (item) => item.workflowTaskId === selectedTask.workflowTaskId && item.files && Array.isArray(item.files)
              )

              if (existingInputIndex >= 0) {
                // Update existing entry
                const updatedData = [...orderPartData]
                updatedData[existingInputIndex] = {
                  ...updatedData[existingInputIndex],
                  files: fileData,
                }
                return {
                  ...prev,
                  [selectedPartId]: updatedData,
                }
              } else {
                // Create new entry
                const connection = selectedWorkflow[selectedPartId]?.workflowConnections.find(
                  (conn) => conn.mappingType === 'FILE' && conn.inputWorkflowTaskId === selectedTask.workflowTaskId
                )

                if (connection) {
                  return {
                    ...prev,
                    [selectedPartId]: [
                      ...orderPartData,
                      {
                        taskTypeInputId: connection.inputId,
                        workflowTaskId: selectedTask.workflowTaskId,
                        files: fileData,
                        data: '',
                      },
                    ],
                  }
                }
              }
              return prev
            })
          }
          setTaskFiles((prev) => {
            // Get existing files for this part and task
            const existingFiles = prev[selectedPartId]?.[selectedTask?.workflowTaskId] || []
            return {
              ...prev,
              [selectedPartId]: {
                ...(prev[selectedPartId] || {}),
                [selectedTask?.workflowTaskId]: [...existingFiles, ...response?.data],
              },
            }
          })
        }
      } else {
        response = await uploadOrderPartFiles(
          activeTab,
          completedFiles,
          (progress, fileName) => {
            setUploadingFiles((prev) => prev.map((file) => (file?.name === fileName ? { ...file, progress } : file)))
          },
          uploadControllersRef,
          handleOrderDetail,
          setUploadingFiles
        )
      }
      if (response?.success) {
        if (activeTab !== 'configure-workflow') {
          await handleOrderDetail(false, 'uploadFiles')
          toast.success('Files uploaded successfully')
          for (let key in response?.fileIds) {
            setUploadingFiles((prev) => prev.filter((file) => file?.name !== key))
          }
        } else {
          toast.success('Files uploaded successfully')
          for (let key in response?.fileIds) {
            setUploadingFiles((prev) => prev.filter((file) => file?.name !== key))
          }
          // setTaskFiles((prev) => ({ ...prev, [selectedTask?.taskTypeId]: response?.data }))
        }
      } else {
        // toast.error(response || 'Failed to upload files');
      }
    } catch (err) {
      toast.error(err?.message || 'Unexpected Error')
    } finally {
      // setUploadingFiles((prev) => prev?.filter(file => file?.name !== completedFiles?.name));
    }
  }

  const handleCancelUpload = (fileName) => {
    const controller = uploadControllersRef.current[fileName]
    if (controller) {
      controller.abort()
      delete uploadControllersRef.current[fileName]
    }
    setUploadingFiles((prev) => prev?.filter((file) => file?.name !== fileName))
  }

  const handleOrderPartNameChange = (orderId, newName) => {
    setOrderParts(orderParts.map((part) => (part?.id === orderId ? { ...part, label: newName } : part)))
  }

  const handleAddFileToOrderPart = async (partId, para) => {
    try {
      const selectedFileIndices = Object.entries(checkedItems)
        .filter(([_, isChecked]) => isChecked)
        .map(([index]) => Number(index))

      const filesToMove = selectedFileIndices.map((index) => filesByTab.general[index])

      const fileIds = filesToMove.map((file) => file.fileId)
      const response = await moveFilesToOrderPart(partId, fileIds)

      if (response === 'OPERATION_SUCCESS') {
        setFilesByTab((prev) => ({
          ...prev,
          [partId]: [...(prev[partId] || []), ...filesToMove],
          general: prev.general.filter((_, index) => !selectedFileIndices.includes(index)),
        }))

        setCheckedItems({})
        handleOrderDetail(false, 'moveFilesToOrderPart', partId)
        toast.success('Files added to job successfully')
      } else {
        toast.error(response || 'Failed to add files to job')
      }
    } catch (err) {
      toast.error(err?.message || 'Unexpected Error')
    }
  }

  const handleMoveFileToGeneral = async (orderPartId, para) => {
    try {
      const selectedFileIndices = Object.entries(checkedItems)
        .filter(([_, isChecked]) => isChecked)
        .map(([index]) => Number(index))

      const filesToMove = selectedFileIndices.map((index) => filesByTab[orderPartId][index])

      const fileIds = filesToMove.map((file) => file.fileId)
      const response = await moveFilesToGeneral(orderPartId, fileIds)

      if (response === 'OPERATION_SUCCESS') {
        setFilesByTab((prev) => ({
          ...prev,
          general: [...prev.general, ...filesToMove],
          [orderPartId]: prev[orderPartId].filter((_, index) => !selectedFileIndices.includes(index)),
        }))

        setCheckedItems({})
        handleOrderDetail(false, 'moveFilesToGeneral', orderPartId)
        toast.success('Files moved to general successfully')
      } else {
        toast.error(response || 'Failed to move files to general')
      }
    } catch (err) {
      toast.error(err?.message || 'Unexpected Error')
    }
  }

  const handleMakeFileVisibleAgain = (orderPartId, fileIds) => {
    try {
      // Get the files to make visible from the current job
      const filesToMakeVisible = filesByTab[orderPartId].filter((file) => fileIds.includes(file.fileId))
      // Update filesByTab to add files to general tab
      setFilesByTab((prev) => ({
        ...prev,
        general: [...prev.general, ...filesToMakeVisible],
        // Keep files in their current tab (don't remove them)
        [orderPartId]: prev[orderPartId],
      }))

      toast.success('Files made visible successfully')
    } catch (err) {
      toast.error(err?.message || 'Unexpected Error')
    }
  }

  // all-apis---
  const fetchClientUsers = async () => {
    setIsApiCall(true) // Ensure loading state is updated
    try {
      const [res1, res2, res3] = await Promise.allSettled([getAllClients(), getAllServices(), getAddOnsAll()])
      if (res1?.value?.success) {
        setAllClients(res1?.value?.data)
      } else {
        toast.error(res1?.value || 'Server Error: Failed to fetch')
      }

      if (res2?.value?.success) {
        setAllServices(res2?.value?.data)
      } else {
        toast.error(res2?.value || 'Server Error: Failed to fetch')
      }

      if (res3?.value?.success) {
        setAllAddOns(res3?.value?.data)
      } else {
        toast.error(res3?.value || 'Server Error: Failed to fetch')
      }
    } catch (err) {
      toast.error(err?.message || 'Unexpected Error')
    } finally {
      setIsApiCall(false)
    }
  }

  useEffect(() => {
    fetchClientUsers()
  }, [])
  useEffect(() => {
    if (id) {
      handleOrderDetail()
    }
  }, [id])

  const handleCreateOrderPart = async () => {
    try {
      const existingNames = orderParts.map((part) => part?.label)
      let count = 1
      let newName = `Job ${count}`

      // Find the first available number
      while (existingNames.includes(newName)) {
        count++
        newName = `Job ${count}`
      }

      const newOrderPart = {
        label: newName,
        orderId: id,
        orderPartFiles: [],
        orderPartSteps: [],
      }

      const res = await handleOrderPartCreate(newOrderPart)
      if (res) {
        toast.success('Job created successfully')
        handleOrderDetail(false, 'createOrderPart')
        setHasUnsavedChanges(true)
        setActiveTab(res)
      }
    } catch (err) {
      toast.error(err?.message || 'Unexpected Error')
    }
  }

  const handleDeleteOrderPart = async (selectedItem, handleMenuClose) => {
    setIsDeleting(true)
    try {
      const findDeletedOrder = orderParts?.find((ele) => ele?.id === selectedItem?.id)
      const res = await handleOrderPartDelete(findDeletedOrder)
      if (res === 'OPERATION_SUCCESS') {
        const tempOrderPart = [...orderParts]
        const filterOrderPar = tempOrderPart?.filter((it) => it?.id !== selectedItem?.id)
        setOrderParts(filterOrderPar)
        setInitialState({
          ...initialState,
          orderParts: filterOrderPar,
        })

        if (activeTab === selectedItem?.id) {
          setPreviewFile(null)
        }
        if (activeTab === selectedItem?.id) {
          setActiveTab('general')
        }
        handleMenuClose()
      } else {
        toast.error(res || 'Server Error: Failed to fetch')
      }
    } catch (err) {
      toast.error(err?.message || 'Unexpected Error')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
    setPreviewFile(null)
  }

  const handleModalCancel = () => {
    setSureModalOpen(false)
    setPendingAction(null)
  }

  const handleDeleteFile = async (fileToDelete, fromOrderPart = false) => {
    try {
      if (fromOrderPart) {
        // First move file to general if it's from job
        const response = await moveFilesToGeneral(activeTab, [fileToDelete.fileId])

        if (!response === 'OPERATION_SUCCESS') {
          throw new Error('Failed to move file to general')
        }
      }

      // Prepare file object for delete API
      const fileForDelete = {
        fileName: fileToDelete.file.fileName,
        fileId: fileToDelete.fileId,
        duration: fileToDelete.file.duration,
        mediaType: fileToDelete.file.mediaType,
        status: fileToDelete.file.status,
        previewStatus: fileToDelete.file.previewStatus,
        size: fileToDelete.file.size,
        parentDirectoryId: fileToDelete.file.parentDirectoryId,
        metadata: fileToDelete.file.metadata,
        isPinned: fileToDelete.file.isPinned,
        isFavourite: fileToDelete.file.isFavourite,
        isShared: fileToDelete.file.isShared,
      }

      // Call delete API
      const deleteResponse = await deleteFiles([fileForDelete])

      if (deleteResponse === 'Deleted') {
        if (previewFile?.fileId === fileToDelete?.fileId) {
          setPreviewFile(null)
        }
        // Update local state
        setFilesByTab((prev) => ({
          ...prev,
          [activeTab]: prev[activeTab].filter((file) => file.fileId !== fileToDelete.fileId),
          ...(fromOrderPart && {
            general: prev.general.filter((file) => file.fileId !== fileToDelete.fileId),
          }),
        }))

        handleOrderDetail(false, 'deleteFile')

        toast.success('File deleted successfully')
      } else {
        throw new Error('Failed to delete file')
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to delete file')
    }
  }

  const handleOnSave = async () => {
    setIsSaving(true)
    try {
      const findClient =
        generalInformationFields?.clientId &&
        allClients?.find((ele) => ele?.clientId === generalInformationFields?.clientId)

      const clientInfo = findClient
        ? {
            clientName: findClient?.admin?.fullName,
            clientEmail: findClient?.admin?.email,
            clientAvatar:
              'https://www.pngitem.com/pimgs/m/294-2947257_interface-icons-user-avatar-profile-user-avatar-png.png',
          }
        : {}

      // Get all files from general tab
      const orderFiles = filesByTab.general.map((file) => ({
        fileId: file.fileId,
        fileName: file.file.fileName,
        size: file.file.size,
        status: file.file.status,
        mediaType: file.file.mediaType,
        url: file.file.url,
        isFavourite: file.file.isFavourite,
        isPinned: file.file.isPinned,
        isShared: file.file.isShared,
        previewStatus: file.file.previewStatus,
        metadata: file.file.metadata,
        parentDirectoryId: file.file.parentDirectoryId,
      }))

      // Update orderParts with current files from filesByTab
      const updatedOrderParts = orderParts.map((part) => {
        const partFiles = filesByTab[part.id] || []
        return {
          ...part,
          orderPartFiles: partFiles.map((file) => {
            // Find existing file data in orderParts if it exists
            const existingFileData = part.orderPartFiles?.find(
              (existingFile) => existingFile.orderPartFile.fileId === file.fileId
            ) || {
              fileSelectedOptions: [],
              unitQuantities: null,
              totalPriceForFile: null,
              manualDiscount: null,
              finalFilePrice: null,
              fileSegments: [],
            }

            return {
              orderPartFile: {
                fileId: file.fileId,
                fileName: file.file.fileName,
                size: file.file.size,
                status: file.file.status,
                mediaType: file.file.mediaType,
                url: file.file.url,
                isFavourite: file.file.isFavourite,
                isPinned: file.file.isPinned,
                isShared: file.file.isShared,
                previewStatus: file.file.previewStatus,
                metadata: file.file.metadata,
                parentDirectoryId: file.file.parentDirectoryId,
              },
              // Spread the existing file data or use default values
              fileSelectedOptions: existingFileData.fileSelectedOptions,
              unitQuantities: existingFileData.unitQuantities,
              totalPriceForFile: existingFileData.totalPriceForFile,
              manualDiscount: existingFileData.manualDiscount,
              finalFilePrice: existingFileData.finalFilePrice,
              fileSegments: existingFileData.fileSegments,
            }
          }),
        }
      })

      const body = {
        orderGeneral: {
          ...generalInformationFields,
          orderId: id,
          ...(generalInformationFields?.clientId && clientInfo),
        },
        orderParts: updatedOrderParts,
        orderFiles: orderFiles,
      }
      const res = await handleUpdateOrder(body)
      if (res === 'OPERATION_SUCCESS') {
        setInitialState({
          generalInformation: generalInformationFields,
          orderParts: updatedOrderParts,
        })

        setSureModalOpen(false)
        setPendingAction(null)

        if (pendingAction) {
          setHasUnsavedChanges(false)
          const action = pendingAction
          // const action = () => handleCreateOrderPart();
          await action()
        }
        // toast.success("Information saved successfully");
        await handleOrderDetail(false)
      }
    } catch (err) {
      toast.error(err?.message || 'Unexpected Error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleOrderDetail = async (loaderCheclBol = true, action = null, partId = null) => {
    if (loaderCheclBol) {
      setIsLoading(true)
    }
    try {
      const res = await getOrderDetail(id)
      if (res) {
        // Check if any files need duration check
        const needsDurationCheck = () => {
          // Check orderFiles
          const generalFileNeedsCheck = res.orderFiles?.some(
            (file) =>
              (file.mediaType?.startsWith('AUDIO') || file.mediaType?.startsWith('VIDEO')) &&
              (!file.duration || parseFloat(file.duration) === 0)
          )

          // Check orderPartFiles
          const partFileNeedsCheck = res.orderParts?.some((part) =>
            part.orderPartFiles?.some(
              (file) =>
                (file.orderPartFile?.mediaType?.startsWith('AUDIO') ||
                  file.orderPartFile?.mediaType?.startsWith('VIDEO')) &&
                (!file.orderPartFile?.duration || parseFloat(file.orderPartFile?.duration) === 0)
            )
          )

          return generalFileNeedsCheck || partFileNeedsCheck
        }

        // For debugging
        const hasZeroDuration = needsDurationCheck()

        if (hasZeroDuration) {
          // Wait a second before retrying
          await new Promise((resolve) => setTimeout(resolve, 1000))
          return handleOrderDetail(loaderCheclBol, action)
        }

        // Filter out resource files from orderParts
        const resourceFileIds = generalInformationFields?.resourceFileIds || []

        // Process orderParts to filter out resource files
        const formattedOrderParts =
          res?.orderParts?.length > 0
            ? res?.orderParts?.map((ele) => ({
                ...ele,
                id: ele?.orderPartId,
                // Filter out resource files from orderPartFiles
                orderPartFiles: ele?.orderPartFiles?.filter(
                  (file) => !resourceFileIds.includes(file?.orderPartFile?.fileId)
                ),
              }))
            : []

        // Handle different actions
        if (action === 'createOrderPart') {
          const newPart = res?.orderParts[res?.orderParts?.length - 1]
          setOrderParts((prev) => [
            ...prev,
            {
              ...newPart,
              id: newPart?.orderPartId,
              // Filter out resource files
              orderPartFiles: newPart?.orderPartFiles?.filter(
                (file) => !resourceFileIds.includes(file?.orderPartFile?.fileId)
              ),
            },
          ])
        } else if (action === 'uploadFiles') {
          const newFilesByTab = {
            general:
              res?.orderFiles?.map((file) => ({
                name: file.fileName,
                size: `${Math.round(file.size / 1024)}KB`,
                fileId: file.fileId,
                file: file,
              })) || [],
          }

          res?.orderParts?.forEach((part) => {
            // Keep all files in filesByTab (don't filter resource files)
            newFilesByTab[part?.orderPartId] =
              part?.orderPartFiles?.map((file) => ({
                name: file?.orderPartFile?.fileName,
                size: `${Math.round(file?.orderPartFile?.size / 1024)}KB`,
                fileId: file?.orderPartFile?.fileId,
                file: file?.orderPartFile,
              })) || []
          })

          setFilesByTab(newFilesByTab)
          setOrderParts((prev) => {
            return prev?.map((part) => {
              const matchingPart = res?.orderParts?.find((ele) => ele?.orderPartId === part?.orderPartId)
              return {
                ...part,
                // Filter out resource files
                orderPartFiles: matchingPart?.orderPartFiles?.filter(
                  (file) => !resourceFileIds.includes(file?.orderPartFile?.fileId)
                ),
              }
            })
          })
        } else if (action === 'deleteFile') {
          const newFilesByTab = {
            general:
              res?.orderFiles?.map((file) => ({
                name: file.fileName,
                size: `${Math.round(file.size / 1024)}KB`,
                fileId: file.fileId,
                file: file,
              })) || [],
          }

          res?.orderParts?.forEach((part) => {
            // Keep all files in filesByTab (don't filter resource files)
            newFilesByTab[part?.orderPartId] =
              part?.orderPartFiles?.map((file) => ({
                name: file?.orderPartFile?.fileName,
                size: `${Math.round(file?.orderPartFile?.size / 1024)}KB`,
                fileId: file?.orderPartFile?.fileId,
                file: file?.orderPartFile,
              })) || []
          })

          setFilesByTab(newFilesByTab)
          setOrderParts((prev) => {
            return prev?.map((part) => {
              const matchingPart = res?.orderParts?.find((ele) => ele?.orderPartId === part?.orderPartId)
              return {
                ...part,
                // Filter out resource files
                orderPartFiles: matchingPart?.orderPartFiles?.filter(
                  (file) => !resourceFileIds.includes(file?.orderPartFile?.fileId)
                ),
              }
            })
          })
        } else if (action === 'moveFilesToOrderPart') {
          setOrderParts((prev) =>
            prev.map((part) => {
              if (part.id === partId) {
                const matchingPart = res?.orderParts?.find((ele) => ele?.orderPartId === partId)
                return {
                  ...part,
                  // Filter out resource files
                  orderPartFiles: matchingPart?.orderPartFiles?.filter(
                    (file) => !resourceFileIds.includes(file?.orderPartFile?.fileId)
                  ),
                }
              }
              return part
            })
          )
        } else if (action === 'moveFilesToGeneral') {
          setOrderParts((prev) =>
            prev.map((part) => {
              if (part.id === partId) {
                const matchingPart = res?.orderParts?.find((ele) => ele?.orderPartId === partId)
                return {
                  ...part,
                  // Filter out resource files
                  orderPartFiles: matchingPart?.orderPartFiles?.filter(
                    (file) => !resourceFileIds.includes(file?.orderPartFile?.fileId)
                  ),
                }
              }
              return part
            })
          )
        } else {
          setGeneralInformationFields(res?.orderGeneral)
          setOrderParts(formattedOrderParts)
          // Set files with correct size key
          const newFilesByTab = {
            general:
              res?.orderFiles?.map((file) => ({
                name: file.fileName,
                size: `${Math.round(file.size / 1024)}KB`,
                fileId: file.fileId,
                file: file,
              })) || [],
          }

          res?.orderParts?.forEach((part) => {
            // Keep all files in filesByTab (don't filter resource files)
            newFilesByTab[part?.orderPartId] =
              part?.orderPartFiles?.map((file) => ({
                name: file?.orderPartFile?.fileName,
                size: `${Math.round(file?.orderPartFile?.size / 1024)}KB`,
                fileId: file?.orderPartFile?.fileId,
                file: file?.orderPartFile,
              })) || []
          })

          setFilesByTab(newFilesByTab)
        }

        // Update initial state with fresh data
        setInitialState({
          generalInformation: res?.orderGeneral,
          orderParts: formattedOrderParts,
        })

        // Reset all change tracking states
        setSureModalOpen(false)
        setPendingAction(null)
      }
    } catch (err) {
      toast.error(err?.message || 'Unexpected Error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Check if there's any orderPart with service selected
    const orderPartsWithService = orderParts.filter((part) => part.serviceId)

    if (orderPartsWithService.length > 0) {
      // Store initial states for each service
      const initialServiceStates = {}
      orderPartsWithService.forEach((part) => {
        if (part.serviceId) {
          initialServiceStates[part.serviceId] = {
            ...part,
            orderPartFiles: [...(part.orderPartFiles || [])],
            orderPartSelectedOptions: [...(part.orderPartSelectedOptions || [])],
            unitQuantities: [...(part.unitQuantities || [])],
          }
        }
      })
      setServiceStates(initialServiceStates)
    }
  }, []) // Run only once on component mount

  // Handle service selection
  const handleServiceChange = (partId, newServiceId) => {
    setOrderParts((prev) => {
      const updatedParts = prev.map((part) => {
        if (part.id === partId) {
          // Store current state if service was selected
          if (part.serviceId) {
            setServiceStates((prevStates) => ({
              ...prevStates,
              [part.serviceId]: {
                ...part,
                orderPartFiles: [...(part.orderPartFiles || [])],
                orderPartSelectedOptions: [...(part.orderPartSelectedOptions || [])],
                unitQuantities: [...(part.unitQuantities || [])],
              },
            }))
          }

          // Check if we have previous state for the new service
          if (serviceStates[newServiceId]) {
            // Restore previous state
            return {
              ...serviceStates[newServiceId],
              id: partId,
              serviceId: newServiceId,
            }
          }

          // Reset state for new service while maintaining file structure
          return {
            ...part,
            serviceId: newServiceId,
            orderPartFiles:
              part.orderPartFiles?.map((file) => ({
                orderPartFile: file.orderPartFile, // Keep file info
                fileSelectedOptions: [], // Reset options
                unitQuantities: null, // Reset quantities
                totalPriceForFile: '0', // Reset price
                manualDiscount: '0', // Reset discount
                finalFilePrice: '0', // Reset final price
                fileSegments: [], // Reset segments
              })) || [],
            orderPartSelectedOptions: [],
            unitQuantities: [],
            instructions: '',
            totalPrice: '0',
            finalPrice: '0',
            manualDiscount: '',
            dueDate: null,
          }
        }
        return part
      })

      return updatedParts
    })
  }

  const handleSubmitOrder = async () => {
    setErrorMessage([])
    let count = 0
    setIsOrderSubmitted(true)
    try {
      if (checkForChanges()) {
        await handleOnSave()
      }
      if (!generalInformationFields?.clientId) {
        setErrorMessage((prev) => [...prev, 'Select client'])
        count++
      }
      const tempArr = [...orderParts]
      if (tempArr?.length === 0) {
        setErrorMessage((prev) => [...prev, 'Add at least one job'])
        count++
      }
      for (let i = 0; i < tempArr?.length; i++) {
        if (!tempArr[i]?.serviceId) {
          setErrorMessage((prev) => [...prev, `Select service for ${tempArr[i]?.label}`])
          count++
        }
        if (tempArr[i]?.orderPartFiles?.length === 0) {
          setErrorMessage((prev) => [...prev, `Add at least one file for ${tempArr[i]?.label}`])
          count++
        }
        if (tempArr[i]?.unitQuantities && tempArr[i]?.unitQuantities?.length > 0) {
          if (
            tempArr[i]?.unitQuantities[0]?.quantity === null ||
            tempArr[i]?.unitQuantities[0]?.quantity === undefined
          ) {
            setErrorMessage((prev) => [...prev, `Enter a quantity for ${tempArr[i]?.label}`])
            count++
          }
        }
        if (
          allAddOns?.some(
            (el) => el?.serviceId === tempArr[i]?.serviceId && el?.type === 'PARTS' && el?.status === 'ACTIVE'
          )
        ) {
          const addOns = allAddOns?.filter(
            (el) => el?.serviceId === tempArr[i]?.serviceId && el?.type === 'PARTS' && el?.status === 'ACTIVE'
          )
          for (let j = 0; j < addOns?.length; j++) {
            if (tempArr[i]?.orderPartSelectedOptions?.length === 0) {
              setErrorMessage((prev) => [...prev, `Select ${addOns[j]?.addonName} from ${tempArr[i]?.label}`])
              count++
            } else {
              if (!tempArr[i]?.orderPartSelectedOptions?.some((el) => el?.linkId === addOns[j]?.addonId)) {
                setErrorMessage((prev) => [...prev, `Select ${addOns[j]?.addonName} from ${tempArr[i]?.label}`])
                count++
              }
            }
          }
        }
      }

      if (count > 0) {
        setShowErrorModal(true)
        return
      }
      const res = await handleSubmitOrderFunction(id)
      if (res) {
        const pendingApprovalRes = await handlePendingApprovalFunction(id)
        if (pendingApprovalRes) {
          setShowSubmitModal(true)
        } else {
          toast.error(pendingApprovalRes || 'Failed to submit order')
        }
      } else {
        toast.error(res || 'Failed to submit order')
      }
    } catch (err) {
      toast.error(err?.message || 'Unexpected Error')
    } finally {
      setIsOrderSubmitted(false)
    }
  }

  const handleOrderApprove = async (msg) => {
    setIsOrderApproved(true)
    try {
      const res = await handleOrderApproveFunction(id)
      if (res) {
        if (msg === 'approve') {
          // router.push(`/order-management/order-list`)
          if (orderParts[0]?.id) {
            setActiveTab(orderParts[0]?.id)
            handleOrderDetail(false)
          }
        } else if (msg === 'approveAndConfigure') {
          setShowSubmitModal(false)
          if (orderParts[0]?.id) {
            setActiveTab(orderParts[0]?.id)
            handleOrderDetail(false)
          }
        }
      } else {
        toast.error(res || 'Failed to approve order')
      }
    } catch (err) {
      toast.error(err?.message || 'Unexpected Error')
    } finally {
      setIsOrderApproved(false)
    }
  }

  useEffect(() => {
    // When the page loads or activeTab changes, we need to populate removedFile with all resource files
    const resourceFileIds = generalInformationFields?.resourceFileIds || []

    if (resourceFileIds.length > 0) {
      // Find all files that are marked as resources across all parts
      const allRemovedFiles = []

      // Check each order part for resource files
      orderParts.forEach((part) => {
        // For the current active tab, we'll update the orderPartFiles
        if (part?.id === activeTab) {
          // Find files in this part that are marked as resources
          const partRemovedFiles =
            part?.orderPartFiles?.filter((file) => resourceFileIds.includes(file?.orderPartFile?.fileId)) || []

          // Add these files to our collection of all removed files
          allRemovedFiles.push(...partRemovedFiles)

          // Update orderParts to filter out resource files
          setOrderParts((prev) =>
            prev.map((p) => {
              if (p?.id === activeTab) {
                return {
                  ...p,
                  orderPartFiles: p?.orderPartFiles?.filter(
                    (file) => !resourceFileIds.includes(file?.orderPartFile?.fileId)
                  ),
                }
              }
              return p
            })
          )
        } else {
          // For other tabs, just collect resource files without updating orderParts
          const partRemovedFiles =
            part?.orderPartFiles?.filter((file) => resourceFileIds.includes(file?.orderPartFile?.fileId)) || []

          allRemovedFiles.push(...partRemovedFiles)
        }
      })

      // Update removedFile state with all resource files
      if (allRemovedFiles.length > 0) {
        setRemovedFile(allRemovedFiles)
      }
    }
  }, [activeTab, generalInformationFields?.resourceFileIds])

  const getTaskType = async () => {
    try {
      const res = await getTaskTypeById(selectedTask?.taskTypeId)
      if (res) {
        // Deep clone the response to avoid mutating original data
        const updatedResponse = JSON.parse(JSON.stringify(res))
        // Filter and modify inputs based on workflowConnections
        updatedResponse.inputs = res.inputs
          .map((input) => {
            // Find matching connection for this input
            const connection = selectedWorkflow[selectedPartId]?.workflowConnections?.find(
              (conn) => conn.inputId === input.taskIoputId
            )

            // If connection exists and is TASK_OUTPUT, filter it out
            if (connection && connection.mappingType === 'TASK_OUTPUT') {
              return null
            }

            // Add mappingType to the input object
            return {
              ...input,
              mappingType: connection ? connection.mappingType : 'FILE', // Default to FILE if no connection
            }
          })
          .filter(Boolean) // Remove null values

        setTaskTypeData(updatedResponse)
      }
    } catch (error) {
      console.error('Error fetching task type:', error)
    }
  }

  // Call this whenever selectedTask changes
  useEffect(() => {
    if (selectedTask) {
      getTaskType()
    }
  }, [selectedTask])

  // Handler for task selection
  const handleTaskSelect = (task, orderPartId) => {
    setSelectedTask(task)
    setIsTask(task?.workflowTaskId)
    setActiveTab('configure-workflow')
    setSelectedPartId(orderPartId)

    // Initialize data structure for this orderPart if not exists
    if (!workflowInputData[orderPartId]) {
      setWorkflowInputData((prev) => ({
        ...prev,
        [orderPartId]: [],
      }))
    }
  }

  // Handler for input data changes
  const handleWorkflowInputChange = (orderPartId, taskTypeInputId, workflowTaskId, value, isFile = false) => {
    setWorkflowInputData((prev) => {
      const orderPartData = prev[orderPartId] || []

      // Find existing input by BOTH taskTypeInputId AND workflowTaskId
      const existingInputIndex = orderPartData.findIndex(
        (item) => item.taskTypeInputId === taskTypeInputId && item.workflowTaskId === workflowTaskId
      )

      const newInputData = {
        taskTypeInputId,
        workflowTaskId,
        files: isFile ? value : [],
        data: isFile ? '' : value,
      }

      if (existingInputIndex >= 0) {
        // Update existing input
        const updatedData = [...orderPartData]
        updatedData[existingInputIndex] = newInputData
        return {
          ...prev,
          [orderPartId]: updatedData,
        }
      } else {
        // Add new input
        return {
          ...prev,
          [orderPartId]: [...orderPartData, newInputData],
        }
      }
    })
  }

  // Modified submit handler
  const handleSubmit = async () => {
    setErrorMessage([])
    let count = 0
    try {
      if (generalInformationFields?.status === 'APPROVED') {
        // Validate each order part has a workflow and all required inputs
        for (const part of orderParts) {
          const workflow = selectedWorkflow?.[part?.id]

          // Check if workflow is selected
          if (!workflow) {
            setErrorMessage((prev) => [...prev, `Please select a workflow for ${part.label}`])
            setShowErrorModal(true)
            return
          }

          // Get all required inputs for this workflow's tasks
          const requiredInputs = workflow?.workflowTasks?.flatMap((task) => {
            const taskConnections = workflow?.workflowConnections?.filter(
              (conn) =>
                conn?.inputWorkflowTaskId === task?.workflowTaskId &&
                (conn?.mappingType === 'FILE' || conn?.mappingType === 'DATA')
            )

            return taskConnections?.map((conn) => ({
              taskNameTag: task?.taskNameTag,
              inputId: conn?.inputId,
              mappingType: conn?.mappingType,
              workflowTaskId: task?.workflowTaskId,
              taskTypeId: task?.taskTypeId,
            }))
          })

          // Get current input data for this order part
          const currentInputData = workflowInputData?.[part?.id] || []

          // Validate each required input
          for (const input of requiredInputs) {
            // For FILE type, check if files exist in taskFiles
            if (input?.mappingType === 'FILE') {
              // Check if files exist in taskFiles
              const filesExist = taskFiles?.[part?.id]?.[input.taskTypeId]?.length > 0

              // Find the input data matching BOTH taskTypeInputId AND workflowTaskId
              const inputData = currentInputData.find(
                (data) => data?.taskTypeInputId === input?.inputId && data?.workflowTaskId === input?.workflowTaskId
              )
              const filesInData = inputData?.files?.length > 0

              if (!filesExist && !filesInData) {
                setErrorMessage((prev) => [...prev, `Please upload files for ${part.label} - ${input.taskNameTag}`])
                count++
              }
            } else if (input.mappingType === 'DATA') {
              // Find the input data matching BOTH taskTypeInputId AND workflowTaskId
              const inputData = currentInputData.find(
                (data) => data?.taskTypeInputId === input?.inputId && data?.workflowTaskId === input?.workflowTaskId
              )

              if (!inputData || !inputData?.data || inputData?.data?.trim() === '') {
                setErrorMessage((prev) => [...prev, `Please fill in data for ${part.label} - ${input.taskNameTag}`])
                count++
              }
            }
          }
        }

        if (count > 0) {
          setShowErrorModal(true)
          return
        }

        // If validation passes, proceed with workflow application
        for (const [orderPartId, inputData] of Object.entries(workflowInputData)) {
          const currentWorkflow = selectedWorkflow[orderPartId]
          if (currentWorkflow && inputData.length > 0) {
            await applyWorkflowToOrderPart(orderPartId, currentWorkflow?.workflowId, inputData)
          }
        }
      }

      // Then proceed with order submission
      if (generalInformationFields?.status === 'PENDING_APPROVAL') {
        setShowSubmitModal(true)
      }

      if (generalInformationFields?.status === 'DRAFT') {
        await handleSubmitOrder()
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to submit order')
    }
  }

  return (
    <>
      {isLoading || isApiCall ? (
        <FallbackSpinner />
      ) : (
        <Box sx={{ display: 'flex', position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: -12,
              cursor: 'pointer',
              '@media (max-width: 1299px)': {
                display: 'block',
              },
              '@media (min-width: 1300px)': {
                display: 'none',
              },
            }}
            onClick={() => setIsSidebarOpen(true)}
          >
            <GiHamburgerMenu size={22} color="#000" />
          </Box>
          <Sidebar
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            showConfigureWorkflow={showConfigureWorkflow}
            orderParts={orderParts}
            setOrderParts={setOrderParts}
            onPartStepChange={handlePartStepChange}
            setIsTask={setIsTask}
            isTask={isTask}
            setPreviewFile={setPreviewFile}
            setFilesByTab={setFilesByTab}
            deleteOrderPart={handleDeleteOrderPart}
            isDeleting={isDeleting}
            setInitialState={setInitialState}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            selectedWorkflow={selectedWorkflow}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            setSelectedPartId={setSelectedPartId}
            onTaskSelect={handleTaskSelect}
            isPreviewing={isPreviewing}
          />

          <Box sx={{ flex: 1 }}>
            <Box sx={{ px: 3 }}>
              <Grid
                container
                spacing={3}
                sx={{
                  '& > .MuiGrid-item': { display: 'flex' },
                  '@media (max-width: 991px)': {
                    flexDirection: 'column',
                  },
                }}
              >
                <Grid
                  sx={{
                    height: 'calc(100vh - 180px)',
                    '@media (max-width: 991px)': {
                      width: '100%',
                    },
                  }}
                  item
                  xs={windowWidth ? 12 : 5}
                >
                  <Box
                    sx={{
                      bgcolor: '#fff',
                      py:
                        activeTab === 'configure-workflow'
                          ? taskFiles[selectedPartId]?.[selectedTask?.workflowTaskId]?.length > 0 ||
                            uploadingFiles.length > 0
                            ? '30px'
                            : '0'
                          : filesByTab[activeTab]?.length > 0 || uploadingFiles.length > 0
                            ? '30px'
                            : '0',
                      borderRadius: 1,
                      border:
                        activeTab === 'configure-workflow'
                          ? taskFiles[selectedPartId]?.[selectedTask?.workflowTaskId]?.length > 0 ||
                            uploadingFiles.length > 0
                            ? '0.5px solid #DADCE0'
                            : 'none'
                          : filesByTab[activeTab]?.length > 0 || uploadingFiles.length > 0
                            ? '0.5px solid #DADCE0'
                            : 'none',
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '@media (max-width: 991px)': {
                        // padding: 20,
                      },
                    }}
                  >
                    <FilesSection
                      checkedItems={checkedItems}
                      setCheckedItems={setCheckedItems}
                      files={
                        activeTab === 'configure-workflow'
                          ? taskFiles[selectedPartId]?.[selectedTask?.workflowTaskId] || []
                          : filesByTab[activeTab] || []
                      }
                      uploadingFiles={uploadingFiles}
                      setUploadingFiles={setUploadingFiles}
                      activeTab={activeTab}
                      onPreview={handlePreview}
                      onCreateOrderPart={handleCreateOrderPart}
                      orderParts={orderParts}
                      onFilesUploaded={handleFilesUploaded}
                      onMoveFilesToOrderPart={handleAddFileToOrderPart}
                      onMoveFilesToGeneral={handleMoveFileToGeneral}
                      onMakeFileVisibleAgain={handleMakeFileVisibleAgain}
                      filesByTab={filesByTab}
                      setFilesByTab={setFilesByTab}
                      previewFile={previewFile}
                      setPreviewFile={setPreviewFile}
                      onDeleteFile={handleDeleteFile}
                      setGeneralInformationFields={setGeneralInformationFields}
                      generalInformationFields={generalInformationFields}
                      onCancel={handleCancelUpload}
                      setOrderParts={setOrderParts}
                      removedFile={removedFile}
                      setRemovedFile={setRemovedFile}
                      selectedTask={selectedTask}
                      setTaskFiles={setTaskFiles}
                      selectedWorkflow={selectedWorkflow}
                      taskTypes={taskTypeData}
                      setWorkflowInputData={setWorkflowInputData}
                      selectedPartId={selectedPartId}
                      handleOnSave={handleOnSave}
                      initialState={initialState}
                    />
                  </Box>
                </Grid>

                <Grid
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  sx={{ height: 'calc(100vh - 180px)' }}
                  item
                  xs={windowWidth ? 12 : 7}
                >
                  <Box
                    sx={{
                      bgcolor: '#fff',
                      p: '30px',
                      borderRadius: 1,
                      border: '0.5px solid #DADCE0',
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      // maxHeight: "670px",
                      overflow: 'auto',
                      // justifyContent: "center",
                      scrollbarWidth: 'thin',
                      scrollbarColor: isHovered ? '#DADCE0 #fff' : 'transparent transparent',
                    }}
                  >
                    {previewFile ? (
                      <PreviewFile
                        file={previewFile}
                        setPreviewFile={setPreviewFile}
                        onClose={() => {
                          setPreviewFile(null)
                        }}
                        serviceId={orderParts?.find((part) => part.id === activeTab)?.serviceId}
                        service={allServices?.find(
                          (ele) => ele?.serviceId === orderParts?.find((part) => part.id === activeTab)?.serviceId
                        )}
                        setOrderParts={setOrderParts}
                        orderParts={orderParts}
                        activeTab={activeTab}
                        isPreviewing={isPreviewing}
                        setInitialState={setInitialState}
                        generalInformationFields={generalInformationFields}
                      />
                    ) : (
                      <OrderInformation
                        isPreviewing={isPreviewing}
                        allClients={allClients}
                        allServices={allServices}
                        activeTab={activeTab}
                        orderParts={orderParts}
                        onOrderPartNameChange={handleOrderPartNameChange}
                        setOrderParts={setOrderParts}
                        isTask={isTask}
                        setGeneralInformationFields={setGeneralInformationFields}
                        generalInformationFields={generalInformationFields}
                        handleOnSave={handleOnSave}
                        serviceId={orderParts?.find((part) => part.id === activeTab)?.serviceId}
                        service={allServices?.find(
                          (ele) => ele?.serviceId === orderParts?.find((part) => part.id === activeTab)?.serviceId
                        )}
                        setInitialState={setInitialState}
                        onServiceChange={handleServiceChange}
                        serviceStates={serviceStates}
                        setSelectedWorkflow={setSelectedWorkflow}
                        selectedWorkflow={selectedWorkflow}
                        taskTypeData={taskTypeData}
                        selectedTask={selectedTask}
                        selectedPartId={selectedPartId}
                        onInputChange={handleWorkflowInputChange}
                        workflowInputData={workflowInputData}
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                  mt: 3,
                }}
              >
                <Button
                  disabled={isSaving || !checkForChanges()}
                  onClick={() => handleOnSave()}
                  variant="contained"
                  sx={{
                    width: 'fit-content',
                    fontSize: '14px',
                    fontWeight: 500,
                    textTransform: 'capitalize',
                    bgcolor: '#4489FE',
                    border: '1px solid #4489FE',
                    borderRadius: '4px',
                    padding: '10px 40px',
                  }}
                >
                  {isSaving ? 'Please wait...' : !checkForChanges() ? 'Saved' : 'Save'}
                </Button>
                <Button
                  disabled={isOrderSubmitted}
                  onClick={handleSubmit}
                  variant="contained"
                  sx={{
                    width: 'fit-content',
                    fontSize: '14px',
                    fontWeight: 500,
                    textTransform: 'capitalize',
                    bgcolor: '#4489FE',
                    border: '1px solid #4489FE',
                    borderRadius: '4px',
                    padding: '10px 40px',
                  }}
                >
                  {isOrderSubmitted ? 'Please wait...' : 'Submit Order'}
                </Button>
              </Box>
            </Box>
          </Box>
          {sureModalOpen && (
            <AreYouSureModal
              setShow={handleModalCancel}
              show={sureModalOpen}
              onSave={handleOnSave}
              isLoading={isSaving}
            />
          )}
          {showSubmitModal && (
            <OrderSubmitModal
              show={showSubmitModal}
              setShow={setShowSubmitModal}
              onApprove={handleOrderApprove}
              isLoading={isOrderApproved}
            />
          )}
          {showErrorModal && (
            <ErrorModal show={showErrorModal} setShow={setShowErrorModal} errorMessage={errorMessage} />
          )}
        </Box>
      )}
    </>
  )
}

CreateOrder.permissions = ['order.update']
export default CreateOrder
