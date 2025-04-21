import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { login as authLogin } from '@/services/auth.service'

const defaultProvider = {
  loading: true,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  user: null,
}

export const AuthContext = createContext(defaultProvider)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const router = useRouter()

  async function login(params, errorCallback) {
    setLoading(true)
    try {
      const returnUrl = router.query.returnUrl
      const redirectURL = returnUrl > '/' ? returnUrl : '/'
      const user = await authLogin(params)
      const userWithRole = { ...user, role: user?.roles?.[0] }

      // ensure user has a full name
      if (!user.fullName) {
        if (user.firstName && user.lastName) {
          userWithRole.fullName = `${user.firstName} ${user.lastName}`
        } else if (user.firstName) {
          userWithRole.fullName = user.firstName
        } else {
          userWithRole.fullName = 'Anonymous User'
        }
      }

      if (user.accessToken) {
        localStorage.setItem('accessToken', user.accessToken)
        localStorage.setItem('user', JSON.stringify(userWithRole))
        setUser(userWithRole)
        router.replace(redirectURL)
      }

      setLoading(false)
    } catch (error) {
      setLoading(false)
      if (errorCallback) errorCallback(error)
    }
  }

  function logout() {
    setLoading(true)
    setUser(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    // deprecated user object, remove any existing
    localStorage.removeItem('userData')
    localStorage.removeItem('languageSetting')
    localStorage.removeItem('accessibilitySetting')
    localStorage.removeItem('adminBasicSetting')
    router.push('/login')
    setLoading(false)
  }

  const values = {
    loading,
    login,
    logout,
    user,
  }

  useEffect(() => {
    const initAuth = () => {
      setLoading(true)

      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        try {
          setUser(JSON.parse(localStorage.getItem('user')))
        } catch (error) {
          console.error('Parsing user data from localStorage:', error)
          logout()
        }
      } else {
        logout()
      }

      setLoading(false)
    }
    initAuth()
  }, [])

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}
