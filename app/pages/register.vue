<script setup lang="ts">
definePageMeta({
  auth: {
    only: 'guest',
    redirectUserTo: '/user',
  },
})

const auth = useAuth()
const toast = useToast()
const route = useRoute()

const loading = ref(false)
const passwordFormRef = ref()

// Check if this is a password setup for an existing OAuth user
const setupMode = computed(() => route.query.setup === 'password')
const existingUser = computed(() => {
  if (setupMode.value) {
    return {
      email: route.query.email as string,
      name: route.query.name as string,
    }
  }
  return undefined
})

async function handleFormSubmit(formData: { email: string; password: string; name?: string }) {
  if (loading.value) return
  loading.value = true

  try {
    if (setupMode.value) {
      // Handle password setup for existing OAuth user
      // Note: This would require a custom API endpoint in better-auth
      // For now, we'll show a message that this feature needs backend implementation
      toast.add({
        title: 'Feature Coming Soon',
        description: 'Password setup for OAuth accounts requires additional backend configuration.',
        color: 'info',
      })
    } else {
      // Handle new user registration
      const { error } = await auth.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name || '',
      })
      
      if (error) {
        passwordFormRef.value?.setError(error.message)
      } else {
        toast.add({
          title: 'Account Created!',
          description: 'You have been signed up successfully.',
          color: 'success',
        })
        await navigateTo('/user')
      }
    }
  } catch (err) {
    passwordFormRef.value?.setError('An unexpected error occurred. Please try again.')
  }
  
  loading.value = false
}
</script>

<template>
  <div>
    <PasswordSetupForm
      ref="passwordFormRef"
      :mode="setupMode ? 'setup-password' : 'register'"
      :existing-user="existingUser"
      :loading="loading"
      @submit="handleFormSubmit"
    />
  </div>
</template>