import { parseCookies } from 'h3'
import { jwtVerify } from 'jose'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const event = useRequestEvent()
  const cookies = parseCookies(event)
  const token = cookies['auth_token']

  if (!token) {
    return navigateTo('/login')
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    // You could store `payload` in a global state if needed
  } catch (err) {
    return navigateTo('/login')
  }
})
