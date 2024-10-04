import prisma from '~/prisma/client.js'

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    return await prisma.trip.findMany({
/*      select: {
        id: true,
        name: true,
        startDate: true,
        users: {
          select: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    shares: true,
                }
            },
          },
        },
        expenses: {
          select: {
            date:true,
            location:true,
            category: {
                select: {
                    icon: true,
                    name: true,
                }
            },
            amount:true,
            currency:true,
            description:true,
            userId:true,
            user: {
                select: {
                    name:true,
                }
            }
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

