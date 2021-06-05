import Document, { Html, Head, Main, NextScript } from 'next/document'

import { ServerStyleSheets } from '@material-ui/core/styles'

import theme from 'src/configs/materialUI/theme'

class MyDocument extends Document {
   static async getInitialProps(ctx) {
      const initialProps = await Document.getInitialProps(ctx)
      return { ...initialProps }
   }

   render() {
      return (
         <Html>
            <Head>
               <meta name="theme-color" content={theme.palette.primary.main} />
               {/* <link
                  rel="shortcut icon"
                  href={`/images/logo.png`}
               /> */}
               {process.env.NEXT_PUBLIC_API_HOST.includes('avana.asia') && (<>
                  <script dangerouslySetInnerHTML={{__html: `
                     (function(h,o,t,j,a,r){
                        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                        h._hjSettings={hjid:2001013,hjsv:6};
                        a=o.getElementsByTagName('head')[0];
                        r=o.createElement('script');r.async=1;
                        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                        a.appendChild(r);
                     })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                  `}} />
                  <script async src="https://www.googletagmanager.com/gtag/js?id=G-MMLJL8CZZS"></script>
                  <script dangerouslySetInnerHTML={{__html: `
                     window.dataLayer = window.dataLayer || [];
                     function gtag(){dataLayer.push(arguments);}
                     gtag('js', new Date());

                     gtag('config', 'G-MMLJL8CZZS');
                  `}} />
               </>)}
            </Head>
            <body>
               <Main />
               <NextScript />
            </body>
         </Html>
      )
   }
}

MyDocument.getInitialProps = async (ctx) => {
   const sheets = new ServerStyleSheets()
   const originalRenderPage = ctx.renderPage

   ctx.renderPage = () =>
      originalRenderPage({
         enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
      })

   const initialProps = await Document.getInitialProps(ctx)

   return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [
         ...React.Children.toArray(initialProps.styles),
         sheets.getStyleElement(),
      ],
   }
}

export default MyDocument
