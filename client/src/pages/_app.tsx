import '../../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../sass/app.scss'
import type { AppProps } from 'next/app'
import Script from 'next/script'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Movie Finder</title>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0'
        />
      </Head>
      <Script src='https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js' />
      <Script src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js' />
      <Script src='https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js' />
      <Component {...pageProps} />
    </>
  )
}
