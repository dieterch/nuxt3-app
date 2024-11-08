import { jwtVerify } from 'jose'
import { useCookie } from '#app'

export default defineNuxtRouteMiddleware(async (to, from) => {

  // console.log('middleware/auth')
  // console.log('to', to)
  // console.log('from', from)

  if (import.meta.server) {
    console.log('auth.ts running on backend, skipping')
    return
  }

  // or only skip middleware on initial client load
  // const nuxtApp = useNuxtApp()
  // if (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) {
  //   console.log(' only skip middleware on initial client load')
  //   return
  // }

  const config = useRuntimeConfig()
  const secret = new TextEncoder().encode(config.public.JWT_SECRET)
  const token = useCookie('user_auth_token').value
  // console.log('in middleware auth.ts,token:',token, 'secret:', secret)

  if (!token) {
    console.log('in auth.ts, no token => redirect to login')
    return navigateTo('/login')
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    console.log('payload from jwtVerify', payload)
    // You could store `payload` in a global state if needed
  } catch (err) {
    console.log('auth.ts jwtVerify Error:', err)
    return navigateTo('/login')
  }
})
