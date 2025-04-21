import axios from './index';

const getAllUnits = async () => {
  try {
    const endpoint = '/unit/all';
    const response = await axios.get(endpoint);
    return response?.data;
  } catch (e) {
    return e;
  }
};

export { getAllUnits };
