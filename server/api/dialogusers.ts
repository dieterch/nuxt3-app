import prisma from '~/prisma/client.js'

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    return await prisma.user.findMany()
 }

  if (event.node.req.method === 'POST') {
    const body = await readBody(event) // Verwende readBody statt useBody
    return await prisma.user.create({
      data: body,
    })
  }
})

