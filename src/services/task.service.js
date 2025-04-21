import axiosWithAuth from './index'
const getAllStaffTasks = async (data, filterData) => {
  try {
    const endpoint = '/staff/tasks'
    const params = {
      userEmail: data.userEmail,
      page: data.page || 0,
      pageSize: data.pageSize || 25,
      sortBy: data.sortBy || 'desc',
      isDesc: data.isDesc ? true : false,
      isSearch: data.isSearch ? true : false,
    }
    const headers = {
      'Content-Type': 'application/json',
    }
    const response = await axiosWithAuth.post(endpoint, filterData, {
      params,
      headers,
    })
    // response.data.data = Task_List
    return response.data
  } catch (e) {
    console.error('Error:', e.response?.data || e.message)
  }
}

const getAllStaff = async (data, filterData) => {
  try {
    const endpoint = '/staff/all'
    const params = {
      pageSize: data.pageSize || 0,
      sortBy: data.sortBy || 'desc',
      isDesc: data.isDesc ? true : false,
    }
    const headers = {
      'Content-Type': 'application/json',
    }

    const response = await axiosWithAuth.post(endpoint, null, {
      params,
      headers,
    })
    return response.data
  } catch (e) {
    console.error('Error:', e.response?.data || e.message)
  }
}
const getAllTaskType = async (data, filterData) => {
  try {
    const endpoint = '/taskType/all'
    const params = {
      pageSize: data.pageSize || 0,
      sortBy: data.sortBy || 'desc',
      isDesc: data.isDesc ? true : false,
    }
    const headers = {
      'Content-Type': 'application/json',
    }

    const response = await axiosWithAuth.post(endpoint, null, {
      params,
      headers,
    })
    return response.data
  } catch (e) {
    console.error('Error:', e.response?.data || e.message)
  }
}
const getAllAddon = async (data, filterData) => {
  try {
    const endpoint = '/addon/all'
    const params = {
      pageSize: data.pageSize || 0,
      sortBy: data.sortBy || 'desc',
      isDesc: data.isDesc ? true : false,
    }
    const headers = {
      'Content-Type': 'application/json',
    }

    const response = await axiosWithAuth.post(endpoint, null, {
      params,
      headers,
    })
    return response.data
  } catch (e) {
    console.error('Error:', e.response?.data || e.message)
  }
}
const getAllService = async (data, filterData) => {
  try {
    const endpoint = '/service/all'
    const params = {
      pageSize: data.pageSize || 0,
      sortBy: data.sortBy || 'desc',
      isDesc: data.isDesc ? true : false,
    }
    const headers = {
      'Content-Type': 'application/json',
    }

    const response = await axiosWithAuth.post(endpoint, null, {
      params,
      headers,
    })
    return response.data
  } catch (e) {
    console.error('Error:', e.response?.data || e.message)
  }
}
const getAllServiceCategory = async (data, filterData) => {
  try {
    const endpoint = '/service/category/all'
    const params = {
      pageSize: data.pageSize || 0,
      sortBy: data.sortBy || 'desc',
      isDesc: data.isDesc ? true : false,
    }
    const headers = {
      'Content-Type': 'application/json',
    }
    const response = await axiosWithAuth.post(endpoint, null, {
      params,
      headers,
    })
    return response.data
  } catch (e) {
    console.error('Error:', e.response?.data || e.message)
  }
}
const handleOrderUpdateTask = async (data) => {
  try {
    const endpoint = '/order/task/update'
    const headers = {
      'Content-Type': 'application/json',
    }
    const response = await axiosWithAuth.post(endpoint, data, { headers })
    return response?.data
  } catch (e) {
    return e
  }
}
const handleTaskAssign = async (data) => {
  try {
    const endpoint = '/order/task/massAssign'
    const headers = {
      'Content-Type': 'application/json',
    }
    const response = await axiosWithAuth.post(endpoint, data, { headers })
    return response?.data
  } catch (e) {
    return e
  }
}
const handleCreateTask = async (data) => {
  try {
    const endpoint = '/staff/task/create'
    const headers = {
      'Content-Type': 'application/json',
    }
    const response = await axiosWithAuth.post(endpoint, data, { headers })
    return response?.data
  } catch (e) {
    return e
  }
}
export {
  getAllStaffTasks,
  getAllStaff,
  handleOrderUpdateTask,
  handleTaskAssign,
  handleCreateTask,
  getAllAddon,
  getAllService,
  getAllTaskType,
  getAllServiceCategory,
}
