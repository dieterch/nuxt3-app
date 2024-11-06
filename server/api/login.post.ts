// server/api/login.post.ts
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { defineEventHandler, createError, readBody } from 'h3'

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
  const { email, password } = await readBody<{ email: string; password: string }>(event)

  const user = await getUserByEmail(email)
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' })
  return { token }
})
