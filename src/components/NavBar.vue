<!-- src/components/NavBar.vue -->
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, logout, isAuthenticated } = useAuth()

// Computed para asegurar reactividad
const hasUser = computed(() => !!user.value)
const userEmail = computed(() => user.value?.email || '')

async function handleLogout() {
  try {
    console.log('🚪 Cerrando sesión...')
    await logout()
    console.log('✅ Sesión cerrada exitosamente')
    router.push('/login')
  } catch (error) {
    console.error('❌ Error al cerrar sesión:', error)
  }
}

// Debug: verificar que el botón esté renderizado
if (hasUser.value) {
  console.log('✅ Botón de cerrar sesión debería estar visible')
} else {
  console.log('⚠️ No hay usuario, botón de login debería estar visible')
}
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
      <div class="flex items-center gap-4">
        <!-- Mostrar email si hay usuario -->
        <span v-if="hasUser" class="text-sm font-medium bg-blue-700 px-3 py-1 rounded">
          {{ userEmail }}
        </span>
        
        <!-- Botón de cerrar sesión - SIEMPRE visible cuando hay usuario -->
        <button 
          v-if="hasUser"
          @click="handleLogout"
          type="button"
          class="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all border-2 border-red-700"
          style="min-width: 140px;"
        >
          🚪 Cerrar Sesión
        </button>
        
        <!-- Botón de login si NO hay usuario -->
        <button 
          v-if="!hasUser"
          @click="router.push('/login')"
          type="button"
          class="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>