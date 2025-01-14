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
               <meta name="title" content="WhatsApp Commerce" />
               <meta name="description" content="Our commerce platform helps automate your business so that you can make money with ease" />
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
