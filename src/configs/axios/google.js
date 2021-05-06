import axios from 'axios'

import errorHandler from './errorHandler'

const instance = axios.create({
  baseURL: `https://maps.googleapis.com/maps/api/`,
})

instance.interceptors.response.use((response) => response.data, errorHandler)

export default instance
