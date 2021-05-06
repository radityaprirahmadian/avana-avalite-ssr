export default (key) => {
   return (
      localStorage?.[`${process.env.NEXT_PUBLIC_APPNAME}:${key}`] &&
      JSON.parse(localStorage?.[`${process.env.NEXT_PUBLIC_APPNAME}:${key}`])
   )
}
