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
  <nav :class="['fixed top-0 left-0 right-0 z-50 transition-all duration-300', scrolled ? 'bg-base-200 shadow-2xl' : 'bg-base-300 shadow-lg']">
    <div class="w-full px-8 py-5">
      <div class="grid grid-cols-3 items-center gap-4">
        <div>
          <a @click="router.push('/home')" class="text-2xl font-bold cursor-pointer hover:text-primary transition-colors nav-link">
            AdWeb Online
          </a>
        </div>
        
        <div class="flex items-center gap-12 justify-center">
          <a @click="router.push('/home')" class="text-lg font-medium cursor-pointer hover:text-primary hover:underline underline-offset-8 transition-all nav-link">
            Cursos
          </a>
          <a @click="router.push('/admin')" class="text-lg font-medium cursor-pointer hover:text-primary hover:underline underline-offset-8 transition-all nav-link">
            Administración
          </a>
        </div>
        
        <div v-if="authStore.user" class="flex items-center gap-4 justify-end">
          <span class="text-sm font-medium">{{ authStore.user.email }}</span>
          <button @click="handleLogout" class="btn btn-error btn-sm nav-link">
            Salir
          </button>
        </div>
      </div>
    </div>
  </nav>
  
  
</template>

<style scoped>
.nav-link {
  margin: 0 2rem; /* Espaciado horizontal entre enlaces */
}
</style>