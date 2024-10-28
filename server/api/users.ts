import prisma from '~/prisma/client.js'

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    return await prisma.user.findMany({
      include: {
        trips:true,
        expenses:true,
        shares:true
      }
    })
  }

  if (event.node.req.method === 'POST') {
    const body = await readBody(event) // Verwende readBody statt useBody
    return await prisma.user.create({
      data: body,
    })
  }

  if (event.node.req.method === 'DELETE') {
    const body = await readBody(event) // Verwende readBody statt useBody

    // finally delete the trip
    const user = await prisma.user.delete({
      where: {
        id: body.id
      }
    })
  }

})

