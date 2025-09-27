<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  middleware: async (to, _from) => {
    if (!useAuth().loggedIn) {
      if (to.path === '/dashboard') {
        return navigateTo('/')
      }
    }
  }
})

useSeoMeta({
  title: 'Sign up',
  description: 'Create an account to get started'
})

const toast = useToast()

const providers = [
  {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    onClick: () => {
      useAuth().signIn.social({ provider: 'github', callbackURL: '/' })
    }
  }
]

// Enhanced password validation to match strength requirements
const schema = z.object({
  name: z.string('Name is required').min(1, 'Name is required'),
  username: z.string('Username is required')
    .transform((val) => val.toLowerCase())
    .refine((val) => val.length >= 3, 'Username must be at least 3 characters')
    .refine((val) => val.length <= 20, 'Username must be no more than 20 characters')
    .refine((val) => /^[a-z0-9_-]+$/.test(val), 'Username can only contain letters, numbers, underscores, and hyphens'),
  email: z.email('Invalid email'),
  password: z.string('Password is required')
    .min(8, 'Must be at least 8 characters')
    .regex(/\d/, 'Must contain at least 1 number')
    .regex(/[a-z]/, 'Must contain at least 1 lowercase letter')
    .regex(/[A-Z]/, 'Must contain at least 1 uppercase letter'),
  confirmPassword: z.string('Confirm Password is required').min(8, 'Must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type Schema = z.output<typeof schema>

const form = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await useAuth().signUp.email({
    email: event.data.email,
    password: event.data.password,
    username: event.data.username.toLowerCase(), // Ensure lowercase
    name: event.data.name,
    fetchOptions: {
      onSuccess: () => {
        navigateTo('/')
      },
      onError: (error) => {
        toast.add({ title: 'Error', description: error.error.message, color: 'error' })
      }
    }
  })
}
</script>

<template>
  <div class="flex justify-center pb-12">
    <UCard class="w-full max-w-96">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-semibold">Create an account</h1>
          <p class="text-sm text-muted-foreground mt-2">
            Already have an account? <ULink to="/login" class="text-primary font-medium">Login</ULink>.
          </p>
        </div>
      </template>

      <UCardContent>
        <!-- Social Providers -->
        <div class="space-y-3 mb-6">
          <UButton v-for="provider in providers" :key="provider.label" :icon="provider.icon" variant="solid"
            class="mt-4" block @click="provider.onClick">
            Continue with {{ provider.label }}
          </UButton>
        </div>

        <USeparator label="OR" class="mb-6" />

        <!-- Form -->
        <UForm :schema="schema" :state="form" @submit="onSubmit" class="space-y-4 w-full">
          <UFormField label="Name" name="name" required>
            <UInput v-model="form.name" placeholder="Enter your name" class="w-full" />
          </UFormField>

          <UsernameField v-model="form.username" />

          <UFormField label="Email" name="email" required>
            <UInput v-model="form.email" type="email" placeholder="Enter your email" class="w-full" />
          </UFormField>

          <PasswordStrengthField v-model="form.password" />

          <UFormField label="Confirm Password" name="confirmPassword" required>
            <UInput v-model="form.confirmPassword" type="password" placeholder="Confirm your password" class="w-full" />
          </UFormField>

          <UButton type="submit" block class="mt-6">
            Create account
          </UButton>
        </UForm>
      </UCardContent>

      <template #footer class="text-center pt-6">
        <p class="text-xs text-muted-foreground">
          By signing up, you agree to our <ULink to="/" class="text-primary font-medium">Terms of Service</ULink>.
        </p>
      </template>
    </UCard>
  </div>
</template>