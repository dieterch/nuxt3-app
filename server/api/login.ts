// server/api/login.ts
import { createToken } from '~/utils/jwt'
import prisma from '~/prisma/client.js'
import bcrypt from 'bcrypt'


const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  // Mock User: const user = { id: 1, email: 'test@example.com', password: bcrypt.hashSync('yourPassword', 10) }
  return (user) ? ((email === user.email) ? user : null) : null
  }

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody<{ email: string; password: string }>(event)
  const user = await getUserByEmail(email) // from Database


  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  // Generate 'Json Web Token' = JWT with user info
  const token = await createToken({ 
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  })
  
  setCookie(event,'user_auth_token',token, 
    { 
      // httpOnly: true,  // does not work with this option set true
      secure: true,
      sameSite: 'strict',
      path: '/', 
      maxAge: 60*60*24*30 // 30d expiration
    })


  // // Set the token as a secure, HTTP-only cookie
  // setCookie(event, 'auth_token', token, 
  //   { 
  //     //httpOnly: true, 
  //     //secure: process.env.NODE_ENV === 'production',
  //     path: '/', 
  //     maxAge: 60 * 60
  //   }) // 1-hour expiration


  return { message: 'Login successful' }
})
