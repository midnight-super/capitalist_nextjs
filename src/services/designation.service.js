import axios from './index';

const getAllDesignation = async (data, filterData) => {
  try {
    const endpoint = '/designation/all';
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
  } catch (error) {
    return error;
  }
};
const createDesignation = async (data) => {
  try {
    const endpoint = '/designation/create';

    const response = await axios.post(endpoint, data);
    return response?.data;
  } catch (e) {
    return e?.response?.data;
  }
};
const deleteDesignation = async (id) => {
  try {
    const endpoint = `/designation/delete?designationId=${id}`;

    const response = await axios.post(endpoint);
    return response?.data;
  } catch (e) {
    return e;
  }
};
const getDesignationByID = async (id) => {
  try {
    const endpoint = '/designation/' + id;

    const response = await axios.get(endpoint);
    return response?.data;
  } catch (e) {
    return e;
  }
};

const updateDesignation = async (data) => {
  try {
    const endpoint = '/designation/update';

    const response = await axios.post(endpoint, data);
    return response?.data;
  } catch (e) {
    return e;
  }
};

export { getAllDesignation, createDesignation, deleteDesignation, getDesignationByID,updateDesignation };