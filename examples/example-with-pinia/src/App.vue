<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <header>
    <NavBar />
  </header>

  <main class="flex justify-center">
    <div class="container">
      <RouterView />
    </div>
  </main>
</template>
