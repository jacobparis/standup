import '../styles/globals.scss'

import React from 'react'

import {DefaultSeo} from 'next-seo'
import {ThemeProvider} from 'next-themes'
import {AppProps} from 'next/app'
import dynamic from 'next/dynamic'

import SEO from '../../next-seo.json'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/DevToolbar'),
  {ssr: false},
) as any

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <DefaultSeo {...SEO} />
      <ThemeProvider forcedTheme={Component['theme'] || null}>
        <div>
          <DynamicComponentWithNoSSR
            hosts={{
              production: ['https://www.threeq.app'],
              staging: ['https://standup-lovat.vercel.app'],
              development: ['http://localhost:3050', 'http://localhost:3051'],
            }}
          />
        </div>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default MyApp
