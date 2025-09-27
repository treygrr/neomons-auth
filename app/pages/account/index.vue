<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="!user" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin mx-auto mb-4" />
        <p class="text-gray-600 dark:text-gray-400">Loading account information...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Page Header -->
       <UPageCard class="mb-8">
        <div>
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-4xl font-bold light:text-gray-900 dark:text-white">Account Overview</h1>
              <p class="text-lg text-gray-600 dark:text-gray-400 mt-3">
                Account at a glance
              </p>
            </div>
          </div>
        </div>

        <!-- Account Status Cards -->
        <div class="mb-8">
          <AccountStatusCards 
            :user="user"
            :connected-accounts-count="connectedAccounts.length"
            :two-factor-enabled="twoFactorEnabled"
          />
        </div>
      </UPageCard>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column -->
        <div class="space-y-8">
          <!-- Profile Information -->
          <AccountProfileInformation 
            :user="user"
            :username="username"
            @profile-updated="handleProfileUpdate"
          />

          <!-- Email Settings -->
          <AccountEmailSettings 
            :user="user"
            @email-updated="handleEmailUpdate"
            @verification-resent="handleVerificationResent"
          />
        </div>

        <!-- Right Column -->
        <div class="space-y-8">
          <!-- Password Security -->
          <PasswordSecurity 
            :user="user"
            @password-updated="handlePasswordUpdate"
          />

          <!-- Two-Factor Authentication -->
          <AccountTwoFactorAuth 
            :two-factor-enabled="twoFactorEnabled"
            :recovery-codes="recoveryCodes"
            @two-factor-toggled="handleTwoFactorToggled"
            @two-factor-setup="handleTwoFactorSetup"
            @recovery-codes-downloaded="handleRecoveryCodesDownloaded"
          />

          <!-- Connected Accounts -->
          <AccountConnectedAccounts 
            :connected-accounts="connectedAccounts"
            @connection-toggled="handleConnectionToggled"
          />
        </div>
      </div>
      <USeparator class="mt-16" />
      <!-- Danger Zone -->
      <div class="mt-16">
        <AccountDangerZone 
          @account-deleted="handleAccountDeleted"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Auth composable
const { user, session, client } = useAuth()
const toast = useToast()

// Ensure we have session data
await callOnce(async () => {
  if (process.client && !session.value) {
    await client.getSession()
  }
})

// Mock data - these would come from your API/state management
const username = ref(useAuth().user.value?.name || '') // This would come from better-auth username plugin
const twoFactorEnabled = ref(false)

const connectedAccounts = ref([
  {
    provider: 'github',
    icon: 'i-lucide-github',
    color: 'text-gray-800 dark:text-gray-200',
    connected: true,
    username: 'johndoe'
  },
  {
    provider: 'google',
    icon: 'i-lucide-chrome',
    color: 'text-red-500',
    connected: false,
    username: null
  },
  {
    provider: 'discord',
    icon: 'i-lucide-message-circle',
    color: 'text-indigo-500',
    connected: false,
    username: null
  }
])

const recoveryCodes = ref([
  'a1b2-c3d4', 'e5f6-g7h8', 'i9j0-k1l2',
  'm3n4-o5p6', 'q7r8-s9t0', 'u1v2-w3x4'
])

// Event handlers for child components
const handleProfileUpdate = async (data: { name: string; username: string }) => {
  try {
    // Implement profile update logic with better-auth
    console.log('Updating profile:', data)
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update local state or refetch user data
    // This would typically update the user object via your auth system
  } catch (error) {
    console.error('Profile update error:', error)
  }
}

const handleEmailUpdate = async (data: { newEmail: string; password: string }) => {
  try {
    // Implement email update logic with better-auth
    console.log('Updating email:', data)
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('Email update error:', error)
  }
}

const handleVerificationResent = async () => {
  try {
    if (!user.value) {
      throw new Error('User not found')
    }

    // Check if user email is already verified
    if (user.value.emailVerified) {
      toast.add({
        title: 'Email Already Verified',
        description: 'Your email address is already verified.',
        icon: 'i-lucide-check-circle',
        color: 'info'
      })
      return
    }

    console.log('Resending verification email')
    
    // In a real implementation, you'd use better-auth's email verification system
    // For now, we'll generate a token and URL (this should be done server-side)
    const token = crypto.randomUUID()
    const verificationUrl = `${window.location.origin}/verify-email?token=${token}&email=${encodeURIComponent(user.value.email)}`
    
    // Call the email verification API
    const result = await $fetch('/api/send-email-verification', {
      method: 'POST',
      body: {
        user: user.value,
        subject: 'Verify Your Email Address - Neomons Auth',
        verificationUrl,
        token
      }
    })
    
    // Show success notification
    toast.add({
      title: 'Verification Email Sent',
      description: `Please check your email at ${user.value.email} for the verification link.`,
      icon: 'i-lucide-mail-check',
      color: 'success'
    })
    
    console.log('Verification email sent successfully:', result)
  } catch (error) {
    console.error('Verification email error:', error)
    
    // Show error notification with more specific error handling
    let errorMessage = 'An unexpected error occurred while sending the verification email.'
    
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'object' && error !== null && 'data' in error) {
      errorMessage = (error as any).data?.message || errorMessage
    }
    
    toast.add({
      title: 'Failed to Send Verification Email',
      description: errorMessage,
      icon: 'i-lucide-mail-x',
      color: 'error'
    })
  }
}

const handlePasswordUpdate = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
  try {
    // Implement password update logic with better-auth
    console.log('Updating password')
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('Password update error:', error)
  }
}

const handleTwoFactorToggled = async (enabled: boolean) => {
  try {
    console.log(`${enabled ? 'Enabling' : 'Disabling'} 2FA`)
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    twoFactorEnabled.value = enabled
  } catch (error) {
    console.error('2FA toggle error:', error)
  }
}

const handleTwoFactorSetup = async () => {
  try {
    // Mock 2FA setup - in real implementation, this would show QR code, etc.
    console.log('Setting up 2FA')
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    twoFactorEnabled.value = true
  } catch (error) {
    console.error('2FA setup error:', error)
  }
}

const handleRecoveryCodesDownloaded = () => {
  console.log('Recovery codes downloaded')
}

const handleConnectionToggled = async (account: any) => {
  try {
    if (account.connected) {
      // Implement disconnect logic
      console.log(`Disconnecting ${account.provider}`)
      account.connected = false
      account.username = null
    } else {
      // Implement connect logic
      console.log(`Connecting ${account.provider}`)
      // This would redirect to OAuth flow in real implementation
      account.connected = true
      account.username = 'user123'
    }
  } catch (error) {
    console.error(`${account.provider} connection error:`, error)
  }
}

const handleAccountDeleted = async () => {
  try {
    // Implement account deletion logic
    console.log('Deleting account')
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Redirect to goodbye page or home
    await navigateTo('/')
  } catch (error) {
    console.error('Account deletion error:', error)
  }
}

useSeoMeta({
  title: 'Account Overview - Neomons',
  description: 'Manage your Neomons account settings, security, and connected services.'
})
</script>
