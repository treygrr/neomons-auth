<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <!-- Hero Section -->
    <div class="max-w-4xl mx-auto mb-12">
      <div class="mb-8">
        <LogoPro class="w-auto h-16 mx-auto mb-6" />
        <p class="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Your unified authentication service for the entire Neomons ecosystem. 
          One account, endless possibilities.
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-8 mb-12">
        <UCard class="text-center">
          <template #header>
            <UIcon name="i-lucide-shield-check" class="w-12 h-12 mx-auto text-primary-600 dark:text-primary-400" />
          </template>
          <div>
            <h3 class="text-lg font-semibold mb-2">Secure Authentication</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Enterprise-grade security protecting all your Neomons accounts and data.
            </p>
          </div>
        </UCard>

        <UCard class="text-center">
          <template #header>
            <UIcon name="i-lucide-key" class="w-12 h-12 mx-auto text-primary-600 dark:text-primary-400" />
          </template>
          <div>
            <h3 class="text-lg font-semibold mb-2">Single Sign-On</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Access all Neomons applications with just one login. No more password fatigue.
            </p>
          </div>
        </UCard>

        <UCard class="text-center">
          <template #header>
            <UIcon name="i-lucide-users" class="w-12 h-12 mx-auto text-primary-600 dark:text-primary-400" />
          </template>
          <div>
            <h3 class="text-lg font-semibold mb-2">Unified Profile</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Manage your profile once, and it's synchronized across all Neomons services.
            </p>
          </div>
        </UCard>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="w-full max-w-md mx-auto">
      <div v-if="!session?.loggedIn.value" class="space-y-4">
        <UButton 
          label="Sign In" 
          icon="i-lucide-log-in" 
          size="lg" 
          block 
          to="/login"
          class="justify-center"
        />
        <UButton 
          label="Create Account" 
          icon="i-lucide-user-plus" 
          variant="outline" 
          size="lg" 
          block 
          to="/signup"
          class="justify-center"
        />
      </div>
      <div v-else class="space-y-4">
        <UCard>
          <div class="text-center py-4">
            <UIcon name="i-lucide-check-circle" class="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h3 class="text-lg font-semibold mb-2">Welcome back!</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              You're signed in as <strong>{{ session.user.value?.name || session.user.value?.email }}</strong>
            </p>
            <UButton 
              label="Manage Account" 
              icon="i-lucide-settings" 
              to="/account"
              class="mr-2"
            />
            <UButton 
              label="Sign Out" 
              icon="i-lucide-log-out" 
              variant="outline" 
              color="neutral"
              @click="session.signOut({ redirectTo: '/' })"
            />
          </div>
        </UCard>
      </div>
    </div>

    <!-- Info Section -->
    <div class="mt-16 max-w-3xl mx-auto">
      <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8">
        <h2 class="text-2xl font-bold text-center mb-6">Connected Services</h2>
        <p class="text-center text-gray-600 dark:text-gray-400 mb-8">
          Your Neomons account provides access to our growing ecosystem of applications and services.
        </p>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-gamepad-2" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <span class="font-medium">Neomons Game</span>
          </div>
          <div class="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-users" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <span class="font-medium">Community Hub</span>
          </div>
          <div class="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-trophy" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <span class="font-medium">Tournaments</span>
          </div>
          <div class="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-shopping-bag" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <span class="font-medium">Marketplace</span>
          </div>
          <div class="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-bar-chart" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <span class="font-medium">Analytics</span>
          </div>
          <div class="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <UIcon name="i-lucide-plus" class="w-6 h-6 text-gray-400" />
            <span class="text-gray-500">More coming soon...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const session = useAuth()

useSeoMeta({
  title: 'Neomons Authentication - Your Gateway to the Neomons Ecosystem',
  description: 'Secure authentication service for all Neomons applications. One account for games, community, tournaments, and more.',
  ogTitle: 'Neomons Authentication Service',
  ogDescription: 'Your unified gateway to the entire Neomons ecosystem. Secure, simple, and seamless.',
})

</script>