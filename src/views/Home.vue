<!-- src/views/Home.vue -->
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
  // Solo suscribirse a los cursos que ya existen en Firestore
  unsubscribe = coursesStore.subscribeToCourses()
  console.log('📚 Cargando cursos desde Firestore...')
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
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-4xl font-bold">Cursos Disponibles</h1>
        </div>

        <!-- Loading State -->
        <div v-if="coursesStore.loading" class="text-center py-8">
          <span class="loading loading-spinner loading-lg"></span>
          <p class="mt-4">Cargando cursos...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="coursesStore.activeCourses.length === 0" class="text-center">
          <div class="hero bg-base-200">
            <div class="hero-content text-center">
              <div class="max-w-md">
                <h2 class="text-5xl font-bold">No hay cursos</h2>
                <p class="py-6">No hay cursos disponibles en este momento. Vuelve a intentarlo más tarde.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Courses Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="course in coursesStore.activeCourses" :key="course.id" class="card bg-base-100 shadow-xl image-full">
            <figure><img :src="course.img" :alt="course.nombre" /></figure>
            <div class="card-body">
              <h2 class="card-title">{{ course.nombre }}</h2>
              <p>{{ course.descripcion }}</p>
              <div class="card-actions justify-end">
                <button class="btn btn-primary" @click="enroll(course)">Inscribirse</button>
              </div>
              <div class="flex justify-between items-center mb-4">
                <span class="badge badge-info">{{ course.duracion }}</span>
                <span class="text-2xl font-bold">${{ parseInt(course.precio).toLocaleString() }}</span>
              </div>
              <div class="mt-4">
                <div class="flex justify-between text-sm mb-2">
                  <span>Cupos: {{ course.cupos - course.inscritos }} / {{ course.cupos }}</span>
                  <span>{{ Math.round((course.inscritos / course.cupos) * 100) }}%</span>
                </div>
                <progress class="progress progress-success w-full" :value="course.inscritos" :max="course.cupos"></progress>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de bienvenida -->
    <div v-if="authStore.showWelcomeModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">¡Bienvenido a AdWeb Online!</h3>
        <p class="py-4">Has ingresado correctamente al sistema.</p>
        <div class="modal-action">
          <button @click="closeWelcomeModal" class="btn btn-primary">Continuar</button>
        </div>
      </div>
    </div>
  </div>
</template>
