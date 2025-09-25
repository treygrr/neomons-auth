<script setup lang="ts">
definePageMeta({
  auth: {
    only: 'user',
    redirectGuestTo: '/',
  },
})

const auth = useAuth()
const toast = useToast()
const route = useRoute()

const loading = ref(false)
const passwordFormRef = ref()

// Get user information
const { user } = auth

// Determine the mode based on query parameters
const mode = computed(() => {
  if (route.query.mode === 'change') return 'change-password'
  if (route.query.from === 'oauth') return 'setup-password'
  return 'setup-password'
})

// Check if user came from a specific flow
const fromOAuth = computed(() => route.query.from === 'oauth')
const isChangingPassword = computed(() => route.query.mode === 'change')

async function handlePasswordSetup(formData: { email: string; password: string; name?: string; currentPassword?: string }) {
  if (loading.value) return
  loading.value = true

  try {
    if (isChangingPassword.value) {
      // Handle password change for existing users with email/password auth
      const { error } = await auth.client.changePassword({
        currentPassword: formData.currentPassword!,
        newPassword: formData.password,
      })
      
      if (error) {
        passwordFormRef.value?.setError(error.message)
      } else {
        toast.add({
          title: 'Password Updated Successfully!',
          description: 'Your password has been changed.',
          color: 'success',
        })
        
        await navigateTo('/user')
      }
    } else {
      // Handle password setup for OAuth users - use setPassword API
      try {
        await $fetch('/api/set-password', {
          method: 'POST',
          body: { 
            newPassword: formData.password
          }
        })
        
        toast.add({
          title: 'Password Set Up Successfully!',
          description: 'You can now sign in with both GitHub and email/password.',
          color: 'success',
        })
        
        // Redirect back to user page after successful setup
        await navigateTo('/user')
        
      } catch (apiError: any) {
        // If setPassword fails, try regular registration (for edge cases)
        const { error } = await auth.signUp.email({
          email: formData.email,
          password: formData.password,
          name: formData.name || user.value?.name || '',
        })
        
        if (error) {
          passwordFormRef.value?.setError(error.message)
        } else {
          toast.add({
            title: 'Account Created Successfully!',
            description: 'Your email and password authentication has been set up.',
            color: 'success',
          })
          
          await navigateTo('/user')
        }
      }
    }
    
  } catch (err: any) {
    passwordFormRef.value?.setError(err.statusMessage || err.message || 'An unexpected error occurred. Please try again.')
  }
  
  loading.value = false
}
</script>

<template>
  <div>
    <div class="max-w-md mx-auto">
      <!-- Info Banner for OAuth users -->
      <div v-if="fromOAuth" class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div class="flex items-center">
          <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
          <div class="text-sm text-blue-800 dark:text-blue-200">
            <p class="font-medium mb-1">Set up email & password authentication</p>
            <p>Your email is pre-filled from your GitHub account, but you can change it if needed. This adds email/password authentication to your existing account rather than creating a new one.</p>
          </div>
        </div>
      </div>

      <!-- Info Banner for password changes -->
      <div v-if="isChangingPassword" class="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div class="flex items-center">
          <UIcon name="i-heroicons-shield-exclamation" class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
          <p class="text-sm text-yellow-800 dark:text-yellow-200">
            You're changing your account password. Make sure to use a strong, unique password.
          </p>
        </div>
      </div>

      <PasswordSetupForm
        ref="passwordFormRef"
        :mode="mode"
        :existing-user="{ email: user?.email, name: user?.name }"
        :loading="loading"
        @submit="handlePasswordSetup"
      />
    </div>
  </div>
</template>