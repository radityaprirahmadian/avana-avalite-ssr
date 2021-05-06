export default (err) => {
   const errors = err?.response?.data?.fields
   return errors
}
