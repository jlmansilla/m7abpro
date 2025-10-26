<!-- src/components/NavBar.vue -->
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, logout } = useAuth()

async function handleLogout() {
  try {
    console.log('🚪 Intentando cerrar sesión...')
    await logout()
    console.log('✅ Sesión cerrada exitosamente')
    router.push('/login')
  } catch (error) {
    console.error('❌ Error al cerrar sesión:', error)
  }
}

// Debug: verificar que el usuario está presente
onMounted(() => {
  console.log('🔍 NavBar montado - Usuario:', user)
})
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 w-full bg-blue-600 text-white shadow-md z-50">
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
      <div v-if="user" class="flex items-center gap-3">
        <span class="text-sm font-medium bg-blue-700 px-3 py-1 rounded">{{ user.email }}</span>
        <button 
          @click="handleLogout" 
          type="button"
          class="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          style="min-width: 120px;"
        >
          🚪 SALIR
        </button>
      </div>
      
      <!-- Botón de login si NO hay usuario -->
      <div v-else>
        <button @click="router.push('/login')" class="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg">
          Iniciar Sesión
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
