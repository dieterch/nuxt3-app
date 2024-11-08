// server/api/logout.ts
export default defineEventHandler((event) => {
    deleteCookie(event, 'user_auth_token')
    return { message: 'Logged out successfully' }
  })
  