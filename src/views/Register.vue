<!-- src/views/Register.vue -->
<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const email = ref('')
const password = ref('')
const confirm = ref('')
const loading = ref(false)
const localError = ref('')

const router = useRouter()
const route = useRoute()
const { register, errorMsg } = useAuth()

async function onSubmit() {
  localError.value = ''
  if (password.value !== confirm.value) {
    localError.value = 'Las contraseñas no coinciden.'
    return
  }

  loading.value = true
  try {
    await register(email.value, password.value, { requireVerification: false })
    const redirect = route.query.redirect || { name: 'home' }
    router.push(redirect)
  } catch {
    localError.value = errorMsg.value || 'No se pudo crear la cuenta.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-3xl mb-4 justify-center">Crear Cuenta</h2>
        
        <form @submit.prevent="onSubmit">
          <div class="form-control w-full mb-4">
            <label class="label">
              <span class="label-text">Correo electrónico</span>
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
              <span class="label-text">Contraseña</span>
            </label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="Mínimo 6 caracteres" 
              minlength="6"
              class="input input-bordered w-full" 
              required 
            />
          </div>

          <div class="form-control w-full mb-4">
            <label class="label">
              <span class="label-text">Confirmar contraseña</span>
            </label>
            <input 
              v-model="confirm" 
              type="password" 
              placeholder="Repite la contraseña" 
              minlength="6"
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
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ localError }}</span>
        </div>

        <div class="text-center mt-4">
          <p>
            ¿Ya tienes cuenta? 
            <router-link :to="{ name: 'login' }" class="link link-primary">
              Inicia sesión
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>