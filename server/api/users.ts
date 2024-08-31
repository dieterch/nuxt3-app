// server/api/users.ts
import prisma from '@prisma/client'

export default defineEventHandler(async (event) => {
  const users = await prisma.user.findMany()
  return users
})
