<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <UIcon name="i-lucide-mail" class="mx-auto h-16 w-16 text-primary-500" />
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          Email Verification
        </h2>
      </div>

      <!-- Loading State -->
      <div v-if="status === 'loading'" class="text-center">
        <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin mx-auto mb-4 text-primary-500" />
        <p class="text-gray-600 dark:text-gray-400">Verifying your email address...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="status === 'success'" class="text-center">
        <UIcon name="i-lucide-check-circle" class="w-16 h-16 mx-auto mb-4 text-green-500" />
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">
          Email Verified Successfully!
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Your email address has been verified. You can now access all features of your account.
        </p>
        <UButton to="/account" color="primary" size="lg">
          Go to Account
        </UButton>
      </div>

      <!-- Error State -->
      <div v-else-if="status === 'error'" class="text-center">
        <UIcon name="i-lucide-x-circle" class="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">
          Verification Failed
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ errorMessage }}
        </p>
        <div class="space-y-3">
          <UButton to="/account" variant="outline" size="lg" block>
            Back to Account
          </UButton>
          <UButton @click="retryVerification" color="primary" size="lg" block :loading="retrying">
            Request New Link
          </UButton>
        </div>
      </div>

      <!-- Invalid/Missing Token -->
      <div v-else class="text-center">
        <UIcon name="i-lucide-alert-triangle" class="w-16 h-16 mx-auto mb-4 text-yellow-500" />
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">
          Invalid Verification Link
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          This verification link is invalid or has expired. Please request a new one.
        </p>
        <UButton to="/account" color="primary" size="lg">
          Go to Account
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const toast = useToast()
const { user, fetchSession } = useAuth()

const status = ref<'loading' | 'success' | 'error' | 'invalid'>('loading')
const errorMessage = ref('')
const retrying = ref(false)

// Get token and email from query parameters
const token = route.query.token as string
const email = route.query.email as string

const verifyEmail = async () => {
  if (!token) {
    status.value = 'invalid'
    return
  }

  try {
    status.value = 'loading'
    
    // In a real implementation, you'd call your backend API to verify the token
    // For now, we'll simulate the verification
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock verification logic - in reality this would be handled by better-auth
    // or your backend verification endpoint
    if (token && token.length > 10) {
      status.value = 'success'
      
      // Refresh user session to get updated emailVerified status
      await fetchSession()
      
      toast.add({
        title: 'Email Verified',
        description: 'Your email has been successfully verified.',
        color: 'success',
        icon: 'i-lucide-check-circle'
      })
    } else {
      throw new Error('Invalid verification token')
    }
  } catch (error) {
    console.error('Email verification error:', error)
    status.value = 'error'
    errorMessage.value = error instanceof Error 
      ? error.message 
      : 'The verification link is invalid or has expired.'
  }
}

const retryVerification = async () => {
  try {
    retrying.value = true
    
    if (!user.value) {
      throw new Error('Please log in to request a new verification link.')
    }

    // Generate new verification token and URL
    const newToken = crypto.randomUUID()
    const verificationUrl = `${window.location.origin}/verify-email?token=${newToken}&email=${encodeURIComponent(user.value.email)}`
    
    // Call the email verification API
    await $fetch('/api/send-email-verification', {
      method: 'POST',
      body: {
        user: user.value,
        subject: 'Verify Your Email Address - Neomons Auth',
        verificationUrl,
        token: newToken
      }
    })
    
    toast.add({
      title: 'New Verification Email Sent',
      description: 'Please check your email for the new verification link.',
      color: 'success',
      icon: 'i-lucide-mail-check'
    })
    
    // Redirect to account page
    await router.push('/account')
  } catch (error) {
    console.error('Retry verification error:', error)
    
    toast.add({
      title: 'Failed to Send Email',
      description: error instanceof Error ? error.message : 'An error occurred',
      color: 'error',
      icon: 'i-lucide-mail-x'
    })
  } finally {
    retrying.value = false
  }
}

// Start verification on mount
onMounted(() => {
  verifyEmail()
})

// Set page meta
useSeoMeta({
  title: 'Email Verification - Neomons Auth',
  description: 'Verify your email address to complete your account setup.',
})
</script>