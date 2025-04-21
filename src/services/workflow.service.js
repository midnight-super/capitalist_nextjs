import axios from './index';

const getAllWorkflow = async (data, filterData) => {
  try {
    const endpoint = '/workflow/all';
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
  } catch (error) {
    return error;
  }
};
const deleteWorkflow = async (id) => {
  try {
    const endpoint = `/workflow/delete?workflowId=${id}`;

    const response = await axios.post(endpoint);
    return response?.data;
  } catch (e) {
    return e;
  }
};


const createWorkflow = async (data) => {
  try {
    const endpoint = '/workflow/create';

    const response = await axios.post(endpoint, data);
    return response?.data;
  } catch (e) {
    return e?.response?.data;
  }
};

const getWorkflowByID = async (id) => {
  try {
    const endpoint = '/workflow/' + id;

    const response = await axios.get(endpoint);
    return response?.data;
  } catch (e) {
    return e;
  }
};

const updateWorkflow = async (data) => {
  try {
    const endpoint = '/workflow/update';

    const response = await axios.post(endpoint, data);
    return response?.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const getWorkflowsByService = async (serviceId) => {
  try {
    const response = await axios.get(`/workflow/service/${serviceId}`);
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const applyWorkflowToOrderPart = async (orderPartId, workflowId, data) => {
  try {
    const response = await axios.post(
      `/order/workflow/apply?orderPartId=${orderPartId}&workflowId=${workflowId}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const getOrderPartTasks = async (orderPartId) => {
  try {
    const response = await axios.get(
      `/order/part/tasks?orderPartId=${orderPartId}`
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const getTaskTypeById = async (taskTypeId) => {
  try {
    const response = await axios.get(`/taskType/${taskTypeId}`);
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const uploadTaskFiles = async (
  directoryId = '0',
  files,
  onProgress = null,
  uploadControllersRef
) => {
  try {
    const uploadPromises = files?.map(async (file) => {
      const formData = new FormData();
      formData.append('fileName', file);
      const controller = new AbortController();
      uploadControllersRef.current[file?.name] = controller;
      const endpoint = `/files/upload?directoryId=${directoryId}`;

      try {
        const response = await axios.post(endpoint, formData, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: onProgress
            ? (progressEvent) => {
                const total = progressEvent.total || 1;
                const current = progressEvent.loaded;
                const percentage = Math.floor((current / total) * 100);
                onProgress(percentage, file?.name);
              }
            : null,
        });

        return {
          status: 'fulfilled',
          fileId: response?.data?.fileId,
          data: response?.data,
          fileName: file?.name,
        };
      } catch (error) {
        return { status: 'rejected', error, fileName: file?.name };
      }
    });

    // Wait for all uploads to finish
    const results = await Promise.allSettled(uploadPromises);

    const successFiles = results
      .filter((result) => result.status === 'fulfilled')
      .reduce(
        (acc, file) => ({ ...acc, [file.value.fileName]: file.value.fileId }),
        {}
      );

    const addData = results.map((result) => {
      if (result.status === 'fulfilled') {
        return result?.value?.data;
      }
    });

    const failedFiles = results
      .filter((result) => result.status === 'rejected')
      .map((file) => file.reason);

    return {
      success: Object.keys(successFiles).length > 0,
      fileIds: successFiles,
      data: addData,
      errors: failedFiles.length > 0 ? failedFiles : null,
    };
  } catch (e) {
    console.log(e);
    return { success: false, error: 'Server Error' };
  }
};

export {
  getAllWorkflow,
  deleteWorkflow,
  createWorkflow,
  getWorkflowByID,
  updateWorkflow,
  getWorkflowsByService,
  applyWorkflowToOrderPart,
  getOrderPartTasks,
  getTaskTypeById,
  uploadTaskFiles,
}
