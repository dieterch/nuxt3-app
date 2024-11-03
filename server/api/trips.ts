import prisma from '~/prisma/client.js'

export default defineEventHandler(async (event) => {
  try {
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

    const body = await readBody(event) // Verwende readBody statt useBody
    console.log('trips body:\n',body)

    if (event.node.req.method === 'POST') {
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


    // Update Trip - logic to prevent invalid operation in 
    // the frontend code.
    if (event.node.req.method === 'PUT') {
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
                tripId: body.id
              },
            },
            update: {},
            create: {
              userId: user.userId,
              tripId: body.id
            }
          })
        })
      )

      return updatedTrip
    }

    if (event.node.req.method === 'DELETE') {
      const trip = await prisma.trip.delete({
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

