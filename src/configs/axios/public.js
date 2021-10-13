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

export default instance
