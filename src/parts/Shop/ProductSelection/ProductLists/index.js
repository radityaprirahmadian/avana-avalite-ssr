import React from 'react'

import Row from './Row'
import Variation from './Variation';
import images from 'src/constants/images'

export default function ProductLists(props) {
   const { products, selectedVariant, lang } = props
   
   return (
      <>
         {(Object.values(products.data).length > 0) ? (
            selectedVariant.isSelect ? (
               <Variation
               lang={lang}
                  item={selectedVariant.product}
                  productsOrdered={props.productsOrdered}
                  fnSelectProduct={props.fnSelectProduct}
                  fnChangeRangeProduct={props.fnChangeRangeProduct}
                  fnToggleSelectVariant={props.fnToggleSelectVariant}
               />
            ) : (
               <>
                  {Object.values(products.data).map((item) => (
                     <div key={item.id}>
                        <Row
                           lang={lang}
                           item={item}
                           productsOrdered={props.productsOrdered}
                           fnSelectProduct={props.fnSelectProduct}
                           fnToggleSelectVariant={props.fnToggleSelectVariant}
                           fnChangeRangeProduct={props.fnChangeRangeProduct}
                        />
                     </div>
                  ))}
               </>
            )
         ) : (
            <>
            {products.status !== 'loading' &&  (
               <div className="flex flex-col items-center justify-center py-6">
                  <div className="w-24 h-24 object-contain mb-3">
                     <img src={images.sad} alt="ava sad" />
                  </div>
                  <span>{lang?.text__product_not_found || 'The product you are looking for was not found'}</span>
               </div>
            )}
            </>
         )}
         {
            products.status === 'loading' && (
               <div className="my-2">
                  {Array(3)
                     .fill()
                     .map((item, index) => (
                        <div
                           key={index}
                           className="flex flex-wrap items-center -mx-4 mb-2"
                        >
                           <div className="w-auto px-4">
                              <div className="w-16 h-16 loading rounded"></div>
                           </div>
                           <div className="flex-1 px-4">
                              <div className="loading block h-4 w-30 mr-auto mb-1"></div>
                              <div className="loading h-2 w-20 mr-auto"></div>
                           </div>
                           <div className="w-auto px-4">
                              <div className="loading h-8 w-20 mr-auto"></div>
                           </div>
                        </div>
                     ))}
               </div>
            )
         }
      </>
   )
}
