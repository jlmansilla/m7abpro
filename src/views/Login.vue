<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const loading = ref(false)
const localError = ref('')

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

async function onSubmit() {
  localError.value = ''
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    const redirect = route.query.redirect || { name: 'home' }
    router.push(redirect)
  } catch {
    localError.value = authStore.errorMsg || 'No se pudo iniciar sesión.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 px-4 py-8">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl md:text-3xl mb-4 justify-center">Iniciar Sesión</h2>
        
        <form @submit.prevent="onSubmit">
          <div class="form-control w-full mb-4">
            <label class="label">
              <span class="label-text">Correo electrónico</span>
            </label>
            <input v-model="email" type="email" placeholder="email@ejemplo.com" class="input input-bordered w-full" required />
          </div>

          <div class="form-control w-full mb-4">
            <label class="label">
              <span class="label-text">Contraseña</span>
            </label>
            <input v-model="password" type="password" placeholder="••••••••" class="input input-bordered w-full" required />
          </div>

          <button :disabled="loading" type="submit" class="btn btn-primary w-full">
            <span v-if="!loading">Iniciar Sesión</span>
            <span v-else class="loading loading-spinner"></span>
          </button>
        </form>

        <div v-if="localError" class="alert alert-error mt-4">
          <span>{{ localError }}</span>
        </div>

        <div class="text-center mt-4">
          <p class="text-sm">
            ¿No tienes cuenta? 
            <router-link :to="{ name:'register' }" class="link link-primary">
              Crear cuenta
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>