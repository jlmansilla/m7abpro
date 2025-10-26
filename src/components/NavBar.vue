<!-- src/components/NavBar.vue -->
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  try {
    console.log('🚪 Intentando cerrar sesión...')
    await authStore.logout()
    console.log('✅ Sesión cerrada exitosamente')
    router.push('/login')
  } catch (error) {
    console.error('❌ Error al cerrar sesión:', error)
  }
}

onMounted(() => {
  console.log('🔍 NavBar montado - Usuario:', authStore.user)
})
</script>

<template>
  <div class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-800 shadow-xl">
  <div class="container mx-auto px-6">
    <div class="flex items-center justify-between h-16">
      
      <!-- Logo/Marca -->
      <div class="flex-shrink-0">
        <a class="text-xl font-bold text-white hover:text-blue-200 transition-colors cursor-pointer" 
           @click="router.push('/home')">
          AdWeb Online
        </a>
      </div>
      
      <!-- Enlaces de navegación -->
      <div class="flex items-center gap-6">
        <a class="px-6 py-2 text-white rounded-lg hover:bg-white/10 transition-all cursor-pointer font-medium" 
           @click="router.push('/home')">
          Cursos
        </a>
        <a class="px-6 py-2 text-white rounded-lg hover:bg-white/10 transition-all cursor-pointer font-medium" 
           @click="router.push('/admin')">
          Administración
        </a>
      </div>
      
      <!-- Usuario y logout -->
      <div class="flex-shrink-0">
        <div v-if="authStore.user" class="flex items-center gap-4">
          <span class="font-medium text-blue-100 text-sm">{{ authStore.user.email }}</span>
          <button @click="handleLogout" 
                  class="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors text-sm">
            Salir
          </button>
        </div>
      </div>
      
    </div>
  </div>
</div>
</template>

<style scoped></style>


