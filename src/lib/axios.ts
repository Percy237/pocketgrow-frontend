import axios from 'axios'
import { toast } from 'sonner'
import type { ApiError } from '@/types/api.types'
import config from '@/config'

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response.data // Return only the data part of the response
  },
  (error) => {
    // Handle errors
    if (error.response) {
      const apiError = error.response.data as ApiError

      // Show error toast for client-side errors (4xx)
      if (error.response.status >= 400 && error.response.status < 500) {
        toast.error(apiError.message || 'Request failed')
      }

      // You can add more specific error handling here
      // For example, handle 401 Unauthorized errors
      // if (error.response.status === 401) {
      //   window.location.href = '/login'
      // }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('Network error. Please check your connection.')
    } else {
      // Something happened in setting up the request
      toast.error('Request setup error')
    }

    return Promise.reject(error)
  },
)

export default apiClient
