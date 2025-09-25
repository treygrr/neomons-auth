<script setup lang="ts">
definePageMeta({
  auth: {
    only: 'guest',
    redirectUserTo: '/user',
  },
})
</script>

<template>
  <div>
    <div class="max-w-4xl mx-auto text-center">
      <div class="mb-12">
        <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to NeoMons Auth
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
          A modern authentication system built with Better Auth and NuxtHub
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
        <UButton
          to="/login"
          color="primary"
          size="xl"
          icon="i-heroicons-arrow-right-on-rectangle"
        >
          Sign In
        </UButton>
        <UButton
          to="/register"
          color="neutral"
          variant="outline"
          size="xl"
          icon="i-heroicons-user-plus"
        >
          Create Account
        </UButton>
      </div>

      <div class="text-center">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Or continue with
        </p>
        <UButton
          icon="i-simple-icons-github"
          color="neutral"
          variant="outline"
          size="lg"
          @click="useAuth().signIn.social({ provider: 'github', callbackURL: '/user' })"
        >
          GitHub
        </UButton>
      </div>

      <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <UCard>
          <div class="text-center">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-shield-check" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="text-lg font-semibold mb-2">Secure Authentication</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Built with Better Auth for enterprise-grade security and modern authentication flows.
            </p>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-bolt" class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 class="text-lg font-semibold mb-2">Fast & Modern</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Powered by Nuxt 3 and deployed on Cloudflare with NuxtHub for optimal performance.
            </p>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-puzzle-piece" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 class="text-lg font-semibold mb-2">Easy Integration</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Simple setup with social providers, email/password auth, and account linking.
            </p>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
