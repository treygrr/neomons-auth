export default defineEventHandler(async (event) => {
  const { username: rawUsername } = await readBody(event)
  
  if (!rawUsername || typeof rawUsername !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username is required'
    })
  }

  // Convert to lowercase for consistency
  const username = rawUsername.toLowerCase()

  // Basic username validation
  if (username.length < 3) {
    return {
      available: false,
      message: 'Username must be at least 3 characters'
    }
  }

  if (username.length > 30) {
    return {
      available: false,
      message: 'Username must be no more than 30 characters'
    }
  }

  if (!/^[a-z0-9_-]+$/.test(username)) {
    return {
      available: false,
      message: 'Username can only contain letters, numbers, underscores, and hyphens'
    }
  }

  try {
    // Use Nuxt Hub database instance
    const db = hubDatabase()

    // Check if username exists in the user table
    const existingUser = await db
      .prepare('SELECT id FROM user WHERE username = ?')
      .bind(username)
      .first()

    const available = !existingUser

    return {
      available,
      message: available ? 'Username is available' : 'Username is already taken'
    }
  } catch (error) {
    console.error('Error checking username availability:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to check username availability'
    })
  }
})