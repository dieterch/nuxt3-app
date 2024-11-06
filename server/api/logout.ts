// server/api/logout.ts
export default defineEventHandler((event) => {
    deleteCookie(event, 'auth_token')
    return { message: 'Logged out successfully' }
  })
  