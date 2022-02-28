export default (e, onClickEvent) => {
  e?.stopPropagation();
  onClickEvent(e)
}