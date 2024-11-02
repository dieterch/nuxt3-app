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

  interface UserInput {
    userId: string,
    tripId: string
  }

  // interface TripUpdateBody {
  //   id: string,
  //   name: string,
  //   startDate: string,
  //   users: UserInput[]
  // }


  // my Code
  if (event.node.req.method === 'PUT') {
    const body = await readBody(event) // Verwende readBody statt useBody
    console.log('body:\n',body)
    const updatedTrip = await prisma.trip.update({
      where: { id: body.id},
      data: {
        name: body.name,
        startDate: body.startDate
      },
    })

    // lösche alle tripUser des Trips
    await prisma.tripUser.deleteMany({
      where: {
        tripId: body.id
      }
    })

    // und füge die selektierten user wieder ein.
    await Promise.all(
      body.users.map( async ( user: UserInput ) => {
        await prisma.tripUser.upsert({
          where: {
            userId_tripId : {
              userId: user.userId,
              tripId: user.tripId,
            },
          },
          update: {},
          create: {
            userId: user.userId,
            tripId: user.tripId
          }
        })
      })
    )

    return updatedTrip
  }

  if (event.node.req.method === 'DELETE') {
    const body = await readBody(event) // Verwende readBody statt useBody    
    // finally delete the trip
    const trip = await prisma.trip.delete({
      where: {
        id: body.id
      }
    })
  }
})

