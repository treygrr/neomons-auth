<script setup lang="ts">
definePageMeta({
  auth: {
    only: 'guest',
    redirectUserTo: '/user',
  },
})

const auth = useAuth()
const toast = useToast()

const form = reactive({
  email: '',
  password: '',
  name: '',
})

const loading = ref(false)

async function signUp() {
  if (loading.value) return
  loading.value = true
  
  const { error } = await auth.signUp.email({
    email: form.email,
    password: form.password,
    name: form.name,
  })
  
  if (error) {
    toast.add({
      title: 'Registration Failed',
      description: error.message,
      color: 'error',
    })
  } else {
    toast.add({
      title: 'Account Created!',
      description: 'You have been signed up successfully.',
      color: 'success',
    })
    await navigateTo('/user')
  }
  
  loading.value = false
}
</script>

<template>
  <div>
    <div class="max-w-md mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Create Account
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Sign up to get started
        </p>
      </div>

      <UCard>
        <form class="flex flex-col gap-4" @submit.prevent="signUp">
          <UField label="Name" required>
            <UInput 
              v-model="form.name" 
              type="text" 
              placeholder="Your full name"
              size="lg"
            />
          </UField>

          <UField label="Email" required>
            <UInput 
              v-model="form.email" 
              type="email" 
              placeholder="your@email.com"
              size="lg"
            />
          </UField>

          <UField label="Password" required>
            <UInput 
              v-model="form.password" 
              type="password" 
              placeholder="Create a password"
              size="lg"
            />
          </UField>

          <UButton
            type="submit"
            color="primary"
            size="lg"
            :loading="loading"
            :disabled="!form.email || !form.password || !form.name"
            class="mt-4"
          >
            Create Account
          </UButton>

          <UDivider label="or" />

          <UButton
            icon="i-simple-icons-github"
            type="button"
            color="neutral"
            variant="outline"
            size="lg"
            @click="auth.signIn.social({ provider: 'github', callbackURL: '/user' })"
          >
            Continue with GitHub
          </UButton>

          <div class="text-center mt-6">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?
            </span>
            <UButton 
              variant="link" 
              :padded="false"
              to="/login"
              class="text-sm font-medium"
            >
              Sign in
            </UButton>
          </div>
        </form>
      </UCard>
    </div>
  </div>
</template>