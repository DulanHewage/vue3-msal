<script setup lang="ts">
import { useIsAuthenticated, useMsal } from 'vue3-msal-plugin'

const { instance, accounts, inProgress, loginRequest } = useMsal()

console.log('instance', instance)
console.log('accounts', accounts.value)
console.log('inProgress', inProgress.value)

const isAuthenticated = useIsAuthenticated()

const loginPopup = () => {
  instance.loginPopup(loginRequest)
}

const loginRedirect = () => {
  instance.loginRedirect(loginRequest)
}

const logoutPopup = () => {
  instance.logoutPopup({
    mainWindowRedirectUri: '/'
  })
}

const logoutRedirect = () => {
  instance.logoutRedirect()
}
</script>
<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <a class="btn btn-ghost text-xl">Vue3-Msal</a>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="flex gap-4">
        <li>
          <RouterLink to="/" active-class="border-b-2 border-cyan-600" class="py-1"
            >Home</RouterLink
          >
        </li>
        <li>
          <RouterLink to="/profile" active-class="border-b-2 border-cyan-600" class="py-1"
            >Profile</RouterLink
          >
        </li>
      </ul>
    </div>
    <div class="navbar-end">
      <div v-if="isAuthenticated" class="flex gap-2">
        <button @click="logoutPopup" class="btn btn-primary btn-sm">Logout Popup</button>
        <button @click="logoutRedirect" class="btn btn-primary btn-sm">Logout Redirect</button>
      </div>
      <div v-else class="flex gap-2">
        <button @click="loginPopup" class="btn btn-primary btn-sm">Login Popup</button>
        <button @click="loginRedirect" class="btn btn-primary btn-sm">Login Redirect</button>
      </div>
    </div>
  </div>
</template>
