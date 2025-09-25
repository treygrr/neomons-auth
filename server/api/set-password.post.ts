import { serverAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { newPassword } = body

  if (!newPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password is required'
    })
  }

  if (newPassword.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password must be at least 8 characters long'
    })
  }

  try {
    // Use Better Auth's setPassword method to add email/password to existing OAuth account
    // This requires the user to be authenticated (session token in headers)
    const response = await serverAuth().api.setPassword({
      body: { newPassword },
      headers: {
        authorization: getHeader(event, 'authorization') || '',
        cookie: getHeader(event, 'cookie') || '',
        'user-agent': getHeader(event, 'user-agent') || '',
      },
    })

    return { success: true, message: 'Password set successfully' }
  } catch (error: any) {
    console.error('SetPassword error:', error)
    
    // Handle specific Better Auth errors
    if (error.status === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: 'You must be signed in to set a password'
      })
    }
    
    if (error.status === 409) {
      throw createError({
        statusCode: 409,
        statusMessage: 'A credential account already exists for this user'
      })
    }
    
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.message || 'Failed to set password'
    })
  }
})