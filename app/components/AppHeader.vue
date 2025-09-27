<script setup lang="ts">
const route = useRoute()
const session = useAuth()
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <LogoPro class="w-auto h-6 shrink-0" />
      </NuxtLink>
      <!-- <TemplateMenu /> -->
    </template>


    <template #right>
      <ColorModePallet />
      <UButton v-if="!session?.loggedIn.value" icon="i-lucide-log-in" color="neutral" variant="ghost" to="/login" class="lg:hidden" />
      <UButton v-else icon="i-lucide-log-out" color="neutral" variant="ghost" @click="session.signOut({ redirectTo: '/' })" class="lg:hidden" />
      <UButton v-if="!session?.loggedIn.value" label="Sign in" color="neutral" variant="outline" to="/login"
        class="hidden lg:inline-flex" />

      <UButton v-else label="Sign out" color="neutral" variant="outline" class="hidden lg:inline-flex"
        @click="session.signOut({ redirectTo: '/' })" />

      <UButton v-if="!session?.user.value" label="Sign up" color="neutral" trailing-icon="i-lucide-arrow-right"
        class="hidden lg:inline-flex" to="/signup" />
    </template>

    <template #body>
      <UButton label="Sign in" color="neutral" variant="subtle" to="/login" block class="mb-3" />
      <UButton label="Sign up" color="neutral" to="/signup" block />
    </template>
  </UHeader>
</template>