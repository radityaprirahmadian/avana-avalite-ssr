import axios from 'axios'

import errorHandler from './errorHandler'

const instance = axios.create({
   baseURL: `${process.env.NEXT_PUBLIC_API_HOST}/api/avalite`,
   headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
   }
})

instance.interceptors.response.use((response) => response.data, errorHandler)

export const setBaseUrl = (id) => {
   if (id)
      instance.defaults.baseURL = `${process.env.NEXT_PUBLIC_API_HOST}/api/avalite/shops/${id}`
   else
      instance.defaults.baseURL = `${process.env.NEXT_PUBLIC_API_HOST}/api/avalite`
}

export const setAuthorization = (token = null) => {
   if (token) instance.defaults.headers.common.authorization = `Bearer ${token}`
   else delete instance.defaults.headers.common.authorization
}

export default instance
