<template>
  <UCard>
    <template #header>
      <h2 class="text-xl font-semibold flex items-center">
        <UIcon name="i-lucide-smartphone" class="w-5 h-5 mr-2" />
        Two-Factor Authentication
      </h2>
    </template>

    <div class="space-y-6">
      <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <div>
          <h4 class="font-medium">2FA Status</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ twoFactorEnabled ? 'Two-factor authentication is enabled' : 'Add an extra layer of security to your account' }}
          </p>
        </div>
        <UToggle 
          v-model="internalTwoFactorEnabled" 
          @change="toggleTwoFactor"
        />
      </div>

      <div v-if="internalTwoFactorEnabled" class="space-y-4">
        <div class="border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div class="flex items-start">
            <UIcon name="i-lucide-shield-check" class="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3" />
            <div>
              <h4 class="font-medium text-green-800 dark:text-green-200">2FA Enabled</h4>
              <p class="text-green-700 dark:text-green-300 text-sm mt-1">
                Your account is protected with two-factor authentication.
              </p>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <h5 class="font-medium">Recovery Codes</h5>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Save these recovery codes in a safe place. You can use them to access your account if you lose your 2FA device.
          </p>
          <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm">
            <div class="grid grid-cols-2 gap-2">
              <div v-for="code in recoveryCodes" :key="code" class="text-center py-1">
                {{ code }}
              </div>
            </div>
          </div>
          <UButton 
            label="Download Recovery Codes" 
            variant="outline" 
            size="sm"
            icon="i-lucide-download"
            @click="downloadRecoveryCodes"
          />
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div class="flex items-start">
            <UIcon name="i-lucide-info" class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
            <div>
              <h4 class="font-medium text-blue-800 dark:text-blue-200">Enable Two-Factor Authentication</h4>
              <p class="text-blue-700 dark:text-blue-300 text-sm mt-1">
                Protect your account with an additional security layer using your phone.
              </p>
            </div>
          </div>
        </div>
        <UButton 
          label="Set Up 2FA" 
          icon="i-lucide-shield"
          @click="setupTwoFactor"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  twoFactorEnabled: boolean
  recoveryCodes?: string[]
}

interface Emits {
  (e: 'two-factor-toggled', enabled: boolean): void
  (e: 'two-factor-setup'): void
  (e: 'recovery-codes-downloaded'): void
}

const props = withDefaults(defineProps<Props>(), {
  twoFactorEnabled: false,
  recoveryCodes: () => [
    'a1b2-c3d4', 'e5f6-g7h8', 'i9j0-k1l2',
    'm3n4-o5p6', 'q7r8-s9t0', 'u1v2-w3x4'
  ]
})

const emit = defineEmits<Emits>()

// Internal state that syncs with prop
const internalTwoFactorEnabled = ref(props.twoFactorEnabled)

// Watch for prop changes
watch(() => props.twoFactorEnabled, (newValue) => {
  internalTwoFactorEnabled.value = newValue
})

// Methods
const toggleTwoFactor = async (enabled: boolean) => {
  try {
    if (enabled) {
      await setupTwoFactor()
    } else {
      // Emit disable event to parent
      emit('two-factor-toggled', enabled)
    }
  } catch (error) {
    console.error('2FA toggle error:', error)
    // Revert on error
    internalTwoFactorEnabled.value = !enabled
  }
}

const setupTwoFactor = async () => {
  try {
    // Emit setup event to parent
    emit('two-factor-setup')
    
    // Mock delay for demonstration
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    internalTwoFactorEnabled.value = true
  } catch (error) {
    console.error('2FA setup error:', error)
  }
}

const downloadRecoveryCodes = () => {
  const text = props.recoveryCodes.join('\n')
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'neomons-recovery-codes.txt'
  a.click()
  URL.revokeObjectURL(url)
  
  // Emit event to parent
  emit('recovery-codes-downloaded')
}
</script>