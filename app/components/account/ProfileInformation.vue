<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold flex items-center">
          <UIcon name="i-lucide-user" class="w-5 h-5 mr-2" />
          Profile Information
        </h2>
        <UButton 
          variant="ghost" 
          size="sm" 
          icon="i-lucide-edit-2"
          @click="editingProfile = !editingProfile"
        />
      </div>
    </template>

    <div class="space-y-6">
      <!-- Avatar Section -->
      <div class="flex items-center space-x-4">
        <UAvatar 
          :src="user?.image || undefined" 
          :alt="user?.name || user?.email || 'User'"
          size="xl"
          :fallback="user ? getInitials(user.name || user.email) : 'U'"
        />
        <div>
          <h3 class="text-lg font-medium">{{ user?.name || 'No name set' }}</h3>
          <p class="text-gray-600 dark:text-gray-400">@{{ username || 'No username set' }}</p>
        </div>
      </div>

      <!-- Profile Form -->
      <div v-if="editingProfile" class="space-y-4">
        <UFormGroup label="Full Name">
          <UInput 
            v-model="profileForm.name" 
            placeholder="Enter your full name"
          />
        </UFormGroup>
        <UFormGroup label="Username">
          <UInput 
            v-model="profileForm.username" 
            placeholder="Enter your username"
          />
        </UFormGroup>
        <div class="flex space-x-2">
          <UButton 
            label="Save Changes" 
            @click="saveProfile"
            :loading="profileSaving"
          />
          <UButton 
            label="Cancel" 
            variant="outline" 
            @click="cancelProfileEdit"
          />
        </div>
      </div>

      <!-- Display Mode -->
      <div v-else class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <p class="text-gray-900 dark:text-white">{{ user?.name || 'Not set' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <p class="text-gray-900 dark:text-white">{{ username || 'Not set' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <div class="flex items-center space-x-2">
            <p class="text-gray-900 dark:text-white">{{ user?.email }}</p>
            <UBadge 
              v-if="user?.emailVerified" 
              label="Verified" 
              color="success" 
              size="xs"
            />
            <UBadge 
              v-else-if="user" 
              label="Unverified" 
              color="warning" 
              size="xs"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Account ID
          </label>
          <p class="text-gray-500 dark:text-gray-400 font-mono text-sm">{{ user?.id }}</p>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  user?: any
  username?: string
}

interface Emits {
  (e: 'profile-updated', data: { name: string; username: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Reactive data
const editingProfile = ref(false)
const profileSaving = ref(false)

// Form state
const profileForm = ref({
  name: '',
  username: ''
})

// Methods
const getInitials = (name: string) => {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const saveProfile = async () => {
  profileSaving.value = true
  try {
    // Emit the profile update event to parent
    emit('profile-updated', profileForm.value)
    
    // Mock delay for demonstration
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    editingProfile.value = false
  } catch (error) {
    console.error('Profile update error:', error)
  } finally {
    profileSaving.value = false
  }
}

const cancelProfileEdit = () => {
  editingProfile.value = false
  profileForm.value = {
    name: props.user?.name || '',
    username: props.username || ''
  }
}

// Initialize form data when user changes
watch(() => props.user, (newUser) => {
  if (newUser) {
    profileForm.value = {
      name: newUser.name || '',
      username: props.username || ''
    }
  }
}, { immediate: true })
</script>