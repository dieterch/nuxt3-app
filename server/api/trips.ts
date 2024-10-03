// server/api/trips.ts
import prisma from '~/prisma/client.js'

export default defineEventHandler(async (event) => {
  const trips = await prisma.trip.findMany()
  return trips
})
