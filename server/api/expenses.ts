// server/api/expenses.ts
import prisma from '~/prisma/client.js'

export default defineEventHandler(async (event) => {
  const expenses = await prisma.expense.findMany()
  return expenses
})
