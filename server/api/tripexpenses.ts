import prisma from '~/prisma/client.js'

export default defineEventHandler(async (event) => {
try {  
      const body = await readBody(event) // Verwende readBody statt useBody
      console.log('tripexpenses body:\n',body)

      if (event.node.req.method === 'POST') {
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
} catch (error) {
  console.error("Database operation error:", error)
  return { error: "An error occurred during the request." }
}
})