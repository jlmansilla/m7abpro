<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const scrolled = ref(false)

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
  
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 20
  })
})
</script>

<template>
  <div class="bg-neutral text-neutral-content shadow-lg fixed top-0 left-0 right-0 z-50 w-full h-16 px-8 py-4">
    <div class="flex items-center justify-between w-full h-full">
      <!-- Logo - izquierda -->
      <div>
        <a @click="router.push('/home')" class="text-2xl font-bold cursor-pointer hover:text-primary transition-colors">
          AdWeb Online
        </a>
      </div>
      
      <!-- Enlaces centrales -->
      <div class="flex items-center gap-12">
        <a @click="router.push('/home')" class="text-lg font-medium cursor-pointer hover:text-primary hover:underline underline-offset-8 transition-all nav-link">
          Cursos
        </a>
        <a @click="router.push('/admin')" class="text-lg font-medium cursor-pointer hover:text-primary hover:underline underline-offset-8 transition-all">
          Administración
        </a>
      </div>
      
      <!-- Usuario y logout - derecha -->
      <div v-if="authStore.user" class="flex items-center gap-4 nav-link">
        <span class="text-sm font-medium">{{ authStore.user.email }}</span>
        <button @click="handleLogout" class="btn btn-error btn-sm nav-link">
          Salir
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .nav-link {
    margin: 0 2rem;
  }
</style>