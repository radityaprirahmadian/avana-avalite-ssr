export default (date) => {
  let now = new Date();
  let diff = (date.getTime() - now.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
};