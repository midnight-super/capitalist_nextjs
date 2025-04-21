import axios from './index';

const getAllServices = async (data, filterData) => {
  try {
    const endpoint = '/service/all';
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
    return e;
  }
};

const createService = async (data) => {
  try {
    const endpoint = '/service/create';

    const response = await axios.post(endpoint, data);
    return response?.data;
  } catch (e) {
    return e?.response?.data;
  }
};

const deleteService = async (id) => {
  try {
    const endpoint = `/service/delete?serviceId=${id}`;

    const response = await axios.post(endpoint);
    return response?.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const getServiceByID = async (id) => {
  try {
    const endpoint = '/service/' + id;

    const response = await axios.get(endpoint);
    return response?.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const updateService = async (data) => {
  try {
    const endpoint = '/service/update';

    const response = await axios.post(endpoint, data);
    return response?.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export {
  getAllServices,
  createService,
  deleteService,
  getServiceByID,
  updateService,
};
