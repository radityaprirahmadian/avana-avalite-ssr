import formatCurrency from 'src/helpers/formatCurrency';

export default function SummaryProducts({orderDetails, productsOrdered}) {
   return (
      <div className="mt-6 mb-4 pb-4 border-b">
         {Object.values(productsOrdered).map((product) => (
            <div key={product.product_id} className="flex flex-row my-3">
               <img src={product.image} alt="" className="object-cover rounded-lg" style={{height: '75px', width: '75px'}}/>
               <div className="flex-1 mx-3">
               <span className="block" style={{minWidth: '100px'}}>{product.name}</span>
                  {product.variation && (
                     <span className="product-variation">{`(${product.variation})`}</span>
                  )}
               </div>
               <div>
               <span className="block text-right">
                  {formatCurrency(product.price, orderDetails.currencyCode)}
               </span>
               <span className="block text-right">{`x ${product.quantity}`}</span>
               </div>
            </div>
         ))}
      </div>
   )
}