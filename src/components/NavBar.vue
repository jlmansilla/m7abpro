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
      <div class="flex gap-2 ml-4">
        <a @click="router.push('/home')" class="btn btn-ghost btn-sm">Cursos</a>
        <a @click="router.push('/admin')" class="btn btn-ghost btn-sm">Administración</a>
      </div>
    </div>
    <div class="flex-none gap-2">
      <span class="text-sm">{{ user?.email }}</span>
      <button @click="handleLogout" class="btn btn-ghost btn-sm" title="Cerrar sesión">
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>

<style scoped></style>
