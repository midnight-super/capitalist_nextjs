import axios from './index';

const getTaskTypeList = async (data, filterData) => {
  try {
    const endpoint = '/taskType/all';
    const params = {
      ...data,
      page: data?.page || 0,
      pageSize: data?.pageSize || 25,
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    const response = await axios.post(endpoint, filterData, {
      params,
      headers,
    });
    return response?.data;
  } catch (e) {
    return 'Server Error';
  }
};

const createTaskType = async (data) => {
  try {
    const endpoint = '/taskType/create';

    const response = await axios.post(endpoint, data);
    return response?.data;
  } catch (e) {
    return e?.response?.data;
  }
};

const getTaskTypeById = async (id) => {
  try {
    const endpoint = '/taskType/' + id;

    const response = await axios.get(endpoint);
    return response?.data;
  } catch (e) {
    return e;
  }
};

const updateTaskType = async (data) => {
  try {
    const endpoint = '/taskType/update';

    const response = await axios.post(endpoint, data);
    return response?.data;
  } catch (e) {
    return e;
  }
};

const deleteTaskType = async (id) => {
  try {
    const endpoint = `/taskType/delete?taskTypeId=${id}`;

    const response = await axios.post(endpoint);
    return response?.data;
  } catch (e) {
    return e;
  }
};

export { getTaskTypeList, createTaskType, getTaskTypeById , updateTaskType, deleteTaskType};
