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
      
      <!-- LADO DERECHO: Email + LOGOUT -->
      <div class="flex items-center gap-3">
        <!-- Email del usuario -->
        <span v-if="user" class="text-sm font-medium bg-blue-700 px-3 py-1 rounded">{{ user.email }}</span>
        <span v-else class="text-sm font-medium bg-gray-700 px-3 py-1 rounded">No autenticado</span>
        
        <!-- BOTÓN DE LOGOUT - 100% VISIBLE -->
        <button 
          @click="handleLogout" 
          type="button"
          style="
            background-color: #dc2626;
            color: white;
            font-weight: bold;
            padding: 10px 24px;
            border-radius: 8px;
            border: 2px solid #991b1b;
            cursor: pointer;
            font-size: 16px;
            min-width: 150px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            transition: all 0.2s;
            position: relative;
            z-index: 99999;
          "
          onmouseover="this.style.backgroundColor='#b91c1c'; this.style.transform='scale(1.05)'"
          onmouseout="this.style.backgroundColor='#dc2626'; this.style.transform='scale(1)'"
          onmousedown="this.style.backgroundColor='#991b1b'"
          onmouseup="this.style.backgroundColor='#dc2626'"
        >
          🚪 SALIR / LOGOUT
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
