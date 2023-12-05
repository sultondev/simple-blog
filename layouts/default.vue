<script lang="ts" setup>
import AppLogo from "~/components/AppLogo.vue";
</script>

<template>
  <div class="default-layout">
    <div class="container mx-auto">
      <header class="flex justify-between py-4">
        <div class="flex items-center gap-4">
          <AppLogo />
          <span class="text-3xl font-medium">
            Blog App
          </span>
        </div>
        <div class="">
          <NuxtLink to="/posts"> Posts </NuxtLink>
        </div>
      </header>

      <slot />
    </div>
  </div>
</template>

<style>
.default-layout {
  @apply min-h-[100svh] bg-primary-bg;
}
</style>
