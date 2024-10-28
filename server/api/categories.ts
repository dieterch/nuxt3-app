import prisma from '~/prisma/client.js'

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    return await prisma.category.findMany({
      include: {
        expenses: true,
      }
    })
 }

  if (event.node.req.method === 'POST') {
    const body = await readBody(event) // Verwende readBody statt useBody
    return await prisma.category.create({
      data: body,
    })
  }

  if (event.node.req.method === 'DELETE') {
    const body = await readBody(event) // Verwende readBody statt useBody

    // finally delete the category
    const category = await prisma.category.delete({
      where: {
        id: body.id
      }
    })
    console.log(
      "\nCategory", category,
    '\ndeleted.')
  }

})

