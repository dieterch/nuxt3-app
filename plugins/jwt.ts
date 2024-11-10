// plugins/jwt.ts
import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { SignJWT, jwtVerify, type JWTPayload } from 'jose'


export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const JWT_SECRET = new TextEncoder().encode(config.public.JWT_SECRET)

    // Example of setting up a JWT utility or helper with the runtime config
    const jwtHelper = {
        createToken: (payload: JWTPayload, expiresIn = '24h'): Promise<string> => {
            return new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime(expiresIn)
            .sign(JWT_SECRET)
        },

        // Function to verify and decode a JWT
        verifyToken: async (token: string | null): Promise<JWTPayload | null> => {
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
    }

  // Provide the JWT helper globally
  return {
    provide: {
      jwtHelper
    }
  }
})
