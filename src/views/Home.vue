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
  unsubscribe = coursesStore.subscribeToCourses()
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <NavBar />

    <main class="pt-24 pb-8">
      <div class="container mx-auto px-4">
        <header class="mb-8">
          <h1 class="text-4xl font-bold text-gray-800">Cursos Disponibles</h1>
        </header>

        <!-- Loading State -->
        <div v-if="coursesStore.loading" class="text-center py-8">
          <span class="loading loading-spinner loading-lg"></span>
          <p class="mt-4 text-gray-600">Cargando cursos...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="coursesStore.activeCourses.length === 0" class="text-center py-16">
          <div class="max-w-md mx-auto">
            <h2 class="text-3xl font-bold text-gray-700">No hay cursos disponibles</h2>
            <p class="mt-4 text-gray-500">Vuelve a intentarlo más tarde.</p>
          </div>
        </div>

        <!-- Courses Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="course in coursesStore.activeCourses" :key="course.id" class="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            <img :src="course.img" :alt="course.nombre" class="w-full h-48 object-cover">
            <div class="p-6">
              <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ course.nombre }}</h2>
              <p class="text-gray-600 mb-4">{{ course.descripcion }}</p>
              
              <div class="flex justify-between items-center mb-4">
                <span class="text-sm font-semibold text-gray-700">{{ course.duracion }}</span>
                <span class="text-2xl font-bold text-primary-500">${{ parseInt(course.precio).toLocaleString() }}</span>
              </div>

              <div class="mb-4">
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Cupos: {{ course.cupos - course.inscritos }} / {{ course.cupos }}</span>
                  <span>{{ Math.round((course.inscritos / course.cupos) * 100) }}%</span>
                </div>
                <progress class="progress progress-primary w-full" :value="course.inscritos" :max="course.cupos"></progress>
              </div>

              <button class="btn btn-primary w-full" @click="enroll(course)">Inscribirse</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Welcome Modal -->
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
