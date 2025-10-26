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
  <<div class="navbar bg-gradient-to-r from-blue-600 to-blue-800 text-white fixed top-0 left-0 right-0 z-50 shadow-xl px-6">
  <div class="navbar-start">
    <a class="text-xl font-bold hover:text-blue-200 transition-colors cursor-pointer" @click="router.push('/home')">
      AdWeb Online
    </a>
  </div>
  
  <div class="navbar-center">
    <div class="flex items-center gap-1">
      <a class="px-4 py-2 rounded-lg hover:bg-white/10 transition-all cursor-pointer font-medium" 
         @click="router.push('/home')">
        Cursos
      </a>
      <a class="px-4 py-2 rounded-lg hover:bg-white/10 transition-all cursor-pointer font-medium" 
         @click="router.push('/admin')">
        Administración
      </a>
    </div>
  </div>
  
  <div class="navbar-end">
    <div v-if="authStore.user" class="flex items-center gap-3">
      <span class="font-medium text-blue-100">{{ authStore.user.email }}</span>
      <button @click="handleLogout" 
              class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors">
        Salir
      </button>
    </div>
  </div>
</div>
</template>

<style scoped></style>


