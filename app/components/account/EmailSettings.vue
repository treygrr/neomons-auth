<template>
  <UCard>
    <template #header>
      <h2 class="text-xl font-semibold flex items-center">
        <UIcon name="i-lucide-mail" class="w-5 h-5 mr-2" />
        Email Settings
      </h2>
    </template>

    <div class="space-y-4">
      <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="font-medium">Current Email</span>
          <UBadge 
            :label="user?.emailVerified ? 'Verified' : 'Pending Verification'" 
            :color="user?.emailVerified ? 'success' : 'warning'"
          />
        </div>
        <p class="text-gray-600 dark:text-gray-400">{{ user?.email }}</p>
      </div>

      <div v-if="user && !user.emailVerified" class="border border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
        <div class="flex items-start">
          <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
          <div>
            <h4 class="font-medium text-yellow-800 dark:text-yellow-200">Email Verification Required</h4>
            <p class="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
              Please verify your email address to secure your account.
            </p>
            <UButton 
              label="Resend Verification Email" 
              size="xs" 
              color="warning"
              class="mt-2"
              @click="resendVerificationEmail"
              :loading="verificationSending"
            />
          </div>
        </div>
      </div>

      <UFormField label="Update Email Address">
        <div class="space-y-3">
          <UInput 
            v-model="emailForm.newEmail" 
            type="email"
            placeholder="Enter new email address"
          />
          <UInput 
            v-model="emailForm.password" 
            type="password"
            placeholder="Current password for verification"
          />
          <UButton 
            label="Update Email" 
            @click="updateEmail"
            :loading="emailUpdating"
            :disabled="!emailForm.newEmail || !emailForm.password"
          />
        </div>
      </UFormField>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  user?: any
}

interface Emits {
  (e: 'email-updated', data: { newEmail: string; password: string }): void
  (e: 'verification-resent'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Reactive data
const emailUpdating = ref(false)
const verificationSending = ref(false)

// Form state
const emailForm = ref({
  newEmail: '',
  password: ''
})

// Methods
const updateEmail = async () => {
  emailUpdating.value = true
  try {
    // Emit email update event to parent
    emit('email-updated', emailForm.value)
    
    // Mock delay for demonstration
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Reset form
    emailForm.value = { newEmail: '', password: '' }
  } catch (error) {
    console.error('Email update error:', error)
  } finally {
    emailUpdating.value = false
  }
}

const resendVerificationEmail = async () => {
  verificationSending.value = true
  try {
    // Emit verification resend event to parent
    emit('verification-resent')
    
    // Mock delay for demonstration
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('Verification email error:', error)
  } finally {
    verificationSending.value = false
  }
}
</script>