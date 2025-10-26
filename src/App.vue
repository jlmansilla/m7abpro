<script setup>
import { useAuthStore } from '@/stores/auth'
import { watchEffect } from 'vue'
import { agregarCursos } from '@/data/iniciales'

const authStore = useAuthStore()

watchEffect(async () => {
  if (authStore.user) {
    await agregarCursos()
  }
})
</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>
