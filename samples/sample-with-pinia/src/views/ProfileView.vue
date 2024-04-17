<script setup lang="ts">
import { useIsAuthenticated } from 'vue3-msal-plugin'
import MyProfile from '@/components/MyProfile.vue'
const isAuthenticated = useIsAuthenticated()
</script>

<template>
  <div>
    <div v-if="isAuthenticated">
      <MyProfile />
    </div>
    <div v-else>
      <p>User is logged out.</p>
    </div>
  </div>
</template>
