// utils/jwt.ts
import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

const config = useRuntimeConfig()
const JWT_SECRET = new TextEncoder().encode(config.public.JWT_SECRET)
// const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-default-secret-key')

// Function to create a signed JWT
export async function createToken(payload: JWTPayload, expiresIn = '1h'): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET)
}

// Function to verify and decode a JWT
export async function verifyToken(token: string | null): Promise<JWTPayload | null> {
  try {
    if (token) {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      return payload
    } else return null
  } catch (error) {
    console.error('Invalid token:', error)
    return null
  }
}

