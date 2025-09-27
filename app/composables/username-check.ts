interface UsernameCheckResult {
  available: boolean
  message: string
}

interface UsernameCheckState {
  isChecking: boolean
  result: UsernameCheckResult | null
  error: string | null
}

export function useUsernameCheck() {
  const state = reactive<UsernameCheckState>({
    isChecking: false,
    result: null,
    error: null
  })

  // Debounce timer
  let debounceTimer: NodeJS.Timeout | null = null

  const checkUsername = async (username: string) => {
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // Reset state
    state.error = null

    // Don't check empty usernames
    if (!username.trim()) {
      state.result = null
      state.isChecking = false
      return
    }

    // Set checking state immediately for very short usernames
    if (username.length < 3) {
      state.result = {
        available: false,
        message: 'Username must be at least 3 characters'
      }
      state.isChecking = false
      return
    }

    // Debounce the API call
    state.isChecking = true
    debounceTimer = setTimeout(async () => {
      try {
        const result = await $fetch<UsernameCheckResult>('/api/check-username', {
          method: 'POST',
          body: { username }
        })
        
        state.result = result
      } catch (error: any) {
        state.error = error.data?.message || 'Failed to check username availability'
        state.result = null
      } finally {
        state.isChecking = false
      }
    }, 500) // 500ms debounce
  }

  const clearCheck = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
    state.isChecking = false
    state.result = null
    state.error = null
  }

  return {
    ...toRefs(state),
    checkUsername,
    clearCheck
  }
}