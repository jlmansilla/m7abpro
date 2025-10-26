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
  <div class="navbar glass fixed top-0 left-0 right-0 z-50 shadow-elegant backdrop-blur-xl border-b border-base-300">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden text-base-content">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-elegant-lg bg-base-100 rounded-xl w-52 border border-base-300">
          <li><a @click="router.push('/home')" class="hover:bg-primary hover:text-primary-content transition-all duration-300">Cursos</a></li>
          <li><a @click="router.push('/admin')" class="hover:bg-primary hover:text-primary-content transition-all duration-300">Administración</a></li>
        </ul>
      </div>
      <a class="btn btn-ghost normal-case text-xl text-gradient font-bold hover:text-primary-gradient-end transition-all duration-300" @click="router.push('/home')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        AdWeb Online
      </a>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1 gap-2">
        <li><a @click="router.push('/home')" class="hover:bg-primary hover:text-primary-content rounded-xl transition-all duration-300 px-4 py-2 font-medium">Cursos</a></li>
        <li><a @click="router.push('/admin')" class="hover:bg-primary hover:text-primary-content rounded-xl transition-all duration-300 px-4 py-2 font-medium">Administración</a></li>
      </ul>
    </div>
    <div class="navbar-end">
      <div v-if="authStore.user" class="flex items-center gap-4">
        <div class="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-base-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="font-semibold text-sm">{{ authStore.user.email }}</span>
        </div>
        <button @click="handleLogout" class="btn btn-error btn-sm shadow-elegant hover:shadow-elegant-lg transition-all duration-300 hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Salir
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
