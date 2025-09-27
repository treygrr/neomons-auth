<template>
  <div>
    <AppHeader />

    <UMain>
      <UContainer class="sm:border-x border-default pt-10 min-h-[calc(100vh-var(--ui-header-height))]">
        <slot />
      </UContainer>
    </UMain>

    <AppFooter />
  </div>
</template>