import React from 'react';
import Router from 'next/router'
import { ToastContainer } from 'react-toastify'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { ThemeProvider } from '@material-ui/core/styles'
import theme from 'src/configs/materialUI/theme'
import mixpanel from 'mixpanel-browser';

import 'react-toastify/dist/ReactToastify.css'
import 'react-phone-input-2/lib/material.css'
import '../../tailwindcss/style.css'

NProgress.configure({ showSpinner: false }) //showSpinner: false
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps }) {
   React.useEffect(() => {
      //init mixpanel
      mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL);
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector('#jss-server-side')
      if (jssStyles) {
         jssStyles.parentElement.removeChild(jssStyles)
      }
   }, [])

   return (
      <>
         <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            {/* <CssBaseline /> */}
            <Component {...pageProps} />
         </ThemeProvider>

         <ToastContainer position="top-center"></ToastContainer>
      </>
   )
}

export default MyApp
