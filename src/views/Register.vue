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
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="card w-96 bg-white shadow-lg">
      <div class="card-body p-8">
        <h2 class="card-title text-3xl mb-6 justify-center text-gray-800">Crear Cuenta</h2>
        
        <form @submit.prevent="onSubmit">
          <div class="form-control w-full mb-4">
            <label class="label">
              <span class="label-text text-gray-600">Correo electrónico</span>
            </label>
            <input 
              v-model="email" 
              type="email" 
              placeholder="email@ejemplo.com" 
              class="input input-bordered w-full" 
              required 
            />
          </div>

          <div class="form-control w-full mb-4">
            <label class="label">
              <span class="label-text text-gray-600">Contraseña</span>
            </label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="••••••••" 
              class="input input-bordered w-full" 
              required 
            />
          </div>

          <button 
            :disabled="loading" 
            type="submit"
            class="btn btn-primary w-full"
          >
            <span v-if="!loading">Crear Cuenta</span>
            <span v-else class="loading loading-spinner"></span>
          </button>
        </form>

        <div v-if="localError" class="alert alert-error mt-4">
          <span>{{ localError }}</span>
        </div>

        <div class="text-center mt-6">
          <p class="text-sm text-gray-600">
            ¿Ya tienes cuenta? 
            <router-link :to="{ name:'login' }" class="link link-primary">
              Iniciar sesión
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
