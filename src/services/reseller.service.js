import axios from './index';

// Fetch all resellers with optional filters and pagination
const getAllResellers = async (data = {}, filterData = {}) => {
  try {
    const endpoint = '/reseller/all';
    const params = {
      ...data,
      page: data?.page || 0,
      pageSize: data?.pageSize || 25,
    };
    const headers = {
      'Content-Type': 'application/json',
    };

    const response = await axios.post(endpoint, filterData, { params, headers });
    return response?.data;
  } catch (error) {
    console.error("Error fetching resellers:", error);
    return null;
  }
};

// Fetch a reseller by ID
const getResellerByID = async (id) => {
  try {
    if (!id) throw new Error("Reseller ID is required");

    const endpoint = `/reseller/${id}`;
    const response = await axios.get(endpoint);
    return response?.data;
  } catch (error) {
    console.error(`Error fetching reseller with ID ${id}:`, error);
    return null;
  }
};

// Create a new reseller
const createReseller = async (data) => {
  try {
    if (!data) throw new Error("Reseller data is required");

    const endpoint = '/reseller/create';
    const response = await axios.post(endpoint, data);
    return response?.data;
  } catch (error) {
    console.error("Error creating reseller:", error);
    return error?.response?.data || null;
  }
};

// Update reseller details
const updateReseller = async (data) => {
  try {
    if (!data) throw new Error("Update data is required");

    const endpoint = '/reseller/update';
    const response = await axios.post(endpoint, data);
    return response?.data;
  } catch (error) {
    console.error("Error updating reseller:", error);
    return error?.response?.data || null;
  }
};

// Delete a reseller by ID
const deleteReseller = async (id) => {
  try {
    if (!id) throw new Error("Reseller ID is required");

    const endpoint = `/reseller/delete?resellerId=${id}`;
    const response = await axios.post(endpoint);
    return response?.data;
  } catch (error) {
    console.error(`Error deleting reseller with ID ${id}:`, error);
    return null;
  }
};

// Export all functions
export { getAllResellers, getResellerByID, createReseller, updateReseller, deleteReseller };
