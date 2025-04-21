import axios from './index';

const getAllClients = async (data, filterData) => {
  try {
    const endpoint = '/rt/client/user/all';
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
    return response.data;
  } catch (e) {
    return 'Server Error';
  }
};

const create = async (data) => {
  try {
    const endpoint = '/rt/client/user/create';

    const response = await axios.post(endpoint, data);
    return response.data;
  } catch (e) {
    return e?.response?.data;
  }
};
const deactivate = async (userId) => {
  try {
    const endpoint = `/rt/client/user/deactivate/${userId}`;

    const response = await axios.post(endpoint);
    return response.data;
  } catch (e) {
    return e?.response?.data;
  }
};
const activate = async (userId) => {
  try {
    const endpoint = `/rt/client/user/activate/${userId}`;

    const response = await axios.post(endpoint);
    return response.data;
  } catch (e) {
    return e?.response?.data;
  }
};
const update = async (data) => {
  try {
    const endpoint = '/rt/client/user/update';

    const response = await axios.post(endpoint, data);
    return response.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};
const getByID = async (id) => {
  try {
    const endpoint = '/rt/client/user/' + id;

    const response = await axios.get(endpoint);
    return response.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};
const remove = async (userId) => {
  try {
    const endpoint = `/rt/client/user/delete?userId=${userId}`;

    const response = await axios.post(endpoint);
    return response.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const resetPassword = async (staffId, payload) => {
  try {
    const endpoint = `/rt/client/user/resetPassword?staffId=${staffId}`;
    
    const response = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      transformRequest: [(data) => data],
    });

    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    return error.response ? error.response.data : error.message;
  }
};


// user management client 
export const getClientList = async (data, filterData) => {
  try {
    const endpoint = 'client/all';
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
    return response.data;
  } catch (e) {
    console.log(e);

    return 'Server Error';
  }
};

export const getClientByID = async (id) => {
  try {
    const response = await axios.get(`/client/${id}`);
    console.log('Client details:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching client:', error);
    throw error;
  }
};

export const createClient = async (data) => {
  try {
    const endpoint = '/client/create';
    const response = await axios.post(endpoint, data);
    console.log('Client creation payload:', data);
    return response?.data;
  } catch (e) {
    console.error('Client creation error:', e);
    return e?.response?.data;
  }
};

export const updateClient = async (data) => {
  try {
    const response = await axios.post(`/client/update`, data);
    return response.data;
  } catch (error) {
    return error.response?.data?.message || 'Something went wrong';
  }
};

export const deleteClient = async (clientId) => {
  try {
    const response = await axios.post(`/client/delete?clientId=${clientId}`);
    return response.data;
  } catch (error) {
    console.error('Error in deleteClient:', error);
    throw error.response?.data?.message || 'Failed to delete client';
  }
};

export default resetPassword;

export {
  getAllClients,
  create,
  deactivate,
  activate,
  update,
  getByID,
  remove,
  resetPassword,
};
