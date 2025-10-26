<!-- src/components/NavBar.vue -->
<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, logout } = useAuth()

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>

<template>
  <div class="fixed top-0 left-0 right-0 w-full bg-blue-600 text-white shadow-md z-50">
    <div class="container mx-auto flex items-center justify-between py-3 px-4">
      <!-- Logo y enlaces -->
      <div class="flex items-center space-x-6">
        <a @click="router.push('/home')" class="text-xl font-bold cursor-pointer hover:text-blue-200">
          AdWeb Online
        </a>
        <a @click="router.push('/home')" class="cursor-pointer hover:text-blue-200">
          Cursos
        </a>
        <a @click="router.push('/admin')" class="cursor-pointer hover:text-blue-200">
          Administración
        </a>
      </div>
      
      <!-- Usuario y logout -->
      <div v-if="user" class="flex items-center space-x-4">
        <span class="text-sm">{{ user?.email }}</span>
        <button @click="handleLogout" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded cursor-pointer transition-colors">
          Cerrar Sesión
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>