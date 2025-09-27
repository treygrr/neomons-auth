<template>
  <UCard class="border-red-200 dark:border-red-700">
    <template #header>
      <h2 class="text-xl font-semibold flex items-center text-red-600 dark:text-red-400">
        <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 mr-2" />
        Danger Zone
      </h2>
    </template>

    <div class="space-y-4">
      <div class="flex items-center justify-between p-4 border border-red-200 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20">
        <div>
          <h4 class="font-medium text-red-800 dark:text-red-200">Delete Account</h4>
          <p class="text-sm text-red-700 dark:text-red-300">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
        </div>
        <UButton 
          label="Delete Account" 
          color="error" 
          variant="outline"
          @click="showDeleteConfirmation = true"
        />
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="showDeleteConfirmation">
      <template #content>
        <div class="p-6">
        <div class="flex items-start space-x-3 mb-4">
          <UIcon name="i-lucide-alert-triangle" class="w-6 h-6 text-red-500 mt-0.5" />
          <div>
            <h3 class="text-lg font-semibold">Delete Account</h3>
            <p class="text-gray-600 dark:text-gray-400 mt-2">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>
          </div>
        </div>
        
        <UFormGroup label="Type 'DELETE' to confirm">
          <UInput 
            v-model="deleteConfirmation" 
            placeholder="DELETE"
          />
        </UFormGroup>
        
        <div class="flex justify-end space-x-3 mt-6">
          <UButton 
            label="Cancel" 
            variant="outline" 
            @click="showDeleteConfirmation = false"
          />
          <UButton 
            label="Delete Account" 
            color="error"
            :disabled="deleteConfirmation !== 'DELETE'"
            @click="deleteAccount"
            :loading="accountDeleting"
          />
        </div>
      </div>
      </template>
    </UModal>
  </UCard>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'account-deleted'): void
}

const emit = defineEmits<Emits>()

// Reactive data
const showDeleteConfirmation = ref(false)
const deleteConfirmation = ref('')
const accountDeleting = ref(false)

// Methods
const deleteAccount = async () => {
  accountDeleting.value = true
  try {
    // Emit account deletion event to parent
    emit('account-deleted')
    
    // Mock delay for demonstration
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // The parent should handle the actual deletion and redirect
  } catch (error) {
    console.error('Account deletion error:', error)
  } finally {
    accountDeleting.value = false
    showDeleteConfirmation.value = false
  }
}

// Reset confirmation when modal closes
watch(showDeleteConfirmation, (newValue) => {
  if (!newValue) {
    deleteConfirmation.value = ''
  }
})
</script>