export default (key, value) => {
   localStorage[`${process.env.NEXT_PUBLIC_APPNAME}:${key}`] = JSON.stringify(
      value
   )
}
