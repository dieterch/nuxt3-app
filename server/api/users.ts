// server/api/users.ts
import { verifyToken } from '~/utils/jwt'
import prisma from '~/prisma/client.js'

export default defineEventHandler(async (event) => {
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

  try {  
      if (event.node.req.method === 'GET') {
        return await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
            trips:true,
            expenses:true,
            //shares:true
          }
        })
      }

      const body = await readBody(event) // Verwende readBody statt useBody
      console.log('users body:\n',body)

      if (event.node.req.method === 'POST') {
        return await prisma.user.create({
          data: body,
        })
      }

      if (event.node.req.method === 'PUT') {
        return await prisma.user.update({
          where: {
            id: body.id
          },
          data: body,
        })
      }

      if (event.node.req.method === 'DELETE') {
        const user = await prisma.user.delete({
          where: {
            id: body.id
          }
        })
      }
    } catch (error) {
      console.error("Database operation error:", error)
      return { error: "An error occurred during the request." }
    }
  })

