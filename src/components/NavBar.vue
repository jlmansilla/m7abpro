<!-- src/components/NavBar.vue -->
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

onMounted(() => {
  console.log('NavBar montado - Usuario:', authStore.user)
})
</script>

<template>
  <header class="bg-gray-800 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
    <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
      <div class="flex items-center gap-8">
        <h1 class="text-2xl font-bold cursor-pointer" @click="router.push('/home')">AdWeb Online</h1>
        <ul class="flex gap-6">
          <li><a class="hover:text-primary-400 transition-colors" @click="router.push('/home')">Cursos</a></li>
          <li><a class="hover:text-primary-400 transition-colors" @click="router.push('/admin')">Administración</a></li>
        </ul>
      </div>
      <div v-if="authStore.user" class="flex items-center gap-4">
        <span class="text-sm">{{ authStore.user.email }}</span>
        <button @click="handleLogout" class="btn btn-sm btn-error">Salir</button>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.router-link-active {
  color: #3b82f6; /* primary-400 */
}
</style>