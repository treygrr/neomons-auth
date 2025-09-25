<script setup lang="ts">
definePageMeta({
  auth: {
    only: 'user',
    redirectGuestTo: '/',
  },
})
</script>

<template>
  <div>
    <h1>This is a secret page, only accessible to authenticated users.</h1>
  </div>
</template>
