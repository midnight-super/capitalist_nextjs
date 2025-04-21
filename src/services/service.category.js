import axios from './index';

const getAllServiceCategories = async (data, filterData) => {
  try {
    const endpoint = '/service/category/all';
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

const createCategory = async (data) => {
  try {
    const endpoint = '/service/category/create';

    const response = await axios.post(endpoint, data);
    return response?.data;
  } catch (e) {
    return e?.response?.data;
  }
};

const deleteCategory = async (id) => {
  try {
    const endpoint = `/service/category/delete?serviceCategoryId=${id}`;

    const response = await axios.post(endpoint);
    return response?.data;
  } catch (e) {
    return e;
  }
};

const getCategoryByID = async (id) => {
  try {
    const endpoint = '/service/category/' + id;

    const response = await axios.get(endpoint);
    return response?.data;
  } catch (e) {
    return e;
  }
};

const updateCategory = async (data) => {
  try {
    const endpoint = '/service/category/update';

    const response = await axios.post(endpoint, data);
    return response?.data;
  } catch (e) {
    return e;
  }
};

export {
  getAllServiceCategories,
  createCategory,
  deleteCategory,
  getCategoryByID,
  updateCategory,
};
