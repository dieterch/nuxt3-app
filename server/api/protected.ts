// server/api/protected.ts
import { verifyToken } from '~/utils/jwt'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'user_auth_token')
  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const config = useRuntimeConfig()
  const JWT_SECRET = new TextEncoder().encode(config.public.JWT_SECRET)
  
  const payload = await verifyToken(token, JWT_SECRET)
  if (!payload) {
    throw createError({ statusCode: 401, message: 'Invalid token' })
  }

  return { message: 'This is a protected resource', userId: payload.userId }
})
