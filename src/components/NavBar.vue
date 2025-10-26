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

onMounted(() => {
  console.log('🔍 NavBar montado - Usuario:', user)
})
</script>

<template>
  <div style="position: fixed; top: 0; left: 0; right: 0; background: #2563eb; color: white; padding: 15px; z-index: 99999; box-shadow: 0 2px 10px rgba(0,0,0,0.2); display: flex; justify-content: space-between; align-items: center;">
    <!-- Izquierda: Logo y enlaces -->
    <div style="display: flex; gap: 20px; align-items: center;">
      <span style="font-size: 20px; font-weight: bold; cursor: pointer;" @click="router.push('/home')">AdWeb Online</span>
      <span style="cursor: pointer; padding: 5px;" @click="router.push('/home')">Cursos</span>
      <span style="cursor: pointer; padding: 5px;" @click="router.push('/admin')">Administración</span>
    </div>
    
    <!-- Derecha: Email y BOTÓN LOGOUT -->
    <div style="display: flex; gap: 10px; align-items: center;">
      <span v-if="user" style="background: #1d4ed8; padding: 5px 12px; border-radius: 5px; font-size: 14px;">{{ user.email }}</span>
      
      <!-- BOTÓN LOGOUT -->
      <button 
        @click="handleLogout" 
        type="button"
        style="
          background: #dc2626;
          color: white;
          border: none;
          padding: 10px 25px;
          border-radius: 6px;
          font-weight: bold;
          font-size: 15px;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          transition: all 0.2s;
          min-width: 130px;
        "
        @mouseover="$event.target.style.background = '#b91c1c'"
        @mouseout="$event.target.style.background = '#dc2626'"
      >
        🚪 SALIR
      </button>
    </div>
  </div>
</template>

<style scoped></style>
