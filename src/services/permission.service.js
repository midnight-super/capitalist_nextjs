import axios from './index';

export const getAllPermission = async () => {
  try {
    const response = await axios.get('/permissionTemplate/all', {

    });
    console.log(response);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPermission = async (permissionData) => {
  try {
    const response = await axios.post('/permissionTemplate/create', permissionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePermission = async (id, permissionData) => {
  try {
    const response = await axios.post(`/permissionTemplate/update`, permissionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePermission = async (id) => {
  try {
    const response = await axios.post(`/permissionTemplate/delete?permissionTemplateId=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPermissionById = async (id) => {
  try {
    const response = await axios.get(`/permissionTemplate/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
