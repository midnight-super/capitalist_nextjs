import axios from './index';

const getStaffList = async (data, filterData) => {
  try {
    const endpoint = '/staff/all';
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

const createStaff = async (data) => {
  try {
    const endpoint = '/staff/create';
    const response = await axios.post(endpoint, data);
    return response?.data;
  } catch (e) {
    return e?.response?.data;
  }
};

const getStaffByID = async (id) => {
  try {
    const endpoint = '/staff/' + id;

    const response = await axios.get(endpoint);
    return response?.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const updateStaff = async (data) => {
  try {
    const endpoint = '/staff/update';

    const response = await axios.post(endpoint, data);
    return response?.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const deleteStaff = async (id) => {
  try {
    const endpoint = `/staff/delete?staffId=${id}`;
    const response = await axios.post(endpoint);
    return response?.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const updateStaffPassword = async ({ staffId, currentPassword, newPassword }) => {
  try {
    const response = await axios.post(`/staff/updatePassword?staffId=${staffId}`, {
      newPassword,
      currentPassword
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please log in again');
    }
    throw new Error(error.response?.data?.message || 'Failed to update password');
  }
};

export const blockStaff = async (staffId) => {
  try {
    const response = await axios.post(`/staff/block?staffId=${staffId}`);
    return response.data;
  } catch (error) {
    console.error('Error blocking staff:', error);
    throw error;
  }
};

export const unblockStaff = async (staffId) => {
  try {
    const response = await axios.post(`/staff/unblock?staffId=${staffId}`);
    return response.data;
  } catch (error) {
    console.error('Error unblocking staff:', error);
    throw error;
  }
};

export { getStaffList, createStaff, getStaffByID, updateStaff, deleteStaff };
