import prisma from '~/prisma/client.js'

export default defineEventHandler(async (event) => {
  try {
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
    
    const body = await readBody(event) // Verwende readBody statt useBody
    console.log('expenses body:\n',body)

    if (event.node.req.method === 'POST') {
      return await prisma.expense.create({
        data: body,
      })
    }
    
    if (event.node.req.method === 'PUT') {
      return await prisma.expense.update({
        where: {
          id: body.id
        },
        data: body,
      })
    }
    
    if (event.node.req.method === 'DELETE') {
      const expense = await prisma.expense.delete({
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

