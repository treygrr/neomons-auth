<script setup lang="ts">
interface Props {
  currentEmail?: string
  loading?: boolean
}

interface Emits {
  (event: 'submit', data: {
    email: string
  }): void
  (event: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

const form = reactive({
  email: props.currentEmail || '',
})

const errors = reactive({
  email: '',
  general: '',
})

const isEditing = ref(false)

// Watch for prop changes
watch(() => props.currentEmail, (newEmail) => {
  form.email = newEmail || ''
})

// Clear errors when user starts typing
watch(() => form.email, () => {
  errors.email = ''
  errors.general = ''
})

function validateForm(): boolean {
  errors.email = ''
  errors.general = ''

  let isValid = true

  // Email validation
  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  } else if (form.email === props.currentEmail) {
    errors.email = 'New email must be different from current email'
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
  })
}

function startEditing() {
  isEditing.value = true
  form.email = props.currentEmail || ''
}

function cancelEditing() {
  isEditing.value = false
  form.email = props.currentEmail || ''
  errors.email = ''
  errors.general = ''
  emit('cancel')
}

// Expose method to set general error from parent
defineExpose({
  setError: (message: string) => {
    errors.general = message
  },
  clearErrors: () => {
    errors.email = ''
    errors.general = ''
  },
  stopEditing: () => {
    isEditing.value = false
  }
})
</script>

<template>
  <div class="space-y-4">
    <!-- Display Mode -->
    <div v-if="!isEditing" class="flex items-center justify-between">
      <div>
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
        <dd class="text-sm text-gray-900 dark:text-white">{{ currentEmail || 'Not set' }}</dd>
      </div>
      <UButton
        variant="ghost"
        size="sm"
        icon="i-heroicons-pencil"
        :disabled="loading"
        @click="startEditing"
      >
        Edit
      </UButton>
    </div>

    <!-- Edit Mode -->
    <div v-else class="space-y-4">
      <div class="text-sm">
        <p class="font-medium text-gray-700 dark:text-gray-300 mb-2">Update Email Address</p>
        <p class="text-gray-500 dark:text-gray-400">
          Enter your new email address. You may need to verify the new email depending on your account settings.
        </p>
      </div>

      <!-- General Error Alert -->
      <UAlert
        v-if="errors.general"
        color="error"
        variant="soft"
        :title="errors.general"
        :close-button="{ variant: 'ghost' }"
        @close="errors.general = ''"
      />

      <form @submit.prevent="handleSubmit">
        <UField 
          label="New Email Address" 
          required
          :error="errors.email"
        >
          <UInput 
            v-model="form.email" 
            type="email" 
            placeholder="your@newemail.com"
            size="lg"
            :disabled="loading"
          />
        </UField>

        <div class="flex items-center gap-3 mt-4">
          <UButton
            type="submit"
            color="primary"
            size="sm"
            :loading="loading"
            :disabled="!form.email || form.email === currentEmail"
          >
            Update Email
          </UButton>
          <UButton
            type="button"
            variant="ghost"
            size="sm"
            :disabled="loading"
            @click="cancelEditing"
          >
            Cancel
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>