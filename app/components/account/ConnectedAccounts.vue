<template>
  <UCard>
    <template #header>
      <h2 class="text-xl font-semibold flex items-center">
        <UIcon name="i-lucide-link-2" class="w-5 h-5 mr-2" />
        Connected Accounts
      </h2>
    </template>

    <div class="space-y-4">
      <div 
        v-for="account in connectedAccounts" 
        :key="account.provider" 
        class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <UIcon 
            :name="account.icon" 
            class="w-6 h-6"
            :class="account.color"
          />
          <div>
            <h4 class="font-medium capitalize">{{ account.provider }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ account.connected ? `Connected as ${account.username}` : 'Not connected' }}
            </p>
          </div>
        </div>
        <UButton 
          :label="account.connected ? 'Disconnect' : 'Connect'" 
          :variant="account.connected ? 'outline' : 'solid'"
          :color="account.connected ? 'error' : 'primary'"
          size="sm"
          @click="toggleConnection(account)"
        />
      </div>

      <div class="text-sm text-gray-600 dark:text-gray-400">
        <UIcon name="i-lucide-info" class="w-4 h-4 inline mr-1" />
        Connect your social accounts to sign in with one click.
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface ConnectedAccount {
  provider: string
  icon: string
  color: string
  connected: boolean
  username: string | null
}

interface Props {
  connectedAccounts: ConnectedAccount[]
}

interface Emits {
  (e: 'connection-toggled', account: ConnectedAccount): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Methods
const toggleConnection = async (account: ConnectedAccount) => {
  try {
    // Emit connection toggle event to parent
    emit('connection-toggled', account)
    
    // Mock delay for demonstration
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // The parent component should handle updating the account state
    console.log(`${account.connected ? 'Disconnecting' : 'Connecting'} ${account.provider}`)
  } catch (error) {
    console.error(`${account.provider} connection error:`, error)
  }
}
</script>