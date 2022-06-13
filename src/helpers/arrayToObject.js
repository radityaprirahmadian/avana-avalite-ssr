export default (array, key) => {
  if (array.length > 0) {
    return array.reduce((obj, item) => {
      obj[item[key]] = item;
      return obj;
    }, {});
  }
  return false;
};