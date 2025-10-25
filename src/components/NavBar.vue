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
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full bg-base-100 text-primary flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box z-[1] mt-3 w-52 p-2 shadow">
          <li>
            <a class="justify-between">
              Profile
              <span class="badge">New</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><a @click="handleLogout">Logout</a></li>
        </ul>
      </div>
      <span class="text-sm hidden md:inline">{{ user?.email }}</span>
    </div>
  </div>
</template>

<style scoped></style>
