<script setup lang="ts">
const route = useRoute()
const session = useAuth()
const items = computed(() => [
  {
    label: 'Home',
    to: '/',
  }
])
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <LogoPro class="w-auto h-6 shrink-0" />
      </NuxtLink>
      <!-- <TemplateMenu /> -->
    </template>

    <UNavigationMenu :items="items" variant="link" />

    <template #right>
      <ColorModePallet />
      <UButton icon="i-lucide-log-in" color="neutral" variant="ghost" to="/login" class="lg:hidden" />

      <UButton v-if="!session?.loggedIn.value" label="Sign in" color="neutral" variant="outline" to="/login"
        class="hidden lg:inline-flex" />

      <UButton v-else label="Sign out" color="neutral" variant="outline"
        @click="session.signOut({ redirectTo: '/' })" />

      <UButton v-if="!session?.user.value" label="Sign up" color="neutral" trailing-icon="i-lucide-arrow-right"
        class="hidden lg:inline-flex" to="/signup" />
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />

      <USeparator class="my-6" />

      <UButton label="Sign in" color="neutral" variant="subtle" to="/login" block class="mb-3" />
      <UButton label="Sign up" color="neutral" to="/signup" block />
    </template>
  </UHeader>
</template>