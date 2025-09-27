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

const fields = [
  {
    name: 'name',
    type: 'text' as const,
    label: 'Name',
    placeholder: 'Enter your name'
  },
  {
    name: 'email',
    type: 'text' as const,
    label: 'Email',
    placeholder: 'Enter your email'
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password' as const,
    placeholder: 'Enter your password'
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password' as const,
    placeholder: 'Confirm your password'
  }
]

const providers = [
  {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    onClick: () => {
      useAuth().signIn.social({ provider: 'github', callbackURL: '/' })
    }
  }
]

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Must be at least 8 characters'),
  image: z.string().optional()
})

type Schema = z.output<typeof schema>

function validateFormData(payload: FormSubmitEvent<Schema>) {
  if (payload.data.password !== payload.data.confirmPassword) {
    toast.add({ title: 'Error', description: 'Passwords do not match', color: 'error' })
    return false
  }
  return true
}

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  if (!validateFormData(payload)) {
    return
  }
  await useAuth().signUp.email({
    email: payload.data.email,
    password: payload.data.password,
    name: payload.data.name,
    image: payload.data.image,
    fetchOptions: {
      onSuccess: () => {
        navigateTo('/dashboard')
      },
      onError: (error) => {
        toast.add({ title: 'Error', description: error.error.message, color: 'error' })
      }
    }
  })
}
</script>

<template>
  <div class="flex justify-center">
    <UPageCard>
      <UAuthForm :fields="fields" :schema="schema" :providers="providers" title="Create an account"
        :submit="{ label: 'Create account' }" @submit="onSubmit">
        <template #description>
          Already have an account? <ULink to="/login" class="text-primary font-medium">Login</ULink>.
        </template>

        <template #footer>
          By signing up, you agree to our <ULink to="/" class="text-primary font-medium">Terms of Service</ULink>.
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>