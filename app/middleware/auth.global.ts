import { defu } from 'defu'

type MiddlewareOptions = false | {
  /**
   * Only apply auth middleware to guest or user
   */
  only?: 'guest' | 'user'
  /**
   * Redirect authenticated user to this route
   */
  redirectUserTo?: string
  /**
   * Redirect guest to this route
   */
  redirectGuestTo?: string
}

declare module '#app' {
  interface PageMeta {
    auth?: MiddlewareOptions
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    auth?: MiddlewareOptions
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  // If auth is disabled, skip middleware
  if (to.meta?.auth === false) {
    return
  }
  const { loggedIn, options, fetchSession } = useAuth()
  const { only, redirectUserTo, redirectGuestTo } = defu(to.meta?.auth, options)

  // If client-side, fetch session before any auth checks
  if (import.meta.client) {
    await fetchSession()
  }

  // If guest-only page and user is authenticated, redirect authenticated user away
  if (only === 'guest' && loggedIn.value) {
    // Avoid infinite redirect
    if (to.path === redirectUserTo) {
      return
    }
    return navigateTo(redirectUserTo)
  }

  // If user-only page (or no specific 'only' setting) and user is not authenticated
  if (only === 'user' && !loggedIn.value) {
    // Avoid infinite redirect
    if (to.path === redirectGuestTo) {
      return
    }
    return navigateTo(redirectGuestTo)
  }

  // For pages without explicit 'only' setting, redirect unauthenticated users to guest route
  if (!only && !loggedIn.value) {
    // Avoid infinite redirect
    if (to.path === redirectGuestTo) {
      return
    }
    return navigateTo(redirectGuestTo)
  }
})
