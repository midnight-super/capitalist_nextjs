import axios from './index';

export const getAllRoles = async () => {
  try {
    const response = await axios.get('/role/all');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createRole = async (roleData) => {
  try {
    const response = await axios.post('/role/create', roleData);
    return response.data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

export const updateRole = async (roleData) => {
  try {
    const response = await axios.post(`/role/update`, roleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRole = async (id) => {
  try {
    const response = await axios.post(`/role/delete?roleId=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRoleById = async (id) => {
  try {
    const response = await axios.get(`/role/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
