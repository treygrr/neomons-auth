<script setup lang="ts">
definePageMeta({
  auth: {
    only: 'user',
    redirectGuestTo: '/',
  },
})

// https://better-auth.vercel.app/docs/integrations/nuxt#ssr-usage
const { user, session, client } = useAuth()
const toast = useToast()
const { data: accounts } = await useAsyncData('accounts', () => client.listAccounts())

const error = useRoute().query?.error

onMounted(() => {
  if (error) {
    toast.add({
      color: 'warning',
      title: error as string,
    })
  }
})
</script>

<template>
  <div>
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Page Header -->
      <div class="text-center mb-8 border-none">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white border-none">
          Account Settings
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2 border-none">
          Manage your profile and account preferences
        </p>
      </div>

      <!-- Profile Settings Component -->
      <ProfileSettings 
        :user="user || undefined" 
        :accounts="accounts?.data || []" 
      />

      <!-- Session Information -->
      <UCard>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Current Session
          </h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold mb-3">Session Details</h3>
            <dl class="space-y-2">
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Session ID</dt>
                <dd class="text-sm text-gray-900 dark:text-white font-mono">{{ session?.id }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</dt>
                <dd class="text-sm text-gray-900 dark:text-white">
                  {{ session?.createdAt ? new Date(session.createdAt).toLocaleDateString() : 'Unknown' }}
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Expires At</dt>
                <dd class="text-sm text-gray-900 dark:text-white">
                  {{ session?.expiresAt ? new Date(session.expiresAt).toLocaleDateString() : 'Unknown' }}
                </dd>
              </div>
            </dl>
          </div>
          
          <div class="flex items-center justify-center">
            <UButton
              color="error"
              variant="outline"
              icon="i-heroicons-arrow-right-on-rectangle"
              @click="useAuth().signOut({ redirectTo: '/' })"
            >
              Sign Out
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Debug Information (can be removed in production) -->
      <UCard v-if="true">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Debug Information
            </h2>
            <UBadge color="warning" variant="soft">Development Only</UBadge>
          </div>
        </template>
        
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-semibold mb-2">Raw User Data</h3>
            <pre class="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto">{{ user }}</pre>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-2">Raw Session Data</h3>
            <pre class="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto">{{ session }}</pre>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-2">Raw Accounts Data</h3>
            <pre class="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto">{{ accounts }}</pre>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
