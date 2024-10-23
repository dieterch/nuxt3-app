// server/api/dialogexpenses.ts
import prisma from '~/prisma/client.js'

export default defineEventHandler(async (event) => {
  const expenses = await prisma.expense.findMany({
    include: {
      trip: true,
      user: true,
      category: true,
    }
  })
  return expenses
})
