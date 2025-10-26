<script setup>
import { useAuth } from '@/composables/useAuth'
import { watchEffect } from 'vue'
import { agregarCursos } from '@/data/iniciales'

const { user } = useAuth()

watchEffect(async () => {
  if (user.value) {
    await agregarCursos()
  }
})
</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>