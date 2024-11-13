// composables/useAuth.ts
// import { useCookie, navigateTo } from '#app'

export const useAuth = () => {
  const logout = () => {
    useCookie('user_auth_token').value = null
    navigateTo('/login')
  }

  return { logout }
}
