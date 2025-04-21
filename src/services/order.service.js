import axios from './index'

const getAllClients = async (data, filterData) => {
  try {
    const endpoint = '/client/all'
    const headers = {
      'Content-Type': 'application/json',
    }
    const response = await axios.post(endpoint, [], {
      // params,
      headers,
    })
    return response?.data
  } catch (e) {
    console.log(e)
    return 'Server Error'
  }
}

const getAllServices = async (data, filterData) => {
  try {
    const endpoint = '/service/all'
    const headers = {
      'Content-Type': 'application/json',
    }
    const response = await axios.post(endpoint, [], {
      // params,
      headers,
    })
    return response?.data
  } catch (e) {
    console.log(e)
    return 'Server Error'
  }
}

const getAllOrders = async (data, filterData) => {
  try {
    const endpoint = '/order/all'
    const params = {
      ...data,
    }
    const headers = {
      'Content-Type': 'application/json',
    }
    const response = await axios.post(endpoint, filterData, {
      params,
      headers,
    })
    return response?.data
  } catch (e) {
    console.log(e)
    return 'Server Error'
  }
}
const getOrderDetail = async (id) => {
  try {
    const endpoint = `/order/${id}`
    const headers = {
      'Content-Type': 'application/json',
    }
    const response = await axios.get(endpoint)
    return response?.data
  } catch (e) {
    console.log(e)
    return 'Server Error'
  }
}

const handleOrderCreate = async (data) => {
  try {
    const endpoint = '/order/create'
    const headers = {
      'Content-Type': 'application/json',
    }
    const response = await axios.post(endpoint, data, { headers })
    return response?.data
  } catch (e) {
    return e
  }
}
const handleUpdateOrder = async (data) => {
  try {
    const endpoint = '/order/update'
    const headers = {
      'Content-Type': 'application/json',
    }
    const response = await axios.post(endpoint, data, { headers })
    return response?.data
  } catch (e) {
    return e
  }
}

const handleSubmitOrderFunction = async (id) => {
  try {
    const endpoint = `/order/submit?orderId=${id}`
    const headers = {
      'Content-Type': 'application/json',
    }
    const response = await axios.post(endpoint, {}, { headers })
    return response?.data
  } catch (e) {
    return e
  }
}
const handleOrderApproveFunction = async (id) => {
  try {
    const endpoint = `/order/approve?orderId=${id}`
    const headers = {
      'Content-Type': 'application/json',
    }
    const response = await axios.post(endpoint, {}, { headers })
    return response?.data
  } catch (e) {
    return e
  }
}

const handlePendingApprovalFunction = async (id) => {
  try {
    const endpoint = `/order/pendingApproval?orderId=${id}`
    const headers = {
      'Content-Type': 'application/json',
    }
    const response = await axios.post(endpoint, {}, { headers })
    return response?.data
  } catch (e) {
    return e
  }
}

// order-part------------
const handleOrderPartCreate = async (data) => {
  try {
    const endpoint = '/orderPart/create'
    const headers = {
      'Content-Type': 'application/json',
    }
    const response = await axios.post(endpoint, data, { headers })
    return response?.data
  } catch (e) {
    return e
  }
}
const handleOrderPartDelete = async (data) => {
  try {
    const endpoint = '/orderPart/delete'
    const headers = {
      'Content-Type': 'application/json',
    }
    const response = await axios.post(endpoint, data, { headers })
    return response?.data
  } catch (e) {
    return e
  }
}

const uploadOrderFiles = async (orderId, files, onProgress = null, uploadControllersRef) => {
  try {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData()
      formData.append('fileName', file)
      const controller = new AbortController()
      uploadControllersRef.current[file?.name] = controller

      const endpoint = `/order/files/upload?orderId=${orderId}`

      try {
        const response = await axios.post(endpoint, formData, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: onProgress
            ? (progressEvent) => {
                const total = progressEvent.total || 1
                const current = progressEvent.loaded
                const percentage = Math.floor((current / total) * 100)
                onProgress(percentage, file?.name)
              }
            : null,
        })

        return {
          status: 'fulfilled',
          fileId: response?.data[0],
          fileName: file?.name,
        }
      } catch (error) {
        return { status: 'rejected', error, fileName: file?.name }
      }
    })

    // Wait for all uploads to finish
    const results = await Promise.allSettled(uploadPromises)

    const successFiles = results
      .filter((result) => result.status === 'fulfilled')
      .reduce((acc, file) => ({ ...acc, [file.value.fileName]: file.value.fileId }), {})

    const failedFiles = results.filter((result) => result.status === 'rejected').map((file) => file.reason)

    return {
      success: Object.keys(successFiles).length > 0,
      fileIds: successFiles,
      errors: failedFiles.length > 0 ? failedFiles : null,
    }
  } catch (e) {
    console.log(e)
    return { success: false, error: 'Server Error' }
  }
}

const uploadOrderPartFiles = async (orderPartId, files, onProgress = null, uploadControllersRef) => {
  try {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData()
      formData.append('fileName', file)
      const controller = new AbortController()
      uploadControllersRef.current[file?.name] = controller
      const endpoint = `/orderPart/files/upload?orderPartId=${orderPartId}`

      try {
        const response = await axios.post(endpoint, formData, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: onProgress
            ? (progressEvent) => {
                const total = progressEvent.total || 1
                const current = progressEvent.loaded
                const percentage = Math.floor((current / total) * 100)
                onProgress(percentage, file?.name)
              }
            : null,
        })

        return {
          status: 'fulfilled',
          fileId: response?.data[0],
          fileName: file?.name,
        }
      } catch (error) {
        return { status: 'rejected', error, fileName: file?.name }
      }
    })

    // Wait for all uploads to finish
    const results = await Promise.allSettled(uploadPromises)

    const successFiles = results
      .filter((result) => result.status === 'fulfilled')
      .reduce((acc, file) => ({ ...acc, [file.value.fileName]: file.value.fileId }), {})

    const failedFiles = results.filter((result) => result.status === 'rejected').map((file) => file.reason)

    return {
      success: Object.keys(successFiles).length > 0,
      fileIds: successFiles,
      errors: failedFiles.length > 0 ? failedFiles : null,
    }
  } catch (e) {
    console.log(e)
    return { success: false, error: 'Server Error' }
  }
}

const moveFilesToOrderPart = async (orderPartId, fileIds) => {
  try {
    // Convert fileIds array to comma-separated string for query parameter
    const filesQuery = fileIds.join(',')

    const endpoint = `/orderPart/addFileToOrderPart?orderPartId=${orderPartId}&files=${filesQuery}`
    const response = await axios.post(endpoint, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response?.data
  } catch (e) {
    console.log(e)
    return 'Server Error'
  }
}

const moveFilesToGeneral = async (orderPartId, fileIds) => {
  try {
    const filesQuery = fileIds.join(',')

    const endpoint = `/orderPart/moveFileToOrder?orderPartId=${orderPartId}&files=${filesQuery}`
    const response = await axios.post(endpoint, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response?.data
  } catch (e) {
    console.log(e)
    return 'Server Error'
  }
}

// This function will use the same endpoint as moveFilesToGeneral
const makeFileVisibleAgain = async (orderPartId, fileIds) => {
  try {
    const filesQuery = fileIds.join(',')

    const endpoint = `/orderPart/moveFileToOrder?orderPartId=${orderPartId}&files=${filesQuery}`
    const response = await axios.post(endpoint, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response?.data
  } catch (e) {
    console.log(e)
    return 'Server Error'
  }
}

const getOPreviewFIle = async (id, file) => {
  try {
    const endpoint = `/files/preview/${id}`
    const response = await axios.get(endpoint, { responseType: 'blob' })
    const blob = new Blob([response.data], {
      type:
        file?.mediaType === 'AUDIO'
          ? 'audio/mp3'
          : file?.mediaType === 'VIDEO'
            ? 'video/mp4'
            : file?.mediaType?.startsWith('image/')
              ? file?.mediaType
              : file?.mediaType === 'application/pdf'
                ? 'application/pdf'
                : 'application/zip' || 'application/x-zip-compressed',
    })
    const imageURL = URL.createObjectURL(blob)
    return file?.mediaType === 'AUDIO' ? blob : imageURL
  } catch (e) {
    console.error('Error fetching image:', e)
    return 'Server Error'
    return null
  }
}

const handleSelectedOrderApprove = async (ids = []) => {
  try {
    // const OrderQuery = ids?.join(',')
    const params = new URLSearchParams()
    ids?.forEach((id) => params.append('orderId', id))

    const endpoint = `/order/approve?${params.toString()}`
    const headers = {
      'Content-Type': 'application/json',
    }
    const response = await axios.post(endpoint, {}, { headers })
    return response?.data
  } catch (e) {
    return e
  }
}

export {
  getAllClients,
  getAllServices,
  handleOrderCreate,
  handleUpdateOrder,
  getAllOrders,
  getOrderDetail,
  handleOrderPartCreate,
  handleOrderPartDelete,
  uploadOrderFiles,
  uploadOrderPartFiles,
  moveFilesToOrderPart,
  moveFilesToGeneral,
  makeFileVisibleAgain,
  getOPreviewFIle,
  handleSubmitOrderFunction,
  handleOrderApproveFunction,
  handlePendingApprovalFunction,
  handleSelectedOrderApprove,
}
