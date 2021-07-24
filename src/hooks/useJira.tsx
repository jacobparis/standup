import React from 'react'

const JiraContext = React.createContext<any>(undefined)
JiraContext.displayName = 'JiraContext'

export function JiraProvider({hostUrl, children}) {
  return (
    <JiraContext.Provider value={{hostUrl}}>{children}</JiraContext.Provider>
  )
}

export function useJira() {
  const context = React.useContext(JiraContext)

  if (context === undefined) {
    throw new Error('useJira must be used within a JiraProvider')
  }

  return context
}
