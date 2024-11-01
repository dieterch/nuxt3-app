import prisma from '~/prisma/client.js'

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    return await prisma.trip.findMany({
      select: {
        id:true,
        startDate: true,
        name: true,
        users: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email:true,
              }
            }
          }
        },
        expenses: true
      }
    })
 }

  if (event.node.req.method === 'POST') {
    const body = await readBody(event) // Verwende readBody statt useBody
    return await prisma.trip.create({
      data: body,
    })
  }


  if (event.node.req.method === 'PUT') {
    const body = await readBody(event) // Verwende readBody statt useBody
    console.log('body:\n',body)
    return await prisma.trip.update({
      where: {
        name: body.name
      },
      data: body,
    })
  }

  if (event.node.req.method === 'DELETE') {
    const body = await readBody(event) // Verwende readBody statt useBody

    // // delete all Tripusers first. 
    // const updateTripusers = await prisma.tripUser.deleteMany({
    //   where: {
    //     tripId: body.id
    //   }
    // })
    
    // // and the relevant tripshares. 
    // const updateShares = await prisma.tripShare.deleteMany({
    //   where: {
    //     tripId: body.id
    //   }
    // })

    // // delete all trip expenses. 
    // const updateExpenses = await prisma.expense.deleteMany({
    //   where: {
    //     tripId: body.id
    //   }
    // })

    
    // finally delete the trip
    const trip = await prisma.trip.delete({
      where: {
        id: body.id
      }
    })
    console.log(
      // "\nTripUsers", updateTripusers, 
      // "\nShares", updateShares, 
      // "\nExpenses", updateExpenses, 
      "\nTrip", trip,
    '\ndeleted.')
  }
})

