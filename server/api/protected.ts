// server/api/protected.ts
import { verifyToken } from '~/utils/jwt'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const payload = await verifyToken(token)
  if (!payload) {
    throw createError({ statusCode: 401, message: 'Invalid token' })
  }

  return { message: 'This is a protected resource', userId: payload.userId }
})
