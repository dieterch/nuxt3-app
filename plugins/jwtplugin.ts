// plugins/jwt.ts
import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { type JWTPayload } from 'jose'
import { createToken, verifyToken } from '~/utils/jwt'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const JWT_SECRET = new TextEncoder().encode(config.public.JWT_SECRET)

  // Provide the JWT helper with pre-configured secret
  const jwtHelper = {
    createToken: (payload: JWTPayload, expiresIn = '24h') => {
      return createToken(payload, JWT_SECRET, expiresIn)
    },
    verifyToken: (token: string | null) => {
      return verifyToken(token, JWT_SECRET)
    },
  }

  return {
    provide: {
      jwtHelper,
    },
  }
})

