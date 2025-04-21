import axios from './index';
const getAllEvents = async (data, filterData) => {
  try {
    const endpoint = '/rt/event/all';
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
    console.error('Error:', e.response?.data || e.message);
  }
};

const create = async (data) => {
  try {
    const endpoint = '/rt/event/create';
    const headers = {
      'Content-Type': 'application/json',
    };
    const response = await axios.post(endpoint, data, { headers });
    return response.data;
  } catch (e) {
    return e;
  }
};
const update = async (data) => {
  try {
    const endpoint = '/rt/event/update';
    const headers = {
      'Content-Type': 'application/json',
    };
    const response = await axios.post(endpoint, data, { headers });
    return response.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};
const getByID = async (id) => {
  try {
    const endpoint = '/rt/event/' + id;

    const response = await axios.get(endpoint);
    return response.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const getByStreamKey = async (key) => {
  try {
    const endpoint = '/rt/event/byStreamKey?streamKey=' + key;

    const response = await axios.get(endpoint);
    return response.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const remove = async (id) => {
  try {
    const endpoint = `/rt/event/delete?eventId=${id}`;

    const response = await axios.post(endpoint);
    return response.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const startEvent = async (id) => {
  try {
    const endpoint = `/rt/event/start?eventId=${id}`;

    const response = await axios.post(endpoint);
    return response.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};
const stopEvent = async (id) => {
  try {
    const endpoint = `/rt/event/stop?eventId=${id}`;

    const response = await axios.post(endpoint);
    return response.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const cancelEvent = async (id) => {
  try {
    const endpoint = `/rt/event/cancel?eventId=${id}`;

    const response = await axios.post(endpoint);
    return response.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const getStream = async (id) => {
  try {
    return 'stream';
  } catch (e) {
    console.error('Error fetching stream:', e);
    return e;
  }
};

const downloadTranscriptionFile = async (id) => {
  try {
    const endpoint = `/rt/event/download/${id}`;

    const response = await axios.get(endpoint, {
      responseType: 'blob',
      headers: {
        Accept:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    });

    if (response?.status === 200) {
      return response.data;
    } else {
      const errorText = await response.data.text();
      console.error('Error Response:', errorText);
    }
  } catch (e) {
    console.error('Download Error:', e);
  }
};

export {
  getAllEvents,
  create,
  update,
  getByID,
  remove,
  startEvent,
  stopEvent,
  cancelEvent,
  getStream,
  downloadTranscriptionFile,
  getByStreamKey,
};
