import { apiPublic, api } from '.'

export async function listDirectoryFiles(query, filter) {
  try {
    const response = await api.post('/directory/files', filter, {
      params: {
        ...query,
        page: query?.page || 0,
        pageSize: query?.pageSize || 25,
      },
    })
    console.log('listDirectoryFiles response', response)
    return response.data
  } catch (error) {
    console.error('listDirectoryFiles exception', error)
    return error.message
  }
}

export async function listDirectories(params) {
  try {
    const response = await api.get('/directory', {
      params,
    })
    console.log('listDirectories response', response)
    return response.data
  } catch (error) {
    console.error('listDirectories exception', error)
    return error.message
  }
}

export async function getLinkedResource(file) {
  try {
    const response = await api.post('directory/file/linked', file)
    console.log('getLinkedResource response', response)
    return response.data
  } catch (error) {
    console.error('getLinkedResource exception', error)
    return error.message
  }
}

export async function addTagToFiles(fileIds, tag) {
  try {
    const response = await axios.post(
      '/files/control/tag/add',
      { files: fileIds.map((id) => ({ fileId: id })) },
      { params: { tag } }
    )
    console.log('addTagToFiles response', response)
    return response.data
  } catch (error) {
    console.error('addTagToFiles exception', error)
    return error.message
  }
}

export async function removeTagFromFiles(fileIds, tag) {
  try {
    const response = await axios.post(
      '/files/control/tag/remove',
      { files: fileIds.map((id) => ({ fileId: id })) },
      { params: { tag } }
    )
    console.log('removeTagFromFiles response', response)
    return response.data
  } catch (error) {
    console.error('removeTagFromFiles exception', error)
    return error.message
  }
}

export async function getFileShareId(fileIds) {
  try {
    const response = await api.post('/files/control/sharing/public', fileIds)
    console.log('getSharedFilesLink response', response)
    return response
  } catch (error) {
    console.error('getSharedFilesLink exception', error)
    return error.message
  }
}

export async function listPublicSharedDirectoryFiles(query) {
  try {
    const response = await apiPublic.post('/public/files', [], {
      params: {
        ...query,
        page: query?.page || 0,
        pageSize: query?.pageSize || 25,
      },
    })
    console.log('listPublicSharedDirectoryFiles response', response)
    return response.data
  } catch (error) {
    console.error('listPublicSharedDirectoryFiles exception', error)
    return error.message
  }
}

export async function listRestrictedSharedDirectoryFiles(query) {
  try {
    const response = await apiPublic.post('/restricted/files', [], {
      params: {
        ...query,
        page: query?.page || 0,
        pageSize: query?.pageSize || 25,
      },
    })
    console.log('listRestrictedSharedDirectoryFiles response', response)
    return response.data
  } catch (error) {
    console.error('listRestrictedSharedDirectoryFiles exception', error)
    return error.message
  }
}

export async function deleteFiles(files) {
  try {
    const response = await api.post('/files/delete', {
      files,
      breadCrumb: '',
      folders: [],
      pin: { files: [], folders: [] },
      favourite: { files: [], folders: [] },
    })
    console.log('deleteFiles response', response)
    return response?.data
  } catch (error) {
    console.error('deleteFiles exception', error)
    throw error
  }
}
