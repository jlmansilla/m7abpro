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
    <div class="navbar-start">
      <a @click="router.push('/home')" class="btn btn-ghost text-xl">AdWeb Online</a>
    </div>
    <div class="navbar-center">
      <ul class="menu menu-horizontal px-1">
        <li><a @click="router.push('/home')">Cursos</a></li>
        <li><a @click="router.push('/admin')">Administración</a></li>
      </ul>
    </div>
    <div class="navbar-end">
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full bg-base-100 text-primary flex items-center justify-center">
            {{ user?.email?.charAt(0).toUpperCase() }}
          </div>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><a class="text-xs">{{ user?.email }}</a></li>
          <li><a @click="handleLogout">Cerrar Sesión</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
