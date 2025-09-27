<template>
  <UCard>
    <template #header>
      <h2 class="text-xl font-semibold flex items-center">
        <UIcon name="i-lucide-lock" class="w-5 h-5 mr-2" />
        Password & Security
      </h2>
    </template>

    <div class="space-y-6">
      <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-medium">Password</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">Last updated: {{ formatDate(user?.updatedAt) }}</p>
          </div>
          <UButton 
            variant="outline" 
            size="sm" 
            label="Change"
            @click="showPasswordForm = !showPasswordForm"
          />
        </div>
      </div>

      <div v-if="showPasswordForm" class="space-y-4">
        <UFormGroup label="Current Password">
          <UInput 
            v-model="passwordForm.currentPassword" 
            type="password"
            placeholder="Enter current password"
          />
        </UFormGroup>
        <UFormGroup label="New Password">
          <UInput 
            v-model="passwordForm.newPassword" 
            type="password"
            placeholder="Enter new password"
          />
        </UFormGroup>
        <UFormGroup label="Confirm New Password">
          <UInput 
            v-model="passwordForm.confirmPassword" 
            type="password"
            placeholder="Confirm new password"
          />
        </UFormGroup>
        
        <!-- Password Strength Indicator -->
        <div v-if="passwordForm.newPassword" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password Strength
          </label>
          <div class="flex space-x-1">
            <div 
              v-for="i in 4" 
              :key="i"
              class="h-2 flex-1 rounded"
              :class="i <= passwordStrength ? passwordStrengthColors[passwordStrength] : 'bg-gray-200 dark:bg-gray-700'"
            />
          </div>
          <p class="text-sm" :class="passwordStrengthTextColors[passwordStrength]">
            {{ passwordStrengthLabels[passwordStrength] }}
          </p>
        </div>

        <div class="flex space-x-2">
          <UButton 
            label="Update Password" 
            @click="updatePassword"
            :loading="passwordUpdating"
            :disabled="!canUpdatePassword"
          />
          <UButton 
            label="Cancel" 
            variant="outline" 
            @click="cancelPasswordChange"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  user?: any
}

interface Emits {
  (e: 'password-updated', data: { currentPassword: string; newPassword: string; confirmPassword: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Reactive data
const showPasswordForm = ref(false)
const passwordUpdating = ref(false)

// Form state
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Password strength constants
const passwordStrengthColors = ['bg-gray-200', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
const passwordStrengthTextColors = ['text-gray-500', 'text-red-500', 'text-yellow-500', 'text-blue-500', 'text-green-500']
const passwordStrengthLabels = ['No password', 'Weak', 'Fair', 'Good', 'Strong']

// Computed properties
const passwordStrength = computed(() => {
  const password = passwordForm.value.newPassword
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 8) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  
  return Math.min(strength, 4)
})

const canUpdatePassword = computed(() => {
  return passwordForm.value.currentPassword && 
         passwordForm.value.newPassword && 
         passwordForm.value.confirmPassword &&
         passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
         passwordForm.value.newPassword !== passwordForm.value.currentPassword
})

// Methods
const formatDate = (dateString: string | Date | undefined) => {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const updatePassword = async () => {
  passwordUpdating.value = true
  try {
    // Emit password update event to parent
    emit('password-updated', passwordForm.value)
    
    // Mock delay for demonstration
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    cancelPasswordChange()
  } catch (error) {
    console.error('Password update error:', error)
  } finally {
    passwordUpdating.value = false
  }
}

const cancelPasswordChange = () => {
  showPasswordForm.value = false
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}
</script>