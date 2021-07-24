import '../styles/globals.scss'

import React from 'react'

import {DefaultSeo} from 'next-seo'
import {ThemeProvider} from 'next-themes'
import {AppProps} from 'next/app'

import SEO from '../../next-seo.json'

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <DefaultSeo {...SEO} />
      <ThemeProvider forcedTheme={Component['theme'] || null}>
          <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default MyApp
