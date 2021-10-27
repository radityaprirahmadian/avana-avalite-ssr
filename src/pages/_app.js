import Router from 'next/router'
import { ToastContainer } from 'react-toastify'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
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
      if (process.env.NEXT_PUBLIC_API_HOST.includes('avana.asia')) {
         document.addEventListener('DOMContentLoaded', () => {
            loadScript('https://www.googletagmanager.com/gtag/js?id=G-MMLJL8CZZS')
               .then((() => {
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', 'G-MMLJL8CZZS');
               })())
            loadScript(() => (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:2001013,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
               })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv='))
         });
         datadogRum.init({
            applicationId: process.env.NEXT_PUBLIC_DATADOG_APPID,
            clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT,
            site: 'datadoghq.com',
            service:'whatsapp-commerce',
            env: process?.env?.NEXT_PUBLIC_STAGE?.toLocaleLowerCase(),
            // version: '1.0.0',
            sampleRate: 100,
            trackInteractions: true,
            defaultPrivacyLevel: 'mask-user-input'
         });
         datadogRum.startSessionReplayRecording();
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
