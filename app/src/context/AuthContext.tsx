import { createContext, useCallback, useContext, useEffect, useMemo, useState, PropsWithChildren } from 'react'

type AuthContextValue = {
  isAdmin: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(() => {
    const stored = localStorage.getItem('vintager:isAdmin')
    if (stored === 'true') setIsAdmin(true)
  }, [])

  const login = useCallback(() => {
    setIsAdmin(true)
    localStorage.setItem('vintager:isAdmin', 'true')
  }, [])

  const logout = useCallback(() => {
    setIsAdmin(false)
    localStorage.removeItem('vintager:isAdmin')
  }, [])

  const value = useMemo(() => ({ isAdmin, login, logout }), [isAdmin, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


