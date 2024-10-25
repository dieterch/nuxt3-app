import prisma from '~/prisma/client.js'

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    return await prisma.expense.findMany(
      {
      include: {
        trip: true,
        user: true,
        category: true,
      }
    })
 }

  if (event.node.req.method === 'POST') {
    const body = await readBody(event) // Verwende readBody statt useBody
    console.log('body',body)
    return await prisma.expense.create({
      data: body,
    })
  }

  if (event.node.req.method === 'DELETE') {
    const body = await readBody(event) // Verwende readBody statt useBody

    // finally delete the category
    const expense = await prisma.expense.delete({
      where: {
        id: body.id
      }
    })
    console.log(
      "\Expense", expense,
    '\ndeleted.')
  }

})

