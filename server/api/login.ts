// server/api/login.ts
import { createToken } from '~/utils/jwt'
import prisma from '~/prisma/client.js'
import bcrypt from 'bcrypt'

// interface User {
//     id: number
//     email: string
//     password: string // stored hashed password
//   }


// const getUserByEmail = async (email: string): Promise<User | null> => {
const getUserByEmail = async (email: string) => {
  // Find user in the database
  const user = await prisma.user.findUnique({ where: { email } })
  // Mock User: const user = { id: 1, email: 'test@example.com', password: bcrypt.hashSync('yourPassword', 10) }
  return (user) ? ((email === user.email) ? user : null) : null
  }

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody<{ email: string; password: string }>(event)

  const user = await getUserByEmail(email)

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  // Currently Password is plain in the database => will be replaced
  // by a hash when email registration is implemented.
  // if (!user || !(password === user.password)) {
  //   throw createError({ statusCode: 401, message: 'Invalid credentials' })
  // }

  // Generate JWT with user info
  const token = await createToken({ userId: user.id, email: user.email })
  
  setCookie(event,'user_auth_token',token, 
    { 
      httpOnly: false,
      secure: true,
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
