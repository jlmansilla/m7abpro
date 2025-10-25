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
  <nav class="fixed top-0 left-0 right-0 w-full bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg z-50">
    <div class="container mx-auto flex items-center justify-between py-3 px-4 md:px-6">
      <!-- Logo y navegación -->
      <div class="flex items-center space-x-6">
        <button @click="router.push('/home')" class="text-xl font-bold tracking-tight hover:text-blue-200 transition-colors duration-200">
          AdWeb Online
        </button>

        <div class="hidden md:flex space-x-5">
          <button @click="router.push('/home')" class="font-medium hover:text-blue-200 transition-colors duration-200">
            Cursos
          </button>
          <button @click="router.push('/admin')" class="font-medium hover:text-blue-200 transition-colors duration-200">
            Administración
          </button>
        </div>
      </div>

      <!-- Usuario y logout -->
      <div class="flex items-center space-x-3 md:space-x-4">
        <div class="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium">
          {{ user?.email }}
        </div>
        <button
          @click="handleLogout"
          class="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02]"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Opcional: asegura que el contenido no se esconda bajo el navbar */
body {
  padding-top: 64px; /* Ajusta según la altura del navbar */
}
</style>