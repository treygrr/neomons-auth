<script setup lang="ts">
definePageMeta({
  auth: {
    only: 'guest',
    redirectUserTo: '/user',
  },
})

// Redirect guest users to the login page
await navigateTo('/login')
</script>

<template>
  <div>
    <!-- This page will redirect to /login -->
  </div>
</template>
