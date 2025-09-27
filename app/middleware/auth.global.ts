import { defu } from 'defu'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.meta?.auth === false) {
    return
  }
  const { loggedIn, options, fetchSession } = useAuth()
  const guestRoutes = ['/', '/login', '/signup']
  const isGuestRoute = guestRoutes.includes(to.path)
  
  // Fetch session to ensure we have the latest auth state
  await fetchSession()
  if (!loggedIn.value && !isGuestRoute) {
    return navigateTo('/login')
  }
})
