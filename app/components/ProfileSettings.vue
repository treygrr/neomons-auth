<script setup lang="ts">
interface Props {
  user?: {
    id?: string
    name?: string
    email?: string
  }
  accounts?: Array<{
    providerId: string
    [key: string]: any
  }>
}

const props = defineProps<Props>()

const auth = useAuth()
const toast = useToast()

const emailFormRef = ref()
const nameFormRef = ref()
const profileLoading = ref(false)

function hasProvider(provider: string) {
  if (provider === 'credential') {
    // Check if user has email/password authentication
    return props.accounts?.some(account => account.providerId === 'credential' || account.providerId === 'email')
  }
  return props.accounts?.some(account => account.providerId === provider)
}

async function handleEmailUpdate(formData: { email: string }) {
  if (profileLoading.value) return
  profileLoading.value = true

  try {
    // For now, we'll show a message that this feature needs better-auth configuration
    // In a real implementation, you'd use better-auth's email update functionality
    toast.add({
      title: 'Feature Implementation Needed',
      description: 'Email updates require additional Better Auth configuration. Check the documentation for user profile updates.',
      color: 'info',
    })
    
    emailFormRef.value?.stopEditing()
    
    // Placeholder for actual implementation:
    // const { error } = await auth.client.updateEmail({
    //   email: formData.email
    // })
    
  } catch (err) {
    emailFormRef.value?.setError('An unexpected error occurred. Please try again.')
  }
  
  profileLoading.value = false
}

async function handleNameUpdate(formData: { name: string }) {
  if (profileLoading.value) return
  profileLoading.value = true

  try {
    const { error } = await auth.client.updateUser({
      name: formData.name
    })
    
    if (error) {
      nameFormRef.value?.setError(error.message || 'Failed to update name')
    } else {
      toast.add({
        title: 'Name Updated',
        description: 'Your name has been updated successfully.',
        color: 'success',
      })
      
      // Refresh user session to get updated data
      await auth.fetchSession()
      
      nameFormRef.value?.stopEditing()
    }
    
  } catch (err: any) {
    nameFormRef.value?.setError(err.message || 'An unexpected error occurred. Please try again.')
  }
  
  profileLoading.value = false
}

function handleEmailCancel() {
  // Nothing special needed for cancel
}

function handleNameCancel() {
  // Nothing special needed for cancel
}
</script>

<template>
  <div class="space-y-6">
    <!-- Personal Information -->
    <UCard>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Personal Information
        </h3>
      </div>
      
      <div class="space-y-6">
        <!-- Name Update Component -->
        <NameUpdateForm
          ref="nameFormRef"
          :current-name="user?.name"
          :loading="profileLoading"
          @submit="handleNameUpdate"
          @cancel="handleNameCancel"
        />

        <!-- Email Update Component (only show if user has credential authentication) -->
        <EmailUpdateForm
          v-if="hasProvider('credential')"
          ref="emailFormRef"
          :current-email="user?.email"
          :loading="profileLoading"
          @submit="handleEmailUpdate"
          @cancel="handleEmailCancel"
        />

        <!-- Email Display (read-only for OAuth-only users) -->
        <div v-else class="flex items-center justify-between">
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
            <dd class="text-sm text-gray-900 dark:text-white">{{ user?.email || 'Not set' }}</dd>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Managed by your OAuth provider
            </p>
          </div>
          <UButton
            variant="ghost"
            size="sm"
            icon="i-heroicons-lock-closed"
            disabled
          >
            OAuth Managed
          </UButton>
        </div>

        <!-- User ID Display -->
        <div>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</dt>
          <dd class="text-sm text-gray-900 dark:text-white font-mono">{{ user?.id }}</dd>
        </div>
      </div>
    </UCard>

    <!-- Authentication Methods -->
    <UCard>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Authentication Methods
        </h3>
      </div>

      <div class="space-y-4">
        <!-- GitHub Account -->
        <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div class="flex items-center">
            <UIcon name="i-simple-icons-github" class="w-6 h-6 mr-3" />
            <div>
              <p class="font-medium">GitHub</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ hasProvider('github') ? 'Connected' : 'Not connected' }}
              </p>
            </div>
          </div>
          <UButton
            v-if="hasProvider('github')"
            color="success"
            variant="soft"
            icon="i-heroicons-check"
            disabled
          >
            Connected
          </UButton>
          <UButton
            v-else
            color="primary"
            icon="i-heroicons-link"
            @click="auth.client.linkSocial({ provider: 'github' })"
          >
            Connect
          </UButton>
        </div>

        <!-- Email/Password Account -->
        <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div class="flex items-center">
            <UIcon name="i-heroicons-envelope" class="w-6 h-6 mr-3" />
            <div>
              <p class="font-medium">Email & Password</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ hasProvider('credential') ? 'Set up' : 'Not set up' }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <UButton
              v-if="hasProvider('credential')"
              color="success"
              variant="soft"
              icon="i-heroicons-check"
              disabled
            >
              Set Up
            </UButton>
            <UButton
              v-if="hasProvider('credential')"
              color="primary"
              variant="outline"
              size="sm"
              icon="i-heroicons-key"
              to="/setup-password?mode=change"
            >
              Change Password
            </UButton>
            <UButton
              v-if="!hasProvider('credential')"
              color="primary"
              icon="i-heroicons-key"
              to="/setup-password?from=oauth"
            >
              Set Up Password
            </UButton>
          </div>
        </div>
      </div>

      <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div class="flex items-start">
          <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
          <div class="text-sm text-blue-800 dark:text-blue-200">
            <p class="font-medium mb-1">Why set up multiple sign-in methods?</p>
            <p class="mb-2">Having both OAuth and email/password gives you flexibility in how you sign in and ensures you can always access your account.</p>
            <p v-if="!hasProvider('credential')" class="text-xs">
              <strong>Note:</strong> Your email address is currently managed by your OAuth provider. Set up email/password authentication to manage your email address directly.
            </p>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Account Security -->
    <UCard>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Account Security
        </h3>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div class="flex items-center">
            <UIcon name="i-heroicons-shield-check" class="w-6 h-6 mr-3" />
            <div>
              <p class="font-medium">Two-Factor Authentication</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <UButton
            variant="outline"
            disabled
          >
            Coming Soon
          </UButton>
        </div>

        <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div class="flex items-center">
            <UIcon name="i-heroicons-clock" class="w-6 h-6 mr-3" />
            <div>
              <p class="font-medium">Active Sessions</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Manage your active login sessions
              </p>
            </div>
          </div>
          <UButton
            variant="outline"
            disabled
          >
            View Sessions
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>