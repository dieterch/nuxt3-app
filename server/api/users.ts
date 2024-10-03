// server/api/users.ts
import prisma from '~/prisma/client.js'

export default defineEventHandler(async (event) => {
  const users = await prisma.user.findMany()
  return users
})
