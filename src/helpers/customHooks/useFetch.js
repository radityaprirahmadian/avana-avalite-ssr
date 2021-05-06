import { useEffect, useState } from 'react'

export default (action, option, callback) => {
   const [state, setState] = useState(() => ({
      data: null,
      errors: '',
      status: 'idle',
   }))

   useEffect(() => {
      setState(() => ({
         data: null,
         errors: '',
         status: 'loading',
      }))
      action(option)
         .then((res) => {
            setState(() => ({
               data: callback ? callback(res) : res,
               errors: '',
               status: 'ok',
            }))
         })
         .catch((err) => {
            setState(() => ({
               data: null,
               errors: err.response.data.error_message,
               status: 'error',
            }))
         })
   }, [])

   return state
}
