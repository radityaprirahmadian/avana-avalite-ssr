import React from 'react'
import { useRouter } from 'next/router'

import TextField from 'src/components/form/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

import { Search } from '@material-ui/icons'

import CategoriesSelection from './CategoriesSelection'
import ProductLists from './ProductLists'

import products from 'src/constants/api/products'

import Localization from "src/configs/lang/products";

import MainContext from 'src/parts/Context';
// import { useFetch } from 'src/helpers/customHooks'

import facebookPixel from 'src/helpers/analytics/facebookPixel';
import normalizeErrorResponse from 'src/helpers/normalizeErrorResponse'

let timeoutSearch = null
export default function ProductSelection(props) {
   const router = useRouter()
   const MAINCONTEXT = React.useContext(MainContext);
   const lang = Localization[MAINCONTEXT?.locale];
   // const [lang, setLang] = React.useState({});
   const [PRODUCTS, setProducts] = React.useState({
      data: {},
      page: {
         currentPage: 1,
         lastPage: 1,
      },
      status: 'loading',
      errors: [],
   })

   const [CATEGORIES, setCategories] = React.useState({
      data: null,
      status: 'loading',
      errors: [],
   })

   const [search, setSearch] = React.useState('')
   const [selectedCategory, setSelectedCategory] = React.useState('')
   const [selectedVariant, setSelectedVariant] = React.useState({
      product: {},
      isSelect: false
   })

   const fnSearch = React.useCallback(
      (value) => {
         clearTimeout(timeoutSearch)
         timeoutSearch = null
         timeoutSearch = setTimeout(() => {
            setSearch(value)
         }, 300)
      },
      [search]
   )

   const fnGetProducts = React.useCallback(
      (search, selectedCategory, page = 1 ) => {
         setProducts((prev) => ({
            ...prev,
            data: page === 1 ? {} : prev.data,
            status: 'loading',
         }))
         products
            .all({
               params: {
                  published: 1,
                  sortKey: 'quantity',
                  sortValue: 'desc',
                  limit: '10',
                  categories: selectedCategory ? [selectedCategory] : undefined,
                  search: search,
                  page: page
               },
            })
            .then((res) => {
               setProducts((prev) => ({
                  ...prev,
                  data: res.data.reduce((acc, item) => {
                     acc[Object.values(acc).length] = item;
                     return acc;
                  }, page === 1 ? {} : prev.data),
                  page: {
                     currentPage: res.current_page,
                     lastPage: res.last_page,
                  },
                  status: 'ok',
               }))
            })
            .catch((err) => {
               setProducts((prev) => ({
                  ...prev,
                  status: 'error',
                  errors: normalizeErrorResponse(err)
               }))
            })
      },
      [products, setProducts]
   )

   const fnHandleScroll = React.useCallback(
      () => {
         const scrollOnEndge = (document.documentElement.scrollHeight -
            document.documentElement.scrollTop <
            document.documentElement.clientHeight + 100)
            const isOverflow = (document.documentElement.scrollHeight !== document.documentElement.clientHeight)
            if (scrollOnEndge && isOverflow &&(PRODUCTS.page.currentPage < PRODUCTS.page.lastPage) && (
               PRODUCTS.status !== 'loading'
            ))
         {
            fnGetProducts(search, selectedCategory, PRODUCTS.page.currentPage + 1);
         }
      },
      [setProducts, fnGetProducts, search, selectedVariant.isSelect, selectedCategory, PRODUCTS]
   )

   const fnGetCategories = React.useCallback(() => {
      products.categories().then((res) => {
         setCategories((prev) => ({
            ...prev,
            data: res,
            status: 'ok',
         }))
      })
   }, [setSelectedVariant, selectedVariant])

   const fnToggleSelectVariant = React.useCallback(
      (product) => {
         if (!selectedVariant.isSelect && product) {
            facebookPixel.viewContent(product);
         }

         setSelectedVariant((prevState) => ({
            ...prevState,
            product: !prevState.isSelect ? product : {},
            isSelect: !prevState.isSelect,
         }));
      },
      [setSelectedVariant]
   );

   const fnSelectProduct = React.useCallback(
      (product, productVariant) => {
         const addProduct = {
            product_id: product.id,
            name: product.name,
            image: product.main_image,
            quantity: 1,
            price: product.sale_enabled ? product.sale_price : product.price,
            weight: product?.weight && product?.weight,
            tax: product?.tax && product.tax.value,
            ...(productVariant ?
                  {
                     variation: productVariant.name,
                     variation_option_id: productVariant.id,
                  } : {}
               )
         };

         if (!productVariant) {
            facebookPixel.viewContent({id: product.id, currency: product.currency, ...addProduct});
         }

         facebookPixel.addToCart({id: product.id, currency: product.currency, ...addProduct});

         const productId = productVariant ?
            `${product.id}_${productVariant.id}` :
            product.id;
         let productsOrdered = Object.assign({
            ...props.productsOrdered,
         }, {});
         if (productVariant && !productVariant.isSelected) {
            delete productsOrdered[productId];
         } else {
            productsOrdered = {
               ...productsOrdered,
               [productId]: addProduct
            };
         }

         props.fnChange({
            target: {
               name: 'productsOrdered',
               value: productsOrdered
            }
         });
      },
      [props.fnChange, props.productsOrdered]
   )

   const fnChangeRangeProduct = React.useCallback(
      (event) => {
         event.persist && event.persist();
         let productsOrdered;
         let newQuantity = Number(event.target.value) < 0 ?
            props.productsOrdered[event.target.name].quantity :
               (event.target.value > event.target.max) ?
                  Number(event.target.max) :
                  Number(event.target.value);
         if (Number(event.target.value) === 0) {
            productsOrdered = Object.assign(props.productsOrdered, {});
            delete productsOrdered[event.target.name];
         } else {
            productsOrdered = {
               ...props.productsOrdered,
               [event.target.name]: {
                  ...props.productsOrdered[event.target.name],
                  quantity: newQuantity
               }
            };
         }
         if (newQuantity) {
            const product = Object
               .values(PRODUCTS.data)
               .filter((product) => `${product.id}` === `${event.target.name}`.split('_')[0])
               .map((product) => ({
                  ...product,
                  quantity: newQuantity,
                  price: product.sale_enabled ? product.sale_price : product.price,
                  tax: product?.tax && product.tax.value
               }))[0];
            facebookPixel.addToCart(product);
         }

         props.fnChange({
            target: {
               name: 'productsOrdered',
               value: productsOrdered
            }
         });
      },
      [props.fnChange, props.productsOrdered]
   );

   React.useEffect(() => {
      fnGetProducts(search, selectedCategory)
   }, [fnGetProducts, search, selectedCategory])

   React.useEffect(() => {
      fnGetCategories()
      // window.addEventListener('scroll', fnHandleScroll);
   }, [fnGetCategories])

   React.useEffect(() => {
      if (PRODUCTS.status === 'error') {
         window.removeEventListener("scroll", fnHandleScroll)
      } else {
         window.addEventListener('scroll', fnHandleScroll);
      }
      return () => window.removeEventListener("scroll", fnHandleScroll);
   }, [PRODUCTS.status, fnHandleScroll])

   return (
      <div className="px-4 -mx-4 relative flex flex-col flex-1">
         {
            !selectedVariant.isSelect && (
               <>
                  <div className="sticky top-0 bg-white z-10">
                     <TextField
                        type="search"
                        value={props.search}
                        onChange={(e) => fnSearch(e.target.value)}
                        label={ lang?.text__search || 'Search Product'}
                        InputProps={{
                           startAdornment: (
                              <InputAdornment position="start">
                                 <Search />
                              </InputAdornment>
                           ),
                        }}
                        fullWidth
                        variant="outlined"
                        size="small"
                        margin="normal"
                     />
                  </div>

                  <CategoriesSelection
                     lang={lang}
                     categories={CATEGORIES}
                     selectedCategory={selectedCategory}
                     setSelectedCategory={setSelectedCategory}
                  />
               </>
            )
         }
         <ProductLists
            lang={lang}
            products={PRODUCTS}
            productsOrdered={props.productsOrdered}
            selectedVariant={selectedVariant}
            fnToggleSelectVariant={fnToggleSelectVariant}
            fnSelectProduct={fnSelectProduct}
            fnChangeRangeProduct={fnChangeRangeProduct}
         />
      </div>
   )
}
