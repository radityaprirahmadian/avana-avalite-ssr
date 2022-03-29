import React, { useEffect, useState, useCallback, useMemo } from 'react';

import ProductDescription from './ProductDescription';
import Variation from '../ProductLists/Variation';
import VariationDetails from './VariationDetails';

import products from 'src/constants/api/products';

function ProductDetails(props) {
  const {
    lang,
    whitelistFeatures,
    productId,
    productsOrdered,
    selectedVariant,
    selectedMetaList,
    fnSelectProduct,
    fnChangeRangeProduct,
    fnToggleSelectVariant,
    fnToggleSelectProduct,
  } = props;

  const [product, setProduct] = useState({
    data: {},
    error: {},
    status: 'init'
  });
  const [productVariantsQuantity, setproductVariantsQuantity] = useState(-1);
  const [checkIndexOrder, setCheckIndexOrder] = useState(-1);

  const isProductHasVariant = useMemo(()=> !!product.data?.variation);

  const handleAddNonVariant = useCallback(() => {
    if (checkIndexOrder) {
      fnChangeRangeProduct({target:
        {
          name: String(productId),
          value: productsOrdered[productId]?.quantity + 1
        }
      })
    } else {
      fnSelectProduct(product.data);
    }
    fnToggleSelectProduct();
  }, [product, checkIndexOrder, fnChangeRangeProduct, fnSelectProduct, fnToggleSelectProduct]);

  useEffect(() => {
    if (productId) {
      setProduct((prevState) => ({
        ...prevState,
        status: 'loading'
      }))
      products
        .details(productId)
        .then((res) => {
          setproductVariantsQuantity(!!res.variation
            ? res?.variation?.options
                ?.reduce((acc, variant) => {
                  return acc + variant?.quantity
                }, 0)
            : -1
          );
          setProduct((prevState) => ({
            ...prevState,
            data: res,
            status: 'ok'
          }));
          setCheckIndexOrder(!!productsOrdered[productId])
        })
        .catch((err) => {
          setProduct((prevState) => ({
            ...prevState,
            data: {},
            error: err,
            status: 'error'
          }))
        })
    }
  }, [productId, productsOrdered]);

  return (
    selectedVariant?.isSelect ? (
      // <Variation
      //   lang={lang}
      //   item={selectedVariant.product}
      //   selectedMeta={selectedMetaList?.[selectedVariant?.product?.id] || {}}
      //   productsOrdered={productsOrdered}
      //   fnSelectProduct={fnSelectProduct}
      //   fnChangeRangeProduct={fnChangeRangeProduct}
      //   fnToggleSelectVariant={fnToggleSelectVariant}
      // />
      <VariationDetails
        lang={lang}
        whitelistFeatures={whitelistFeatures}
        item={selectedVariant.product}
        selectedMeta={selectedMetaList?.[selectedVariant?.product?.id] || {}}
        productsOrdered={productsOrdered}
        fnSelectProduct={fnSelectProduct}
        fnChangeRangeProduct={fnChangeRangeProduct}
        fnToggleSelectVariant={fnToggleSelectVariant}
      />
    ) : (
      <ProductDescription
        lang={lang}
        product={product}
        productVariantsQuantity={productVariantsQuantity}
        isProductHasVariant={isProductHasVariant}
        fnToggleSelectVariant={fnToggleSelectVariant}
        fnToggleSelectProduct={fnToggleSelectProduct}
        handleAddNonVariant={handleAddNonVariant}
      />
    )
  );
}

export default ProductDetails;
