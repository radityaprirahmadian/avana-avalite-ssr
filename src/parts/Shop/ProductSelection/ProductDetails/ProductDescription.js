import React from 'react';

import Parser from 'html-react-parser';
// components
import { ArrowBack } from '@material-ui/icons';
import ImgSlider from 'src/components/ImgSlider';
import Button from 'src/components/Button';

// utils
import formatCurrency from 'src/helpers/formatCurrency';

export default function ProductDescription(props) {
  const {
    lang,
    product,
    productVariantsQuantity,
    isProductHasVariant,
    fnToggleSelectVariant,
    fnToggleSelectProduct,
    handleAddNonVariant,
  } = props;
  
  return (
    <div
      // className="flex flex-col h-full"
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        flex: 1
        // padding: '0 1rem 1rem'
      }}
    >
      <section
        className="relative p-4 flex items-center text-lg"
        style={{
          position: 'sticky',
          padding: '1rem 0',
          display: 'flex',
          alignItems: 'center',
          top: '0',
          zIndex: '20',
          background: 'white'
        }}
      >
        <ArrowBack
          className="mr-2"
          onClick={() => {fnToggleSelectProduct()}}
          style={{
            marginRight: '0.25rem',
            cursor: 'pointer'
          }}
        />
        <span className="truncate">
          <b>{lang?.text__product_detail || 'Product Detail'}</b>
        </span>
      </section>
      {
        product.status === 'loading' ? (
          <div className="my-2">
            <div
              className="loading mb-4"
              style={{
                height: '375px'
              }}
            />
            <div className="flex-1 px-4 mb-6">
              <div className="loading block h-4 w-32 mr-auto mb-4"></div>
              <div className="loading h-2 w-24 mr-auto mb-2"></div>
              <div className="loading h-2 w-24 mr-auto"></div>
            </div>
            <div className="flex-1 px-4">
              <div className="loading block h-4 w-32 mr-auto mb-4"></div>
              <div className="loading h-2 w-full mr-auto mb-2"></div>
              <div className="loading h-2 w-full mr-auto mb-2"></div>
              <div className="loading h-2 w-24 mr-auto"></div>
            </div>
          </div>
        ) : (
          <>
          <section
            style={{
              flex:1,
            }}
          >
            <section
              style={{
                margin: '1rem 0',
                position: 'relative',
                width: '100%',
                paddingTop: '100%',
              }}
            >
              <ImgSlider
                images={product.data?.images || []}
                className="product-image"
              />
            </section>
            <section
              style={{
                margin: '0.5rem 0.5rem 1rem',
              }}
            >
              <div style={{ marginBottom:'0.5rem' }}>
                <b>{product.data?.name}</b>
              </div>
              {product.data?.sale_enabled && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom:'0.5rem',
                  }}
                >
                  <div
                    style={{
                      padding:'0.25rem',
                      marginRight: '0.5rem',
                      background: '#e74c3c',
                      borderRadius: '0.5rem',
                      color: 'white'
                    }}
                  >
                    {`${Math.round(product.data?.sale_percentage)}%`}
                  </div>
                  <div>
                    <strike>
                      {formatCurrency(product.data?.price, product.data?.currency?.code)}
                    </strike>
                  </div>
                </div>
              )}
              <div>
                <b>
                  {product.data?.currency?.code && formatCurrency(
                    !product.data?.sale_enabled ? product.data?.price : product.data?.sale_price,
                    product.data?.currency?.code
                  )}
                </b>
              </div>
              {(product.data?.quantity < 10 || (productVariantsQuantity < 10 && !!product.data?.variation)) && (
                <div className="text-red-5 mt-2">
                  {(product.data?.quantity === 0 || (productVariantsQuantity === 0 && !!product.data?.variation))
                    ? lang?.text__out_of_stock
                    : (<>
                      {lang?.text__stock_left || 'Stock left:'}
                      {` ${!!product.data?.variation && product.data?.quantity !== productVariantsQuantity
                        ? productVariantsQuantity
                        : product.data?.quantity}
                      `}
                    </>)
                  }
                </div>
              )}

              {product.data?.variation && (
                <div className="mt-2 flex text-xs">
                  <span className="text-neutral-6 mr-2">
                    {product.data?.variation.name}:
                  </span>
                  <span style={{flex: 1}}>
                    {product.data
                      ?.variation?.options
                        .filter((variation) => variation.id)
                        .map((variation) => (<>
                          {`${variation.name}, `}
                        </>)
                    )}
                  </span>
                </div>
              )}
            </section>
            {!!product.data?.description && (
              <>
                <section className="border-b solid border-neutral-3"
                  style={{
                    borderBottom: '1px solid rgb(242, 242, 242)'
                  }}
                />
                <section className="mt-3 mx-2">
                  <div className="mb-2">
                    <b>{lang?.text__description || 'Description'}</b>
                  </div>
                  <div
                    className="product-description"
                  >
                    {Parser(product.data?.description)}
                  </div>
                </section>
              </>
            )}
          </section>
          <section className="sticky bottom-0 py-4 bg-white">
            <Button
              variant="contained"
              color="primary"
              disableElevation
              fullWidth
              onClick={isProductHasVariant
                ? () => fnToggleSelectVariant(product.data)
                : () => handleAddNonVariant()
                
              }
              disabled={!product.data?.quantity || !productVariantsQuantity}
            >
              {lang?.btn__buy || 'Buy'}
            </Button>
          </section>
        </>
      )}
    </div>
  )
}