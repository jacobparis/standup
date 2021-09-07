import '../styles/globals.scss'
import 'devtoolbar-react/lib/index.css'

import React from 'react'

import {DefaultSeo} from 'next-seo'
import {ThemeProvider} from 'next-themes'
import {AppProps} from 'next/app'
import dynamic from 'next/dynamic'

import SEO from '../../next-seo.json'

const DynamicComponentWithNoSSR = dynamic(
  async () => (await import('devtoolbar-react/lib')).DevToolbar,
  {ssr: false},
) as any

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <DefaultSeo {...SEO} />
      <ThemeProvider forcedTheme={Component['theme'] || null}>
        <DynamicComponentWithNoSSR
          hosts={{
            production: ['https://www.threeq.app'],
            staging: ['https://standup-lovat.vercel.app'],
            development: ['http://localhost:3050', 'http://localhost:3051'],
          }}
        />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default MyApp
