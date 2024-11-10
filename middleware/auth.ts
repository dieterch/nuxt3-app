// import { jwtVerify } from 'jose'
// import { useCookie } from '#app'
// import { verifyToken } from "~/utils/jwt"
import { useNuxtApp } from '#app'
import { useAuthToken } from "~/composables/useAuthToken";

export default defineNuxtRouteMiddleware(async (to, from) => {

  if (import.meta.server) {
    console.log('auth.ts running on backend, skipping')
    return
  }

  const { getToken } = useAuthToken()
  const token = getToken()

  // const config = useRuntimeConfig()
  // const secret = new TextEncoder().encode(config.public.JWT_SECRET)
  // const token = useCookie('user_auth_token').value
  // console.log('in middleware auth.ts,token:',token, 'secret:', secret)

  if (!token) {
    console.log('in auth.ts, no token => redirect to login')
    return navigateTo('/login')
  }

  try {
    const { $jwtHelper } = useNuxtApp()
    const payload = await $jwtHelper.verifyToken(token)
    // console.log('payload from verifyToken', payload)
    // You could store `payload` in a global state if needed
  } catch (err) {
    console.log('auth.ts jwtVerify Error:', err)
    return navigateTo('/login')
  }
})
