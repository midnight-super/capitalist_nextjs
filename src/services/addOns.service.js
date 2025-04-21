import axios from './index';

const getAddOnsList = async (data, filterData) => {
  try {
    const endpoint = '/addon/all';
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

const createAddOns = async (data) => {
  try {
    const endpoint = '/addon/create';

    const response = await axios.post(endpoint, data);
    return response?.data;
  } catch (e) {
    return e?.response?.data;
  }
};

const getAddOnsById = async (id) => {
  try {
    const endpoint = '/addon/' + id;

    const response = await axios.get(endpoint);
    return response?.data;
  } catch (e) {
    return e;
  }
};

const updateAddOns = async (data) => {
  try {
    const endpoint = '/addon/update';

    const response = await axios.post(endpoint, data);
    return response?.data;
  } catch (e) {
    return e;
  }
};

const deleteAddOns = async (id) => {
  try {
    const endpoint = `/addon/delete?addonId=${id}`;

    const response = await axios.post(endpoint);
    return response?.data;
  } catch (e) {
    return e;
  }
};

export { getAddOnsList, createAddOns, getAddOnsById , updateAddOns, deleteAddOns};
