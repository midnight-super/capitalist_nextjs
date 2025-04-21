import axios from 'axios'

import { API_BASE_URL } from '@/utils/config'

let axiosWithAuth = axios.create()

axiosWithAuth.defaults.baseURL = API_BASE_URL
axiosWithAuth.defaults.headers.common['Content-Type'] = 'application/json'
// Disable automatic retries (TODO: But why?)
axiosWithAuth.defaults.retry = 0

// Add a request interceptor to set common axios configs
axiosWithAuth.interceptors.request.use(
  (config) => {
    // Set the access token as an Authorization header if it exists
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    } else {
      // If the access token does not exist, redirect to the login page
      window.location.href = '/login'
    }
    return config
  },
  (error) => {
    // all other errors need to be handled by the specific API calls
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle auth errors
axiosWithAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If the response status is 401, redirect to the logout page to clear the auth state
      console.error('axiosWithAuth 401 error, redirecting to logout', error)
      window.location.href = '/logout'
    }
    // all other errors need to be handled by the specific API calls
    return Promise.reject(error)
  }
)

let axiosForGuests = axios.create()
axiosForGuests.defaults.baseURL = API_BASE_URL
axiosForGuests.defaults.headers.common['Content-Type'] = 'application/json'

/**************************************************************************************************
 * Mock Axios
 *
 * Use this for faster local development or if the backend is down.
 * See `.env.example` for configuration details.
 */
import mockAdminUser from '@/dummyData/user-admin.json'
import mockClientAdminUser from '@/dummyData/user-client-admin.json'
import mockFiles from '@/dummyData/file-snapshot.json'

const mockAxios = {
  get: (url) => {
    console.log('mockAxios GET', url)
    return Promise.reject(new Error(`Mock axios: unknown URL ${url}`))
  },
  post: (url, data) => {
    console.log('mockAxios POST', url, data)

    if (url == '/authenticate/signin') {
      console.log('mockAxios POST /authenticate/signin', data)

      if (process.env.NEXT_PUBLIC_MOCK_User === 'clientAdmin') {
        return Promise.resolve({ data: mockClientAdminUser })
      }
      return Promise.resolve({ data: mockAdminUser })
    }

    if (url == '/directory/files') {
      return { data: mockFiles }
    }

    return Promise.reject(new Error(`Mock axios: unknown URL ${url}`))
  },
}

if (process.env.NEXT_PUBLIC_MOCK_AXIOS === 'true') {
  console.log('---> Using mock axios <---')
  axiosWithAuth = mockAxios
  axiosForGuests = mockAxios
}

export { axiosWithAuth as default, axiosWithAuth, axiosForGuests, axiosWithAuth as api, axiosForGuests as apiPublic }
