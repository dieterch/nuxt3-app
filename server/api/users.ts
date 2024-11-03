import prisma from '~/prisma/client.js'

export default defineEventHandler(async (event) => {
try {  
    if (event.node.req.method === 'GET') {
      return await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          //trips:true,
          //expenses:true,
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

