// server/api/logout.ts
import { verifyToken } from '~/utils/jwt'

export default defineEventHandler(async(event) => {
  const token = getCookie(event,'user_auth_token')
  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const config = useRuntimeConfig()
  const JWT_SECRET = new TextEncoder().encode(config.public.JWT_SECRET)
  
  const payload = await verifyToken(token, JWT_SECRET)
  if (!payload) {
    throw createError({ statusCode: 401, message: 'Invalid token' })
  }

    deleteCookie(event, 'user_auth_token')
    return { message: 'Logged out successfully' }
})
  