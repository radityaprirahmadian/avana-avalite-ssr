export const init = ({pixelid}) => {
  if (!pixelid) return null
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${pixelid});
            window.fbpixelInit=true;
        `,
        }}
    />
  )
};

export const pageView = () => {
  if (window.fbpixelInit) window?.fbq?.('track', 'PageView');
};

export const viewContent = (product) => {
  if (window.fbpixelInit) {
    const {id, price, tax, currency} = product;
    const productTax = (Number(price) / 100) * Number(tax);
    const taxedPrice = Number(price) + productTax;

    window?.fbq?.('track', 'ViewContent', {
      content_type: 'product',
      content_ids: id,
      value: taxedPrice,
      currency: currency?.code
    });
  }
};

export const addToCart = (product) => {
  if (window.fbpixelInit) {
    const {id, price, tax, quantity, currency} = product;
    const productPirce = Number(price) *  Number(quantity);
    const productTax = (productPirce / 100) * Number(tax);
    const taxedPrice = productPirce + productTax;
    window?.fbq?.('track', 'AddToCart', {
      content_type: 'product',
      content_ids: id,
      value: taxedPrice,
      currency: currency?.code
    });
    
  }
};

export const initiateCheckout = () => {
  if (window.fbpixelInit) window?.fbq?.('track', 'InitiateCheckout');
};

export const addPaymentInfo = (totalPrice, currency) => {
  if (window.fbpixelInit) window?.fbq?.('track', 'AddPaymentInfo', {
    value : totalPrice,
    currency: currency
  });
};

export default {
  init,
  pageView,
  viewContent,
  addToCart,
  initiateCheckout,
  addPaymentInfo
}