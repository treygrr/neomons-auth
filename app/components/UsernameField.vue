<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  label?: string
  required?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter your username',
  label: 'Username',
  required: true
})

const emit = defineEmits<Emits>()

const username = computed({
  get: () => props.modelValue,
  set: (value) => {
    // Convert to lowercase automatically
    const lowerValue = value.toLowerCase()
    emit('update:modelValue', lowerValue)
  }
})

const { isChecking, result, error, checkUsername } = useUsernameCheck()

// Watch for username changes and trigger check
watch(username, (newUsername) => {
  checkUsername(newUsername)
}, { immediate: true })

// Determine input color based on check result
const inputColor = computed(() => {
  if (error.value) return 'error'
  if (!result.value && username.value.length === 0) return 'neutral'
  if (!result.value && username.value.length > 0 && username.value.length < 3) return 'warning'
  if (result.value?.available) return 'success'
  if (result.value && !result.value.available) return 'error'
  return 'neutral'
})

// Status message to show
const statusMessage = computed(() => {
  if (error.value) return error.value
  if (isChecking.value) return 'Checking availability...'
  if (result.value) return result.value.message
  return ''
})

// Show status message
const showStatus = computed(() => {
  return username.value.length > 0 && (isChecking.value || result.value || error.value)
})
</script>

<template>
  <div class="space-y-2">
    <UFormField :label="label" :required="required" name="username">
      <UInput
        v-model="username"
        :placeholder="placeholder"
        :color="inputColor"
        :aria-invalid="result && !result.available"
        aria-describedby="username-status"
        :ui="{ trailing: 'pe-1' }"
        class="w-full"
      >
        <template #trailing>
          <div class="flex items-center">
            <UIcon 
              v-if="isChecking" 
              name="i-lucide-loader-2" 
              class="size-4 animate-spin text-muted-foreground" 
            />
            <UIcon 
              v-else-if="result?.available" 
              name="i-lucide-circle-check" 
              class="size-4 text-success" 
            />
            <UIcon 
              v-else-if="result && !result.available" 
              name="i-lucide-circle-x" 
              class="size-4 text-error" 
            />
            <UIcon 
              v-else-if="error" 
              name="i-lucide-alert-circle" 
              class="size-4 text-error" 
            />
          </div>
        </template>
      </UInput>
    </UFormField>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 transform translate-y-[-4px]"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform translate-y-[-4px]"
    >
      <p 
        v-if="showStatus"
        id="username-status" 
        class="text-sm"
        :class="{
          'text-success': result?.available,
          'text-error': (result && !result.available) || error,
          'text-muted-foreground': isChecking
        }"
      >
        {{ statusMessage }}
      </p>
    </Transition>
  </div>
</template>