import axios from './index';

const getAllIoPut = async () => {
  try {
    const endpoint = '/ioput/all';
    const response = await axios.get(endpoint);
    return response?.data;
  } catch (e) {
    return e;
  }
};

export { getAllIoPut };
