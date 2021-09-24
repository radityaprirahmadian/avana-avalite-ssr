import Head from 'next/head'

function Home() {
   return (
      <>
         <Head>
            <title>WA Commerce</title>
            <link rel="icon" href="/images/favicon.ico" />
         </Head>

         <main></main>
      </>
   )
}

export function getInitialProps() {
   return null
}

export default Home
