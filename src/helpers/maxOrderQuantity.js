const maximumOrderQuantity = (quantity, maxPurchaseOnTransaction) => {
  if (maxPurchaseOnTransaction) {
     return Math.min(quantity, maxPurchaseOnTransaction)
  }
  return quantity
}

export default maximumOrderQuantity;