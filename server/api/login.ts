// server/api/login.ts
import { createToken } from '~/utils/jwt'
import prisma from '~/prisma/client.js'
// import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

// const prisma = new PrismaClient()


interface User {
    id: number
    email: string
    password: string // stored hashed password
  }
// Replace with actual data retrieval
const getUserByEmail = async (email: string): Promise<User | null> => {
    // Sample user, replace with database query
    const sampleUser = { id: 1, email: 'test@example.com', password: bcrypt.hashSync('yourPassword', 10) }
    return email === sampleUser.email ? sampleUser : null
  }

export default defineEventHandler(async (event) => {
  // const { email, password } = await readBody(event)
  const { email, password } = await readBody<{ email: string; password: string }>(event)

  const user = await getUserByEmail(email)
    //   // Find user in the database
    //   const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

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
