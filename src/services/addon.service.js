import axios from './index';

export const getAddOnsByServiceId = async (serviceId) => {
  try {
    const endpoint = `/addon/all/${serviceId}`;
    const response = await axios.get(endpoint);
    return response?.data;
  } catch (e) {
    console.error(e);
    return 'Server Error';
  }
};

export const getAddOnsAll = async () => {
  try {
    const endpoint = `/addon/all?pageSize=0`;
    const headers = {
      'Content-Type': 'application/json',
    };
    const response = await axios.post(endpoint, [], { headers });
    return response?.data;
  } catch (e) {
    console.error(e);
    return 'Server Error';
  }
};
