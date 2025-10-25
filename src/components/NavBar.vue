<!-- src/components/NavBar.vue -->
<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, logout } = useAuth()

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>

<template>
  <div class="navbar bg-primary text-primary-content">
    <div class="flex-1">
      <a @click="router.push('/home')" class="btn btn-ghost normal-case text-xl cursor-pointer">AdWeb Online</a>
      <ul class="menu menu-horizontal px-1 hidden md:flex">
        <li><a @click="router.push('/home')">Cursos</a></li>
        <li><a @click="router.push('/admin')">Administración</a></li>
      </ul>
    </div>
    <div class="flex-none gap-2">
      <span class="text-sm hidden md:inline">{{ user?.email }}</span>
      <button @click="handleLogout" class="btn btn-ghost btn-sm" title="Cerrar sesión">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>

<style scoped></style>
