// composables/useAuthToken.ts
import { useCookie } from '#app'

export const useAuthToken = () => {
  const authCookieName = 'user_auth_token'

  // Set token
  const setToken = (token: string) => {
    if (import.meta.client) {
      document.cookie = `${authCookieName}=${token}; path=/; max-age=3600;`
    } else {
      const authCookie = useCookie(authCookieName)
      authCookie.value = token
    }
  }

  // Get token
  const getToken = (): string | null => {
    if (import.meta.client) {
      const match = document.cookie.match(new RegExp('(^| )' + authCookieName + '=([^;]+)'))
      return match ? match[2] : null
    } else {
      const authCookie = useCookie(authCookieName)
      if (typeof(authCookie) === undefined) return null
      return <string | null>authCookie.value
    }
  }

  // Clear token
  const clearToken = () => {
    if (import.meta.client) {
      document.cookie = `${authCookieName}=; path=/; max-age=0;`
    } else {
      const authCookie = useCookie(authCookieName)
      authCookie.value = null
    }
  }

  return {
    setToken,
    getToken,
    clearToken,
  }
}


// // composables/useAuthToken.ts
// import { useCookie } from '#app'

// export const useAuthToken = () => {
//   const authCookie = useCookie<string | null>('user_auth_token')

//   // Set token
//   const setToken = (token: string) => {
//     authCookie.value = token
//   }

//   // Get token
//   const getToken = (): string | null => {
//     return authCookie.value
//   }

//   // Clear token
//   const clearToken = () => {
//     authCookie.value = null
//   }

//   return {
//     setToken,
//     getToken,
//     clearToken,
//   }
// }
