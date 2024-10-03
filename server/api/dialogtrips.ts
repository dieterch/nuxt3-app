import prisma from '~/prisma/client.js'

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    return await prisma.trip.findMany({
/*      include: {
        users: {
          include: {
            user: true,
          },
        },
        expenses: {
          include: {
            category: true,
            shares: {
              include: {
                user: true,
              },
            },
          },
        },
      }, */
    })
  }

  if (event.node.req.method === 'POST') {
    const body = await readBody(event) // Verwende readBody statt useBody
    return await prisma.trip.create({
      data: body,
    })
  }
})

