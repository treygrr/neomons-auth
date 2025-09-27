<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div 
      class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border-2"
      :class="{ 
        'border-green-500': user?.emailVerified,
        'border-orange-500': !user?.emailVerified
      }"
    >
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <div :class="[
            'w-10 h-10 rounded-full flex items-center justify-center',
            user?.emailVerified 
              ? 'bg-green-100 dark:bg-green-900/20' 
              : 'bg-orange-100 dark:bg-orange-900/20'
          ]">
            <UIcon 
              :name="user?.emailVerified ? 'i-lucide-check-circle' : 'i-lucide-alert-triangle'"
              :class="[
                'w-5 h-5',
                user?.emailVerified 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-orange-600 dark:text-orange-400'
              ]"
            />
          </div>
        </div>
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400">Account Status</p>
          <p :class="[
            'text-lg font-semibold',
            user?.emailVerified 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-orange-600 dark:text-orange-400'
          ]">
            {{ user?.emailVerified ? 'Verified' : 'Unverified' }}
          </p>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
            <UIcon name="i-lucide-calendar" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
          <p class="text-lg font-semibold">{{ formatDate(user?.createdAt) }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
            <UIcon name="i-lucide-link" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400">Connected Accounts</p>
          <p class="text-lg font-semibold">{{ connectedAccountsCount }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
            <UIcon name="i-lucide-shield" class="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400">2FA Status</p>
          <p class="text-lg font-semibold">{{ twoFactorEnabled ? 'Enabled' : 'Disabled' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  user?: any
  connectedAccountsCount: number
  twoFactorEnabled: boolean
}

const props = withDefaults(defineProps<Props>(), {
  connectedAccountsCount: 0,
  twoFactorEnabled: false
})

// Utility function to format dates
const formatDate = (dateString: string | Date | undefined) => {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>