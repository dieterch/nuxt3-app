import prisma from '~/prisma/client.js'

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'POST') {
    const body = await readBody(event) // Verwende readBody statt useBody
    //DEBUG console.log('body',body)
    return await prisma.expense.findMany({
      where: {
        tripId: body.id
        },
      include: {
        trip: true,
        user: true,
        category: true,
      }}
    )
  }
})

