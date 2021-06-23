import React from 'react';

import Modal from 'src/components/Modal';
import { Close } from '@material-ui/icons';
import ImgSlider from 'src/components/ImgSlider';

// import mobileAndTabletcheck from 'utils/mobileAndTabletcheck';

import ProductItem from './ProductItem';

export default function ProductViewer(props) {

  const [Display, setDisplay] = React.useState(false);
  const toggle = React.useCallback(() => {
    setDisplay(!Display);
  }, [Display]);

  return (
    <div>
      <Modal
        in={Display}
        toggleModal={toggle}
        content={() => (
          <div
            className="fixed m-auto top-0 bottom-0 right-0 left-0"
            style={{
              minWidth: '300px',
              maxWidth: '375px',
            }}
          >
              <div
                className="relative w-full h-full flex justify-center flex-col"
              >
                <div
                  className="absolute w-full h-full"
                  onClick={toggle}
                >
                </div>
                <div
                  className="relative"
                >
                  <section
                    className="my-4 relative w-full"
                    style={{
                      paddingTop: '100%',
                    }}
                  >
                  <div
                    className="absolute z-10 top-0 right-0 m-1"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                    }}
                  >
                    <Close
                      fontSize="small"
                      className="absolute cursor-pointer m-auto top-0 bottom-0 left-0 right-0 text-white"
                      onClick={() => toggle()}
                    />
                  </div>
                  <ImgSlider
                    images={props.item?.images.length ? props.item?.images : [""]}
                    className="product-image"
                  />
                </section>
              </div>
            </div>
          </div>
        )}
    >
      {() => (
        <ProductItem
          onClick={() => toggle()}
          lang={props.lang}
          item={props.item}
          selectedMeta={props.selectedMeta}
          productsOrdered={props.productsOrdered}
          fnSelectProduct={props.fnSelectProduct}
          fnToggleSelectProduct={props.fnToggleSelectProduct}
          fnToggleSelectVariant={props.fnToggleSelectVariant}
          fnChangeRangeProduct={props.fnChangeRangeProduct}
        />
      )}
      </Modal>
    </div>
  )
}