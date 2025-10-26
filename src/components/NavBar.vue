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
  <div class="navbar bg-neutral text-neutral-content fixed top-0 left-0 right-0 z-50 shadow-lg">
    <div class="navbar-start">
      <a class="btn btn-ghost normal-case text-xl" @click="router.push('/home')">AdWeb Online</a>
    </div>
    <div class="navbar-center">
      <div class="flex gap-4">
        <a class="btn btn-ghost" @click="router.push('/home')">Cursos</a>
        <a class="btn btn-ghost" @click="router.push('/admin')">Administración</a>
      </div>
    </div>
    <div class="navbar-end">
      <div v-if="authStore.user" class="flex items-center gap-2">
        <span class="font-semibold">{{ authStore.user.email }}</span>
        <button @click="handleLogout" class="btn btn-error btn-sm">
          Salir
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>


