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
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50 relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-secondary/5 to-primary/5 rounded-full blur-3xl"></div>
    </div>
    
    <!-- Main Card -->
    <div class="glass w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-elegant-xl border border-white/50 p-8 animate-scale-in z-10">
      <!-- Logo & Header -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-success via-accent to-primary rounded-2xl flex items-center justify-center shadow-lg animate-bounce-subtle">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold gradient-text mb-2">Crea tu cuenta</h2>
        <p class="text-gray-600">Únete a nuestra plataforma educativa</p>
      </div>
      
      <form @submit.prevent="onSubmit">
        <div class="space-y-5">
          <!-- Email Input -->
          <div class="form-control">
            <label class="label mb-2">
              <span class="label-text font-semibold text-gray-700">Correo electrónico</span>
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input 
                v-model="email" 
                type="email" 
                placeholder="email@ejemplo.com" 
                class="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-white" 
                required 
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="form-control">
            <label class="label mb-2">
              <span class="label-text font-semibold text-gray-700">Contraseña</span>
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input 
                v-model="password" 
                type="password" 
                placeholder="••••••••" 
                class="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-white" 
                required 
              />
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          :disabled="loading" 
          type="submit"
          class="btn w-full mt-6 bg-gradient-to-r from-success to-accent text-white border-none shadow-elegant-lg hover:shadow-3d transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100"
        >
          <span v-if="!loading" class="flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Crear Cuenta
          </span>
          <span v-else class="loading loading-spinner"></span>
        </button>
      </form>

      <!-- Error Message -->
      <div v-if="localError" class="alert alert-error mt-6 shadow-elegant animate-slide-up">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ localError }}</span>
      </div>

      <!-- Login Link -->
      <div class="text-center mt-8 pt-6 border-t border-gray-200">
        <p class="text-gray-600 mb-2">¿Ya tienes cuenta?</p>
        <router-link :to="{ name:'login' }" class="font-semibold gradient-text hover:opacity-80 transition-opacity">
          Iniciar sesión
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped></style>