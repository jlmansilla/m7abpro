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
  <div class="navbar bg-primary text-primary-content fixed top-0 left-0 right-0 z-50 shadow-lg">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><a @click="router.push('/home')">Cursos</a></li>
          <li><a @click="router.push('/admin')">Administración</a></li>
        </ul>
      </div>
      <a class="btn btn-ghost normal-case text-xl" @click="router.push('/home')">AdWeb Online</a>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li><a @click="router.push('/home')">Cursos</a></li>
        <li><a @click="router.push('/admin')">Administración</a></li>
      </ul>
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
