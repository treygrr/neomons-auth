<script setup lang="ts">
interface Props {
  currentName?: string
  loading?: boolean
}

interface Emits {
  (event: 'submit', data: { name: string }): void
  (event: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  currentName: '',
  loading: false
})

const emit = defineEmits<Emits>()

const isEditing = ref(false)
const form = reactive({
  name: props.currentName || ''
})

const error = ref('')

// Watch for prop changes to update form
watch(() => props.currentName, (newName) => {
  if (newName !== undefined) {
    form.name = newName
  }
})

function startEditing() {
  form.name = props.currentName || ''
  error.value = ''
  isEditing.value = true
}

function stopEditing() {
  isEditing.value = false
  form.name = props.currentName || ''
  error.value = ''
}

function setError(message: string) {
  error.value = message
}

function handleSubmit() {
  if (!form.name.trim()) {
    error.value = 'Name is required'
    return
  }

  if (form.name.trim() === props.currentName?.trim()) {
    // No change, just stop editing
    stopEditing()
    return
  }

  emit('submit', { name: form.name.trim() })
}

function handleCancel() {
  stopEditing()
  emit('cancel')
}

// Clear error when user starts typing
watch(() => form.name, () => {
  error.value = ''
})

// Expose methods for parent component
defineExpose({
  startEditing,
  stopEditing,
  setError
})
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex-1">
      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
      
      <!-- Display Mode -->
      <dd v-if="!isEditing" class="text-sm text-gray-900 dark:text-white">
        {{ currentName || 'Not set' }}
      </dd>
      
      <!-- Edit Mode -->
      <div v-else class="mt-1">
        <UField :error="error">
          <UInput 
            v-model="form.name" 
            type="text" 
            placeholder="Enter your name"
            size="sm"
            :disabled="loading"
            @keydown.enter="handleSubmit"
            @keydown.escape="handleCancel"
          />
        </UField>
      </div>
    </div>

    <div class="ml-4 flex items-center gap-2">
      <!-- Edit Button (when not editing) -->
      <UButton
        v-if="!isEditing"
        variant="ghost"
        size="sm"
        icon="i-heroicons-pencil"
        @click="startEditing"
      >
        Edit
      </UButton>

      <!-- Save/Cancel Buttons (when editing) -->
      <template v-else>
        <UButton
          variant="ghost"
          size="sm"
          icon="i-heroicons-x-mark"
          :disabled="loading"
          @click="handleCancel"
        >
          Cancel
        </UButton>
        <UButton
          color="primary"
          size="sm"
          icon="i-heroicons-check"
          :loading="loading"
          @click="handleSubmit"
        >
          Save
        </UButton>
      </template>
    </div>
  </div>
</template>