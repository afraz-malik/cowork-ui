import { toast } from 'react-toastify'
import { logout } from './auth'

export default function setupAxios(axios, store) {
  axios.interceptors.response.use(
    () => {},
    async function (error) {
      const message = error.response?.data?.message
      if (error.response) {
        if (error.response?.status === 401 || error.status === 401) {
          toast.error('Session Expired ! Please login again.')
          await logout()
          window.location.href = '/'
        } else if (error.response?.status === 404 || error.status === 404) {
        } else if (error.response?.status === 409 || error.status === 409) {
        } else {
          toast.error(message || 'Something went wrong.')
        }
      }
      return Promise.reject(error)
    }
  )
}
