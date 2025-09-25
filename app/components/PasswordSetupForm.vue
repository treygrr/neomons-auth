<script setup lang="ts">
interface Props {
  mode?: 'register' | 'setup-password' | 'change-password'
  existingUser?: {
    name?: string
    email?: string
  }
  loading?: boolean
}

interface Emits {
  (event: 'submit', data: {
    email: string
    password: string
    name?: string
    currentPassword?: string
  }): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'register',
  loading: false
})

const emit = defineEmits<Emits>()

const form = reactive({
  name: props.existingUser?.name || '',
  email: props.existingUser?.email || '',
  password: '',
  confirmPassword: '',
  currentPassword: '',
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  currentPassword: '',
  general: '',
})

const isSetupMode = computed(() => props.mode === 'setup-password')
const isChangeMode = computed(() => props.mode === 'change-password')
const isRegisterMode = computed(() => props.mode === 'register')

// Validation rules
const passwordMinLength = 8
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/

// Watch for prop changes and prefill email for setup mode
watch(() => props.existingUser, (newUser) => {
  if (newUser) {
    form.name = newUser.name || ''
    // Always prefill email, including for setup-password mode
    if (newUser.email) {
      form.email = newUser.email
    }
  }
}, { immediate: true })

// Clear errors when user starts typing
watch(() => form.password, () => {
  errors.password = ''
  errors.confirmPassword = ''
})

watch(() => form.confirmPassword, () => {
  errors.confirmPassword = ''
})

watch(() => form.email, () => {
  errors.email = ''
  errors.general = ''
})

watch(() => form.name, () => {
  errors.name = ''
})

watch(() => form.currentPassword, () => {
  errors.currentPassword = ''
})

function validateForm(): boolean {
  // Reset errors
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  errors.currentPassword = ''
  errors.general = ''

  let isValid = true

  // Name validation (only for new registrations)
  if (isRegisterMode.value && !form.name.trim()) {
    errors.name = 'Name is required'
    isValid = false
  }

  // Email validation (for new registrations and password setup)
  if (isRegisterMode.value || isSetupMode.value) {
    if (!form.email.trim()) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address'
      isValid = false
    }
  }

  // Current password validation (only for password changes)
  if (isChangeMode.value && !form.currentPassword) {
    errors.currentPassword = 'Current password is required'
    isValid = false
  }

  // Password validation
  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < passwordMinLength) {
    errors.password = `Password must be at least ${passwordMinLength} characters long`
    isValid = false
  } else if (!passwordRegex.test(form.password)) {
    errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    isValid = false
  }

  // Confirm password validation
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

function handleSubmit() {
  if (!validateForm()) {
    return
  }

  emit('submit', {
    email: form.email,
    password: form.password,
    name: isRegisterMode.value ? form.name : undefined,
    currentPassword: isChangeMode.value ? form.currentPassword : undefined,
  })
}

function clearGeneralError() {
  errors.general = ''
}

// Expose method to set general error from parent
defineExpose({
  setError: (message: string) => {
    errors.general = message
  },
  clearErrors: () => {
    errors.name = ''
    errors.email = ''
    errors.password = ''
    errors.confirmPassword = ''
    errors.general = ''
  }
})
</script>

<template>
  <div>
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        {{ isChangeMode ? 'Change Password' : isSetupMode ? 'Set Up Password' : 'Create Account' }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        {{ isChangeMode 
          ? 'Update your account password' 
          : isSetupMode 
            ? 'Add a password to your account for easy sign-in' 
            : 'Sign up to get started' 
        }}
      </p>
    </div>

    <UCard>
      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <!-- General Error Alert -->
        <UAlert
          v-if="errors.general"
          color="error"
          variant="soft"
          :title="errors.general"
          :close-button="{ variant: 'ghost' }"
          @close="clearGeneralError"
        />

        <!-- Name Field (only for new registrations) -->
        <UField 
          v-if="isRegisterMode" 
          label="Name" 
          required
          :error="errors.name"
        >
          <UInput 
            v-model="form.name" 
            type="text" 
            placeholder="Your full name"
            size="lg"
            :disabled="loading"
          />
        </UField>

        <!-- Email Field (for registrations and password setup) -->
        <UField 
          v-if="isRegisterMode || isSetupMode" 
          label="Email" 
          required
          :error="errors.email"
        >
          <UInput 
            v-model="form.email" 
            type="email" 
            :placeholder="isSetupMode ? 'Confirm your email address' : 'your@email.com'"
            size="lg"
            :disabled="loading"
          />
          <template v-if="isSetupMode" #help>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              This email will be used for password authentication. You can change it if needed.
            </p>
          </template>
        </UField>

        <!-- Email Display (for password change mode only) -->
        <div v-if="isChangeMode" class="mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Account Email
          </label>
          <div class="text-lg text-gray-900 dark:text-white font-medium">
            {{ existingUser?.email }}
          </div>
        </div>

        <!-- Current Password Field (only for password changes) -->
        <UField 
          v-if="isChangeMode"
          label="Current Password" 
          required
          :error="errors.currentPassword"
        >
          <UInput 
            v-model="form.currentPassword" 
            type="password" 
            placeholder="Enter your current password"
            size="lg"
            :disabled="loading"
          />
        </UField>

        <!-- Password Field -->
        <UField 
          label="Password" 
          required
          :error="errors.password"
        >
          <UInput 
            v-model="form.password" 
            type="password" 
            placeholder="Create a strong password"
            size="lg"
            :disabled="loading"
          />
        </UField>

        <!-- Confirm Password Field -->
        <UField 
          label="Confirm Password" 
          required
          :error="errors.confirmPassword"
        >
          <UInput 
            v-model="form.confirmPassword" 
            type="password" 
            placeholder="Confirm your password"
            size="lg"
            :disabled="loading"
          />
        </UField>

        <!-- Password Requirements -->
        <div class="text-sm text-gray-600 dark:text-gray-400">
          <p class="font-medium mb-1">Password requirements:</p>
          <ul class="list-disc list-inside space-y-1">
            <li>At least 8 characters long</li>
            <li>Contains uppercase and lowercase letters</li>
            <li>Contains at least one number</li>
          </ul>
        </div>

        <UButton
          type="submit"
          color="primary"
          size="lg"
          :loading="loading"
          :disabled="!form.password || !form.confirmPassword || (isRegisterMode && (!form.email || !form.name)) || (isSetupMode && !form.email)"
          class="mt-4"
        >
          {{ isChangeMode ? 'Update Password' : isSetupMode ? 'Set Password' : 'Create Account' }}
        </UButton>

        <!-- Divider and alternatives (only for registration mode) -->
        <template v-if="isRegisterMode">
          <UDivider label="or" />

          <UButton
            icon="i-simple-icons-github"
            type="button"
            color="neutral"
            variant="outline"
            size="lg"
            :disabled="loading"
            @click="useAuth().signIn.social({ provider: 'github', callbackURL: '/user' })"
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
              :disabled="loading"
            >
              Sign in
            </UButton>
          </div>
        </template>

        <!-- Back to account option for setup/change mode -->
        <div v-if="!isRegisterMode" class="text-center mt-6">
          <UButton 
            variant="link" 
            :padded="false"
            to="/user"
            class="text-sm font-medium"
            :disabled="loading"
          >
            ← Back to Account
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>