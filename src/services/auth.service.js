import { apiPublic } from '.'

export async function login(credentials) {
  try {
    const response = await apiPublic.post('/authenticate/signin', credentials)
    console.log('login response', response)
    return response.data
  } catch (error) {
    console.error('login exception', error)
    throw error
  }
}
