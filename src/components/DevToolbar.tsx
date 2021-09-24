import * as React from 'react'

import {
  Button,
  DevToolbar,
} from 'devtoolbar-react/lib'

export default function Toolbar() {
  const [isDesignMode, setIsDesignMode] = React.useState(false)

  React.useEffect(() => {
    document.designMode = isDesignMode ? 'on' : 'off'
  }, [isDesignMode])

  return (
    <DevToolbar
      hosts={{
        production: ['https://www.threeq.app'],
        staging: ['https://standup-lovat.vercel.app'],
        development: ['http://localhost:3050', 'http://localhost:3051'],
      }}
    >
      {isDesignMode ? (
        <Button name="🎨" active onClick={() => setIsDesignMode(false)} />
      ) : (
        <Button name="🎨" onClick={() => setIsDesignMode(true)} />
      )}
    </DevToolbar>
  )
}
