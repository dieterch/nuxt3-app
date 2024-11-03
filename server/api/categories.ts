import prisma from '~/prisma/client.js'

export default defineEventHandler(async (event) => {
try {
    if (event.node.req.method === 'GET') {
      return await prisma.category.findMany({
        include: {
          expenses: true,
        }
      })
    }

    const body = await readBody(event) // Verwende readBody statt useBody
    console.log('categories body:\n',body)

    if (event.node.req.method === 'POST') {
      return await prisma.category.create({
        data: body,
      })
    }

    if (event.node.req.method === 'PUT') {
      return await prisma.category.update({
        where: {
          id: body.id
        },
        data: body,
      })
    }

    if (event.node.req.method === 'DELETE') {
      const category = await prisma.category.delete({
        where: {
          id: body.id
        }
      })
    }

  }  catch (error) {
    console.error("Database operation error:", error)
    return { error: "An error occurred during the request." }
  } 

})
