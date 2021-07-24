import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'

type LayoutProps = {
  meta: any
}

const DefaultLayout: FunctionComponent<LayoutProps> = ({children, meta}) => {
  const {title, description, titleAppendSiteName = false, url, ogImage} =
    meta || {}
  return (
    <>
      <NextSeo
        title={title}
        description={description}
        titleTemplate={titleAppendSiteName ? '' : '%s'}
        openGraph={{
          title,
          description,
          url,
          images: ogImage ? [ogImage] : [],
        }}
        canonical={url}
      />
      <div className="max-w-screen-md mx-auto mt-0 leading-6 prose md:prose-xl">
        {title && <h1 className="text-xl leading-tight">{title}</h1>}
        {children}
      </div>
    </>
  )
}

export default DefaultLayout
