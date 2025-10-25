<!-- src/views/Home.vue -->
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, logout } = useAuth()
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Welcome, {{ user.name }}!</h1>
    <p class="mb-4">This is the home page of the application.</p>
    <button
      @click="logout().then(() => router.push('/login'))"
      class="bg-red-500 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  </div>
</template>

<style scoped></style>