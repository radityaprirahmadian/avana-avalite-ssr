import formatCurrency from 'src/helpers/formatCurrency';

export default function SummaryProducts({orderDetails, productsOrdered}) {
   return (
      <div className="mt-6 mb-4 pb-4 border-b">
         {Object.values(productsOrdered).map((product) => (
            <div key={product.product_id} className="flex flex-row my-3">
               <img src={product.image} alt="" className="object-cover rounded-lg" style={{height: '75px', width: '75px'}}/>
               <div className="flex-1 mx-3">
                  <h5 className="block font-bold" style={{minWidth: '100px'}}>{product.name}</h5>
                  {
                     Array.isArray(product.variation) ? (
                        product.variation.map((variant) => (
                           <div className="product-variation">
                              <span>{variant.option}</span>
                              <span className="font-semibold">{`: ${variant.value}`} </span>  
                           </div>
                        ))
                     ) : product.variation ? (
                        <span className="product-variation">{`(${product.variation})`}</span>
                     ) : null
                  }
               </div>
               <div>
               <span className="block text-right font-semibold text-primary-orange">
                  {formatCurrency(product.price, orderDetails.currencyCode)}
               </span>
               <span className="block text-right font-semibold">{`x ${product.quantity}`}</span>
               </div>
            </div>
         ))}
      </div>
   )
}