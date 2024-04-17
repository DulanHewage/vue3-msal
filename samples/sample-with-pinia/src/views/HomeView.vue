<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
const { user } = storeToRefs(useUserStore())
</script>

<template>
  <div v-if="user">
    <h1 class="font-bold text-2xl py-4">Account Data</h1>
    <table class="table">
      <tr v-for="(value, key) in user" :key="key">
        <td class="font-semibold">{{ key }}</td>
        <td>
          <div v-if="typeof value === 'object' && value !== null">
            <table>
              <tr v-for="(subValue, subKey) in value" :key="subKey">
                <td>{{ subKey }}</td>
                <td>{{ subValue }}</td>
              </tr>
            </table>
          </div>
          <div v-else>
            {{ value }}
          </div>
        </td>
      </tr>
    </table>
  </div>
  <div v-else>
    <p>User data is empty.</p>
  </div>
</template>
