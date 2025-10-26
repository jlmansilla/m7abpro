<!-- src/components/NavBar.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const showMobileMenu = ref(false)

async function handleLogout() {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

const getInitials = (email) => {
  if (!email) return ''
  return email.substring(0, 2).toUpperCase()
}
</script>

<template>
  <header class="bg-white shadow-md border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
    <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
      <div class="flex items-center gap-8">
        <h1 class="text-2xl font-bold text-gradient hover:scale-105 transition-transform cursor-pointer" @click="router.push('/home')">AdWeb Online</h1>
        <ul class="hidden md:flex gap-2">
          <li>
            <a 
              class="px-4 py-2 rounded-lg transition-colors hover:bg-blue-50 hover:text-blue-600"
              :class="{ 'bg-blue-50 text-blue-600': router.currentRoute.value.name === 'home' }"
              @click="router.push('/home')"
            >Cursos</a>
          </li>
          <li>
            <a 
              class="px-4 py-2 rounded-lg transition-colors hover:bg-blue-50 hover:text-blue-600"
              :class="{ 'bg-blue-50 text-blue-600': router.currentRoute.value.name === 'admin' }"
              @click="router.push('/admin')"
            >Administración</a>
          </li>
        </ul>
      </div>

      <div class="hidden md:flex items-center gap-4">
        <div v-if="authStore.user" class="flex items-center gap-4">
          <div class="avatar placeholder">
            <div class="bg-gradient-to-r from-blue-500 to-cyan-500 text-neutral-content rounded-full w-10">
              <span>{{ getInitials(authStore.user.email) }}</span>
            </div>
          </div>
          <span class="text-sm font-semibold text-gray-700">{{ authStore.user.email }}</span>
          <button @click="handleLogout" class="btn btn-sm btn-error">Salir</button>
        </div>
      </div>

      <div class="md:hidden">
        <button @click="showMobileMenu = !showMobileMenu" class="btn btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </nav>

    <div v-if="showMobileMenu" class="md:hidden bg-white border-t border-gray-200">
      <ul class="flex flex-col items-center gap-4 p-4">
        <li>
          <a 
            class="px-4 py-2 rounded-lg transition-colors hover:bg-blue-50 hover:text-blue-600"
            :class="{ 'bg-blue-50 text-blue-600': router.currentRoute.value.name === 'home' }"
            @click="router.push('/home'); showMobileMenu = false;"
          >Cursos</a>
        </li>
        <li>
          <a 
            class="px-4 py-2 rounded-lg transition-colors hover:bg-blue-50 hover:text-blue-600"
            :class="{ 'bg-blue-50 text-blue-600': router.currentRoute.value.name === 'admin' }"
            @click="router.push('/admin'); showMobileMenu = false;"
          >Administración</a>
        </li>
        <li v-if="authStore.user">
          <button @click="handleLogout(); showMobileMenu = false;" class="btn btn-sm btn-error">Salir</button>
        </li>
      </ul>
    </div>
  </header>
</template>
