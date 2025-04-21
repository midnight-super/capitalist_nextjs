/* eslint-disable react-hooks/rules-of-hooks */
import CustomTextArea from '@/components/customTextArea'
import CustomTextField from '@/components/customTextField'
import SearchableSelectField from '@/components/searchableSelectField'
import { addWorkflowStyles } from '@/styles/add-workflow-styles'
import Grid from '@mui/material/Grid2'
import { Box, Button, CircularProgress, FormControl, FormHelperText, Typography } from '@mui/material'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import InputsModal from './modal/inputsModal'
import OutputsModal from './modal/outputsModal'
import { getAllServices } from '@/services/services.service'
import { v4 as uuidv4 } from 'uuid'
import { createWorkflow, getWorkflowByID, updateWorkflow } from '@/services/workflow.service'
import toast from 'react-hot-toast'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import moment from 'moment'
import WarningModal from '../componenets/warningModal'
import UpdateWarningModal from '../componenets/updateWarningModal'
import { getTaskTypeList } from '@/services/taskType.service'
import WorkflowValidationModal from './modal/workflowValidationModal'
import ListsSection from './listsSection'

const defaultValues = {
  name: '',
  description: '',
  service: '',
  taskType: '',
}

const AddWorkflow = ({ handleAddClose, fetchWorkflowList, editId }) => {
  const {
    mainContainer,
    backHeader,
    backArrow,
    addWorkflowText,
    gridContainer,
    addListContainer,
    nameInput,
    descriptionInput,
    loader,
    placeholderText,
    buttonContainer,
    button,
    deleteItemModalText,
    threeDotIcon,
  } = addWorkflowStyles

  const listInputRefs = useRef({})
  const inputRefs = useRef({})
  const descRefs = useRef({})

  const [listContainers, setListContainers] = useState([])

  const [editingItem, setEditingItem] = useState({
    listIndex: null,
    itemIndex: null,
  })
  const [editingDescription, setEditingDescription] = useState({
    listIndex: null,
    itemIndex: null,
  })
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedItem, setSelectedItem] = useState({
    listIndex: null,
    itemIndex: null,
  })
  const [itemMenu, setItemMenu] = useState(null)
  const [menuListIndex, setMenuListIndex] = useState(null)
  const [itemListIndex, setItemListIndex] = useState(null)
  const [inputModal, setInputModal] = useState(false)
  const [outputModal, setOutputModal] = useState(false)
  const [services, setServices] = useState([])
  const [workflowData, setWorkflowData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [selectedItemId, setSelectedItemId] = useState('')
  const [warningOpen, setWarningModal] = useState({
    warning: false,
    update: false,
    item: false,
  })
  const [taskTypeOpen, setTaskTypeOpen] = useState(false)
  const [taskTypeList, setTaskTypeList] = useState([])
  const [selectedType, setSelectedType] = useState(null)
  const [initialListContainers, setInitialListContainers] = useState(null)
  const [taskName, setTaskName] = useState('')
  const [dependentTasks, setDependentTasks] = useState([])
  const [nameError, setNameError] = useState(false)
  const [taskError, setTaskError] = useState(false)
  const [cycleError, setCycleError] = useState(false)
  const [cyclePath, setCyclePath] = useState([])

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required'),
    service: Yup.string().trim().required('Service is required'),
    description: Yup.string().trim().required('Description is required'),
  })

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const listNames = listContainers?.map((data) => data?.name)

  const workflowTasks = listContainers?.flatMap((container) => {
    return container?.items?.map((item, index) => ({
      workflowTaskId: item?.id,
      taskTypeId: '',
      taskTypeName: item?.taskType,
      taskNameTag: item?.name,
      listName: container?.name,
      position: index,
    }))
  })

  const toggleInputModal = (listIndex, itemIndex) => {
    const itemName = listContainers[listIndex]?.items[itemIndex]?.name
    setTaskName(itemName)
    setInputModal((prev) => !prev)
    handleItemMenuClose()
  }

  const toggleOutputModal = (listIndex, itemIndex) => {
    const itemName = listContainers[listIndex]?.items[itemIndex]?.name
    setTaskName(itemName)
    setOutputModal((prev) => !prev)
    handleItemMenuClose()
  }

  const handleMenuOpen = (event, listIndex) => {
    setAnchorEl(event.currentTarget)
    setMenuListIndex(listIndex)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuListIndex(null)
  }

  const handleNewList = () => {
    if (selectedService === '') {
      toast.error('Please select a service first')
    } else {
      let newListNumber = listContainers?.length + 1
      let newListName = `List ${newListNumber}`

      const existingNames = new Set(listContainers?.map((list) => list?.name))

      while (existingNames.has(newListName)) {
        newListNumber++
        newListName = `List ${newListNumber}`
      }
      setListContainers([...listContainers, { name: newListName, items: [], connections: [] }])
    }
  }
  const handleItemMenuClose = () => {
    setItemMenu(null)
    setSelectedItem({ listIndex: null, itemIndex: null })
    setItemListIndex(null)
  }

  const handleDeleteList = (listIndex) => {
    const updatedLists = [...listContainers]
    updatedLists?.splice(listIndex, 1)
    setListContainers(updatedLists)
    handleMenuClose()
  }

  const handleDeleteItem = (listIndex, itemIndex) => {
    setListContainers((prev) =>
      prev?.map((list, index) => {
        if (index === listIndex) {
          const deletedTaskId = list?.items[itemIndex]?.id

          const updatedItems = list?.items?.filter((_, i) => i !== itemIndex)

          const updatedConnections = list?.connections?.filter(
            (conn) => conn.inputWorkflowTaskId !== deletedTaskId && conn.outputWorkflowTaskId !== deletedTaskId
          )

          return {
            ...list,
            items: updatedItems,
            connections: updatedConnections,
          }
        }
        return list
      })
    )

    handleItemMenuClose()
  }

  const detectCycles = () => {
    const tasks = workflowTasks || []
    const connections = listContainers.flatMap((container) => container.connections || [])

    const graph = {}
    tasks.forEach((task) => {
      graph[task.workflowTaskId] = []
    })
    connections.forEach((conn) => {
      if (conn.inputWorkflowTaskId === conn.outputWorkflowTaskId) {
        return
      }
      if (graph[conn.outputWorkflowTaskId]) {
        graph[conn.outputWorkflowTaskId].push(conn.inputWorkflowTaskId)
      }
    })

    const visited = new Set()
    const recStack = new Set()
    const cycles = []

    const dfs = (node, path) => {
      if (recStack.has(node)) {
        const cycleStartIndex = path.indexOf(node)
        const cycle = path.slice(cycleStartIndex).concat(node)
        cycles.push(cycle)
        return
      }

      if (visited.has(node)) return

      visited.add(node)
      recStack.add(node)

      for (const neighbor of graph[node] || []) {
        dfs(neighbor, [...path, node])
      }

      recStack.delete(node)
    }

    for (const node in graph) {
      visited.clear()
      recStack.clear()
      dfs(node, [])
    }

    const uniqueCycles = Array.from(new Set(cycles.map(JSON.stringify))).map(JSON.parse)

    return uniqueCycles.length > 0 ? uniqueCycles : null
  }

  const openWarningModal = (type, listIndex, itemIndex) => {
    if (type === 'warning') {
      setWarningModal((prev) => ({ ...prev, warning: true }))
    } else if (type === 'list') {
      handleDeleteList(listIndex)
    } else {
      let dependentTaskNames = []

      listContainers?.forEach((container) => {
        container?.connections?.forEach((connection) => {
          if (connection?.outputWorkflowTaskId === selectedItemId) {
            const task = container.items?.find((task) => task.id === connection.outputId)
            if (task) {
              dependentTaskNames.push(task.name)
            }
          }
        })
      })
      if (dependentTaskNames.length > 0) {
        setDependentTasks(dependentTaskNames)
        setWarningModal((prev) => ({ ...prev, item: true }))

        handleItemMenuClose()
      } else {
        handleDeleteItem(listIndex, itemIndex)
      }
      setSelectedItem({ listIndex, itemIndex })
    }
  }

  const handleWarningClose = (type) => {
    if (type === 'warning') {
      setWarningModal((prev) => ({ ...prev, warning: false }))
      handleAddClose()
    } else if (type === 'update') {
      setWarningModal((prev) => ({ ...prev, update: false }))
      setListContainers([])
      setValue('service', '')
      setSelectedService('')
    } else {
      setWarningModal((prev) => ({ ...prev, item: false }))
      handleDeleteItem(selectedItem?.listIndex, selectedItem?.itemIndex)
    }
  }

  const handleServiceChange = () => {
    if (listContainers?.length > 0) {
      setWarningModal((prev) => ({ ...prev, update: true }))
    }
  }

  const handleItemMenuOpen = (event, listIndex, itemIndex, itemId, taskType) => {
    setItemMenu(event?.currentTarget)
    setSelectedItem({ listIndex, itemIndex })
    setMenuListIndex(listIndex)
    setItemListIndex(itemIndex)
    setSelectedItemId(itemId)
    setSelectedType(taskType)
  }

  const handleAddItem = (listIndex) => {
    const updatedLists = [...listContainers]
    let newItemNumber = updatedLists[listIndex]?.items?.length + 1
    let newItemName = `Task ${newItemNumber}`

    const existingNames = new Set(updatedLists?.flatMap((list) => list?.items?.map((item) => item?.name) || []))

    while (existingNames.has(newItemName)) {
      newItemNumber++
      newItemName = `Task ${newItemNumber}`
    }

    updatedLists[listIndex]?.items?.push({
      id: uuidv4(),
      name: newItemName,
      description: null,
      taskType: selectedType,
    })
    setListContainers(updatedLists)
    const newItemIndex = updatedLists[listIndex]?.items?.length - 1
    setEditingItem({ listIndex, itemIndex: newItemIndex })

    setTimeout(() => {
      if (inputRefs.current[`${listIndex}-${newItemIndex}`]) {
        inputRefs.current[`${listIndex}-${newItemIndex}`].focus()
        inputRefs.current[`${listIndex}-${newItemIndex}`].select()
        inputRefs.current[`${listIndex}-${newItemIndex}`].color = '#fff'
      }
    }, 0)
  }

  const handleItemChange = (listIndex, itemIndex, value) => {
    const updatedLists = [...listContainers]
    const lowerValue = value?.toLowerCase()
    const isNameDuplicate = updatedLists?.some((list) =>
      list?.items?.some((item) => item?.name?.toLowerCase() === lowerValue)
    )

    if (isNameDuplicate) {
      setTaskError(true)
      updatedLists[listIndex].items[itemIndex].name = value
      setListContainers(updatedLists)
    } else {
      setTaskError(false)
      updatedLists[listIndex].items[itemIndex].name = value
      setListContainers(updatedLists)
    }
  }

  const handleDescriptionChange = (listIndex, itemIndex, value) => {
    const updatedLists = [...listContainers]
    updatedLists[listIndex].items[itemIndex].description = value
    setListContainers(updatedLists)
  }

  const toggleEditItem = (listIndex, itemIndex = null) => {
    if (editingItem.listIndex === listIndex && editingItem.itemIndex === itemIndex) {
      setEditingItem({ listIndex: null, itemIndex: null })
    } else {
      setEditingItem({ listIndex, itemIndex })
    }
    handleItemMenuClose()
    handleMenuClose()
    if (itemIndex === null) {
      setTimeout(() => {
        const inputKey = `${listIndex}`
        if (listInputRefs.current[inputKey]) {
          listInputRefs.current[inputKey].focus()
          listInputRefs.current[inputKey].select()
        }
      }, 100)
    } else {
      setTimeout(() => {
        const inputKey = `${listIndex}-${itemIndex}`
        if (inputRefs.current[inputKey]) {
          inputRefs.current[inputKey].focus()
          inputRefs.current[inputKey].select()
        }
      }, 100)
    }
  }

  const toggleEditDescription = (listIndex, itemIndex = null) => {
    if (editingDescription.listIndex === listIndex && editingDescription.itemIndex === itemIndex) {
      setEditingDescription({ listIndex: null, itemIndex: null })
    } else {
      setEditingDescription({ listIndex, itemIndex })
    }
    handleItemMenuClose()
    setTimeout(() => {
      const inputKey = `${listIndex}-${itemIndex}`
      if (descRefs.current[inputKey]) {
        descRefs.current[inputKey].focus()
        descRefs.current[inputKey].select()
      }
    }, 100)
  }

  const handleListNameChange = (listIndex, value) => {
    const updatedLists = [...listContainers]
    const lowerValue = value?.toLowerCase()

    if (updatedLists.some((list, index) => index !== listIndex && list?.name?.toLowerCase() === lowerValue)) {
      setNameError(true)
      updatedLists[listIndex].name = value
      setListContainers(updatedLists)
    } else {
      setNameError(false)
      updatedLists[listIndex].name = value
      setListContainers(updatedLists)
    }
  }

  const handleAddDescription = (listIndex, itemIndex) => {
    const updatedLists = [...listContainers]
    if (!updatedLists[listIndex]?.items[itemIndex]?.description) {
      updatedLists[listIndex].items[itemIndex].description = ''
    }
    setListContainers(updatedLists)
    setEditingDescription({ listIndex, itemIndex })
    handleItemMenuClose()
    setTimeout(() => {
      if (descRefs.current[`${listIndex}-${itemIndex}`]) {
        descRefs.current[`${listIndex}-${itemIndex}`].focus()
        descRefs.current[`${listIndex}-${itemIndex}`].select()
        descRefs.current[`${listIndex}-${itemIndex}`].color = '#fff'
      }
    }, 0)
  }

  const handleDuplicateList = (listIndex) => {
    const updatedLists = [...listContainers]
    const listToDuplicate = updatedLists[listIndex]
    if (listToDuplicate) {
      const existingDuplicates = updatedLists?.filter((list) => list?.name?.startsWith(listToDuplicate?.name))?.length
      const duplicatedList = {
        ...JSON.parse(JSON.stringify(listToDuplicate)),
        id: uuidv4(),
        name: `${listToDuplicate?.name} - ${existingDuplicates}`,
        items:
          listToDuplicate?.items?.map((item) => ({
            ...JSON.parse(JSON.stringify(item)),
            id: uuidv4(),
          })) || [],
      }

      updatedLists.push(duplicatedList)
      setListContainers(updatedLists)
    }
    handleMenuClose()
  }

  const handleDuplicateItem = (listIndex, itemIndex) => {
    const updatedLists = [...listContainers]
    const itemToDuplicate = updatedLists[listIndex]?.items[itemIndex]
    if (itemToDuplicate) {
      const existingDuplicates = updatedLists[listIndex]?.items?.filter((item) =>
        item?.name?.startsWith(itemToDuplicate?.name)
      ).length
      const duplicatedItem = {
        ...JSON.parse(JSON.stringify(itemToDuplicate)),
        id: uuidv4(),
        name: `${itemToDuplicate?.name} - ${existingDuplicates}`,
      }

      updatedLists[listIndex]?.items?.push(duplicatedItem)
      setListContainers(updatedLists)
    }
    handleItemMenuClose()
  }

  const handelMoveLeft = (index) => {
    if (index > 0 && index < listContainers?.length) {
      const newList = [...listContainers]
      ;[newList[index - 1], newList[index]] = [newList[index], newList[index - 1]]
      setListContainers(newList)
    } else {
      console.warn('Invalid index or no previous element to swap.')
    }
    handleMenuClose()
  }

  const handelMoveRight = (index) => {
    if (index >= 0 && index < listContainers?.length - 1) {
      const newList = [...listContainers]
      ;[newList[index], newList[index + 1]] = [newList[index + 1], newList[index]]
      setListContainers(newList)
    } else {
      console.warn('Invalid index or no next element to swap.')
    }
    handleMenuClose()
  }

  const handelMoveUp = (listIndex, itemIndex) => {
    if (listIndex >= 0 && listIndex < listContainers?.length) {
      const newList = [...listContainers]
      const items = [...newList[listIndex].items]

      if (itemIndex > 0 && itemIndex < items.length) {
        ;[items[itemIndex - 1], items[itemIndex]] = [items[itemIndex], items[itemIndex - 1]]
        newList[listIndex].items = items
        setListContainers(newList)
      } else {
        console.warn('Invalid item index or no previous item to swap.')
      }
    } else {
      console.warn('Invalid list index.')
    }
    handleItemMenuClose()
  }

  const handelMoveDown = (listIndex, itemIndex) => {
    if (listIndex >= 0 && listIndex < listContainers?.length) {
      const newList = [...listContainers]
      const items = [...newList[listIndex].items]

      if (itemIndex >= 0 && itemIndex < items.length - 1) {
        ;[items[itemIndex], items[itemIndex + 1]] = [items[itemIndex + 1], items[itemIndex]]
        newList[listIndex].items = items
        setListContainers(newList)
      } else {
        console.warn('Invalid item index or no next item to swap.')
      }
    } else {
      console.warn('Invalid list index.')
    }
    handleItemMenuClose()
  }

  const handleTasktypeCancel = () => {
    setTaskTypeOpen(false)
    setSelectedType(null)
    setValue('taskType', '')
  }

  const handleTasktypeClose = (listIndex) => {
    setTaskTypeOpen(false)
    handleAddItem(listIndex)
    setSelectedType(null)
    setValue('taskType', '')
  }

  const handleAddItemClick = (listIndex) => {
    setTaskTypeOpen(true)
    setMenuListIndex(listIndex)
  }

  const hasWorkflowChanged = () => {
    if (!initialListContainers || !listContainers) return false
    return JSON.stringify(listContainers) !== initialListContainers
  }

  const mapCycleToNames = (cyclePath, listContainers) => {
    const allTasks = listContainers.flatMap((c) => c.items)
    const taskById = {}
    allTasks.forEach((t) => {
      taskById[t.id] = t.name
    })
    const namePath = cyclePath.map((id) => taskById[id] || id)
    return namePath
  }

  const handleSave = async () => {
    const values = getValues()
    const mergedConnections = listContainers.flatMap((container) => container.connections)

    try {
      const editData = {
        workflowId: editId,
        workflowName: values?.name,
        description: values?.description,
        serviceId: values?.service,
        listNames: listNames,
        workflowTasks: workflowTasks,
        workflowConnections: mergedConnections,
        status: 'DRAFT',
      }

      setLoading(true)
      const res = await updateWorkflow(editData)
      if (res && res !== 'REQUEST FAILED TO PROCESS' && res !== 'OPERATION_FAILURE') {
        toast.success('Workflow saved as draft.')
        setLoading(false)
        fetchWorkflowList && fetchWorkflowList()
        setInitialListContainers(JSON.stringify(listContainers))
      } else {
        toast.error('Failed to save workflow.')
        setLoading(false)
      }
    } catch (error) {
      toast.error(error?.message || 'An unknown error occurred')
      setLoading(false)
    }
  }

  const onSubmit = async () => {
    const values = getValues()
    const mergedConnections = listContainers.flatMap((container) => container.connections)

    const cycles = detectCycles()
    let cycleNamePaths = []
    if (cycles) {
      cycleNamePaths = cycles.map((cycle) => mapCycleToNames(cycle, listContainers))
    }

    if (cycles) {
      setCyclePath(cycleNamePaths)
      setCycleError(true)
      return
    }

    try {
      const workflowData = {
        ...(editId ? { workflowId: editId } : {}),
        workflowName: values?.name,
        description: values?.description,
        serviceId: values?.service,
        listNames: listNames,
        workflowTasks: workflowTasks,
        workflowConnections: mergedConnections,
        ...(editId ? {} : { createdAt: moment().format('YYYY-MM-DDTHH:mm:ss') }),
        status: 'ACTIVE',
      }

      setLoading(true)
      const res = editId ? await updateWorkflow(workflowData) : await createWorkflow(workflowData)

      if (res && res !== 'REQUEST FAILED TO PROCESS' && res !== 'OPERATION_FAILURE') {
        toast.success(`Workflow ${editId ? 'updated' : 'added'} Successfully.`)
        setLoading(false)
        fetchWorkflowList && fetchWorkflowList()
        toggleInputModal()
        handleAddClose()
      } else {
        toast.error(`Failed to ${editId ? 'update' : 'create'} workflow.`)
        setLoading(false)
      }
    } catch (error) {
      toast.error(error?.message || 'An unknown error occurred')
      setLoading(false)
    }
  }

  const fetchWorkflowDetail = async () => {
    setLoading(true)
    const res = await getWorkflowByID(editId)
    if (res) {
      setWorkflowData(res)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }

  const fetchServices = async () => {
    const res = await getAllServices()
    if (res?.success) {
      setServices(
        res.data?.map((item) => {
          return {
            label: item?.serviceName,
            value: item?.serviceId,
          }
        })
      )
    } else {
      toast.error(res?.message || 'Server Error: Failed to fetch')
    }
  }

  const fetchTaskTypes = async () => {
    const filter = [
      {
        attribute: 'serviceId',
        operator: 'EQUAL',
        value: [selectedService],
      },
    ]
    const res = await getTaskTypeList('', filter)
    if (res?.success) {
      setTaskTypeList(
        res?.data?.map((item) => {
          return {
            label: item?.taskTypeName,
            value: item?.taskTypeName,
          }
        })
      )
    } else {
      toast.error(res?.message || 'Server Error: Failed to fetch')
    }
  }

  const allItems = listContainers.map((group) => group?.items)?.flat()

  useEffect(() => {
    if (editId) {
      fetchWorkflowDetail()
    }
    fetchServices()
  }, [editId])

  useEffect(() => {
    if (selectedService) {
      fetchTaskTypes()
    }
    setInitialListContainers(JSON.stringify(listContainers))
  }, [selectedService])

  useEffect(() => {
    if (workflowData) {
      setValue('name', workflowData?.workflowName)
      setValue('description', workflowData?.description)
      setValue('service', workflowData?.serviceId)
      setSelectedService(workflowData?.serviceId)
      const transformedListContainers = workflowData?.workflowTasks?.reduce((acc, task) => {
        const { listName, taskNameTag, workflowTaskId, taskTypeName } = task

        let list = acc?.find((container) => container?.name === listName)

        if (!list) {
          list = { name: listName, items: [] }
          acc?.push(list)
        }

        list.items.push({
          taskType: taskTypeName,
          name: taskNameTag,
          description: null,
          id: workflowTaskId,
        })

        return acc
      }, [])

      const updatedListContainers = transformedListContainers.map((list) => {
        const listItemIds = list.items.map((item) => item.id)

        const relatedConnections =
          workflowData?.workflowConnections?.filter(
            (connection) =>
              listItemIds.includes(connection?.inputWorkflowTaskId) ||
              listItemIds.includes(connection?.outputWorkflowTaskId)
          ) || []

        return {
          ...list,
          connections: relatedConnections,
        }
      })

      setListContainers(updatedListContainers || [])
      setInitialListContainers(JSON.stringify(updatedListContainers))
    }
  }, [workflowData])

  return (
    <Box sx={mainContainer}>
      <Box sx={backHeader}>
        <Image
          src="/icons/backIcon.svg"
          alt="cross"
          width={30}
          height={30}
          style={backArrow}
          onClick={() => {
            if (hasWorkflowChanged()) {
              openWarningModal('warning')
            } else {
              handleAddClose()
            }
          }}
        />
        <Typography sx={addWorkflowText}>{editId ? 'Update Workflow' : 'Back to Workflows'}</Typography>
      </Box>
      {loading && (
        <div style={loader}>
          <CircularProgress />
        </div>
      )}
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ ...gridContainer, filter: loading ? 'blur(5px)' : 'none' }}
      >
        <Grid item size={4}>
          <FormControl fullWidth sx={nameInput}>
            <Controller
              name="name"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  type="name"
                  value={value}
                  label="Workflow Name"
                  disabled={false}
                  onChange={(event) => {
                    const newValue = event.target.value
                    onChange(newValue)
                  }}
                  error={!!errors.name}
                  workflow={true}
                />
              )}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ ...nameInput, mt: 1 }}>
            <Controller
              name="service"
              control={control}
              render={({ field: { value, onChange } }) => (
                <SearchableSelectField
                  value={value}
                  label="Service"
                  onChange={onChange}
                  error={!!errors.service}
                  options={services}
                  add={false}
                  setSelectedService={setSelectedService}
                  listContainers={listContainers}
                  handleServiceChange={handleServiceChange}
                />
              )}
            />
            {errors.service && <FormHelperText sx={{ color: 'error.main' }}>{errors.service.message}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item size={8}>
          <FormControl fullWidth sx={descriptionInput}>
            <Controller
              name="description"
              control={control}
              render={({ field: { value, onChange } }) => (
                <CustomTextArea
                  type="description"
                  value={value}
                  label="Description"
                  disabled={false}
                  onChange={(event) => {
                    const newValue = event.target.value
                    onChange(newValue)
                  }}
                  error={!!errors.description}
                  minRows={4.4}
                  maxRows={4.4}
                />
              )}
            />
            {errors.description && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
      <DndProvider backend={HTML5Backend}>
        <Box
          sx={{
            ...addListContainer,
            opacity: selectedService === '' ? 0.4 : 1,
            filter: loading ? 'blur(5px)' : 'none',
          }}
        >
          {listContainers.map((list, listIndex) => (
            <ListsSection
              key={listIndex}
              list={list}
              listIndex={listIndex}
              listContainers={listContainers}
              setListContainers={setListContainers}
              editingItem={editingItem}
              listInputRefs={listInputRefs}
              handleListNameChange={handleListNameChange}
              handleMenuOpen={handleMenuOpen}
              anchorEl={anchorEl}
              menuListIndex={menuListIndex}
              handleMenuClose={handleMenuClose}
              handleDuplicateList={handleDuplicateList}
              handelMoveRight={handelMoveRight}
              handelMoveLeft={handelMoveLeft}
              openWarningModal={openWarningModal}
              editingDescription={editingDescription}
              toggleEditItem={toggleEditItem}
              toggleEditDescription={toggleEditDescription}
              handleItemChange={handleItemChange}
              handleDescriptionChange={handleDescriptionChange}
              handleItemMenuOpen={handleItemMenuOpen}
              handleItemMenuClose={handleItemMenuClose}
              selectedItem={selectedItem}
              itemMenu={itemMenu}
              itemListIndex={itemListIndex}
              handleAddDescription={handleAddDescription}
              handleDuplicateItem={handleDuplicateItem}
              handelMoveUp={handelMoveUp}
              handelMoveDown={handelMoveDown}
              handleDeleteItem={handleDeleteItem}
              toggleInputModal={toggleInputModal}
              toggleOutputModal={toggleOutputModal}
              inputRefs={inputRefs}
              descRefs={descRefs}
              taskTypeOpen={taskTypeOpen}
              taskTypeList={taskTypeList}
              handleTasktypeCancel={handleTasktypeCancel}
              handleTasktypeClose={handleTasktypeClose}
              handleAddItemClick={handleAddItemClick}
              control={control}
              setSelectedType={setSelectedType}
              selectedType={selectedType}
              taskError={taskError}
              nameError={nameError}
            />
          ))}
          <Image
            src="/icons/newList.svg"
            alt="new list"
            width={285}
            height={390}
            style={threeDotIcon}
            onClick={handleNewList}
          />
        </Box>
      </DndProvider>
      <Typography sx={placeholderText}>Press enter in the input field to save list and item names.</Typography>
      <Box sx={buttonContainer}>
        <Button
          variant="outlined"
          sx={{
            ...button,
            color: '#757575',
            border: '1px solid #DEE0E4',
          }}
          onClick={handleAddClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            ...button,
            color: '#fff',
          }}
          onClick={handleSubmit(onSubmit)}
        >
          {editId ? 'Update Workflow' : 'Submit Workflow'}
        </Button>
      </Box>
      {inputModal && (
        <InputsModal
          open={inputModal}
          close={toggleInputModal}
          workflowTasks={workflowTasks}
          workflowConnections={listContainers?.flatMap((list) => list?.connections)}
          editId={editId}
          selectedItemId={selectedItemId}
          setListContainers={setListContainers}
          selectedService={selectedService}
          listIndex={menuListIndex}
          selectedType={selectedType}
          allItems={allItems}
          taskName={taskName}
        />
      )}
      {outputModal && (
        <OutputsModal
          open={outputModal}
          close={toggleOutputModal}
          workflowTasks={workflowTasks}
          workflowConnections={listContainers?.flatMap((list) => list?.connections)}
          editId={editId}
          selectedItemId={selectedItemId}
          setListContainers={setListContainers}
          selectedService={selectedService}
          listIndex={menuListIndex}
          selectedType={selectedType}
          allItems={allItems}
          taskName={taskName}
          listContainers={listContainers}
        />
      )}
      {warningOpen?.warning && (
        <WarningModal
          open={warningOpen?.warning}
          close={() => setWarningModal((prev) => ({ ...prev, warning: false }))}
          closeAll={() => handleWarningClose('warning')}
        />
      )}
      {warningOpen?.update && (
        <UpdateWarningModal
          open={warningOpen?.update}
          title={'Are you sure you want to update, your dependent changes will be lost?'}
          close={() => setWarningModal((prev) => ({ ...prev, update: false }))}
          closeAll={() => handleWarningClose('update')}
        />
      )}
      {warningOpen?.item && (
        <UpdateWarningModal
          open={warningOpen?.item}
          title={
            <>
              This task has dependencies in{' '}
              <span style={deleteItemModalText}>{[...new Set(dependentTasks)].join(', ')}</span> task.
              <br />
              Deleting it will remove those configurations. Are you sure?
            </>
          }
          close={() => setWarningModal((prev) => ({ ...prev, item: false }))}
          closeAll={() => handleWarningClose('item')}
        />
      )}
      {cycleError && (
        <WorkflowValidationModal
          open={cycleError}
          close={() => {
            setCycleError(false)
            setCyclePath([])
          }}
          message={
            cyclePath.length
              ? cyclePath.map((path, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <br />}
                    {`Circular dependency ${index + 1}: ${path.join(' → ')}`}
                  </React.Fragment>
                ))
              : ''
          }
        />
      )}
    </Box>
  )
}

export default AddWorkflow
