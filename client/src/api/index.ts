import axios from 'axios'
import APP_CONSTANTS from '@/constants/constants'
import Cookies from 'js-cookie'

const apiClient = axios.create({
  baseURL: APP_CONSTANTS.BASE_URL,
})

// attach JWT Token every request
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('access_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// handle 401 unauthorized
// delete access_token & redirect to /login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('access_token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

export default apiClient
