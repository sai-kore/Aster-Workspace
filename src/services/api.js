import axios from 'axios'

// Same-origin /api requests are routed by Vercel to the Express service.
const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || '/api', withCredentials: true })
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''
    const isAuthAttempt = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/me')
    if (status === 401 && !isAuthAttempt && typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    return Promise.reject(error)
  }
)
export const getErrorMessage = (error, fallback = 'Something went wrong') => {
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.code === 'ERR_NETWORK') return 'Cannot reach the server. Check your connection.'
  return fallback
}
export default api
