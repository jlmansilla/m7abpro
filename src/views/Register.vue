<!-- src/views/Register.vue -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const loading = ref(false)
const localError = ref('')

const router = useRouter()
const authStore = useAuthStore()

async function onSubmit() {
  localError.value = ''
  loading.value = true
  try {
    await authStore.register(email.value, password.value)
    router.push({ name: 'home' })
  } catch {
    localError.value = authStore.errorMsg || 'No se pudo registrar.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-elegant bg-opacity-10 relative overflow-hidden">
    <!-- Decorative background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-gradient-end/5 rounded-full blur-3xl"></div>
    </div>
    
    <div class="card w-full max-w-md bg-base-100/95 backdrop-blur-xl shadow-elegant-lg border border-base-300 z-10 animate-fade-in">
      <div class="card-body p-8">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-gradient-to-r from-primary to-primary-gradient-end rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-gradient">Crear Cuenta</h2>
          <p class="text-gray-500 text-sm mt-2">Crea una nueva cuenta</p>
        </div>
        
        <form @submit.prevent="onSubmit">
          <div class="form-control w-full mb-4">
            <label class="label">
              <span class="label-text font-semibold">Correo electrónico</span>
            </label>
            <input 
              v-model="email" 
              type="email" 
              placeholder="email@ejemplo.com" 
              class="input input-bordered w-full input-elegant" 
              required 
            />
          </div>

          <div class="form-control w-full mb-6">
            <label class="label">
              <span class="label-text font-semibold">Contraseña</span>
            </label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="••••••••" 
              class="input input-bordered w-full input-elegant" 
              required 
            />
          </div>

          <button 
            :disabled="loading" 
            type="submit"
            class="btn btn-primary w-full btn-gradient shadow-elegant hover:shadow-elegant-lg transition-all duration-300 hover:scale-105"
          >
            <span v-if="!loading">Crear Cuenta</span>
            <span v-else class="loading loading-spinner"></span>
          </button>
        </form>

        <div v-if="localError" class="alert alert-error mt-4 shadow-elegant animate-slide-up">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ localError }}</span>
        </div>

        <div class="text-center mt-6 pt-6 border-t border-base-300">
          <p class="text-gray-600">
            ¿Ya tienes cuenta? 
            <router-link :to="{ name:'login' }" class="link link-primary font-semibold hover:text-primary-gradient-end transition-colors">
              Iniciar sesión
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
