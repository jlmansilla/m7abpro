<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCoursesStore } from '@/stores/courses'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const authStore = useAuthStore()
const coursesStore = useCoursesStore()

let unsubscribe = null

function closeWelcomeModal() {
  authStore.showWelcomeModal = false
}

async function enroll(course) {
  if (course.cupos - course.inscritos > 0) {
    await coursesStore.updateCourse(course.id, { inscritos: course.inscritos + 1 })
  } else {
    alert('No hay cupos disponibles para este curso.')
  }
}

onMounted(async () => {
  unsubscribe = coursesStore.subscribeToCourses()
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <NavBar />

    <div class="pt-24 pb-8">
      <div class="container mx-auto px-4">
        <div class="mb-8">
          <h1 class="text-3xl font-bold">Cursos Disponibles</h1>
        </div>

        <div v-if="coursesStore.loading" class="text-center py-8">
          <span class="loading loading-spinner loading-lg"></span>
        </div>

        <div v-else-if="coursesStore.activeCourses.length === 0" class="text-center">
          <p>No hay cursos disponibles</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="course in coursesStore.activeCourses" :key="course.id" class="card bg-base-100 shadow-xl">
            <figure><img :src="course.img" :alt="course.nombre" /></figure>
            <div class="card-body">
              <h2 class="card-title">{{ course.nombre }}</h2>
              <p>{{ course.descripcion }}</p>
              <div class="card-actions justify-end">
                <button class="btn btn-primary" @click="enroll(course)">Inscribirse</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="authStore.showWelcomeModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">¡Bienvenido!</h3>
        <p class="py-4">Has ingresado correctamente.</p>
        <div class="modal-action">
          <button @click="closeWelcomeModal" class="btn btn-primary">Continuar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>