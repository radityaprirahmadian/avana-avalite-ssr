import Head from 'next/head'

import axios from 'src/configs/axios'

// import Circle from "public/images/circle-accent-1.svg";

// import Header from "src/parts/Header";

// import shop from 'src/constants/api/shop'

function Home() {
   return (
      <>
         <Head>
            <title>WA Commerce</title>
            <link rel="icon" href="images/favicon.ico" />
         </Head>

         <main></main>
      </>
   )
}

export function getInitialProps() {
   // try {
   //    const data = await shop.details()
   //    console.log(data)
   //    return { data: data.data }
   // } catch (error) {
   //    return error
   // }
   return null
}

export default Home
