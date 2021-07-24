import React from 'react'

const UserContext = React.createContext<any>(undefined)
UserContext.displayName = 'UserContext'

export function UserProvider({user, children}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = React.useContext(UserContext)

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }

  return context
}
