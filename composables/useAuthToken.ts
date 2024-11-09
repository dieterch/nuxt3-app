// composables/useAuthToken.ts
import { useCookie } from '#app'

export const useAuthToken = () => {
  const authCookie = useCookie<string | null>('user_auth_token')
//   , { 
//     httpOnly: true, 
//     secure: true, 
//     sameSite: 'strict',
//     path: '/', 
//     maxAge: 60*60*24*30 // 30d expiration
//   })

  // Set token
  const setToken = (token: string) => {
    authCookie.value = token
  }

  // Get token
  const getToken = (): string | null => {
    return authCookie.value
  }

  // Clear token
  const clearToken = () => {
    authCookie.value = null
  }

  return {
    setToken,
    getToken,
    clearToken,
  }
}
