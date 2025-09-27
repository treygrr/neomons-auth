<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  middleware: async (to, _from) => {
    const session = await useAuth().loggedIn
    if (!session.value) {
      if (to.path === '/dashboard') {
        return navigateTo('/')
      }
    }
  }
})

useSeoMeta({
  title: 'Login',
  description: 'Login to your account to continue'
})

const toast = useToast()

const fields = [
  {
    name: 'email',
    type: 'text' as const,
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
  },
  {
    name: 'password',
    label: 'Password',
    required: true,
    type: 'password' as const,
    placeholder: 'Enter your password'
  },
  {
    name: 'remember',
    label: 'Remember me',
    type: 'checkbox' as const
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
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
  console.log('Submitted', payload)
}
</script>

<template>
  <div class="flex justify-center pb-12">
    <UPageCard class="max-w-96">
      <UAuthForm :fields="fields" :schema="schema" :providers="providers" title="Welcome back" icon="i-lucide-lock"@submit="onSubmit">
        <template #description>
          Don't have an account?
          <ULink to="/signup" class="text-primary font-medium">
            Sign up
          </ULink>.
        </template>

        <template #password-hint>
          <ULink to="/" class="text-primary font-medium" tabindex="-1">
            Forgot password?
          </ULink>
        </template>

        <template #footer>
          <USeparator class="my-4" />
          By signing in, you agree to our
          <ULink to="/" class="text-primary font-medium">
            Terms of Service
          </ULink>.
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
