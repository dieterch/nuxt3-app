// server/api/categories.ts
import prisma from '~/prisma/client.js'

export default defineEventHandler(async (event) => {
  const categories = await prisma.category.findMany()
  return categories
})
