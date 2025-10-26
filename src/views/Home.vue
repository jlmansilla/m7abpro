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
  <div class="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
    <NavBar />

    <div class="pt-24 pb-8 animate-fade-in">
      <div class="container mx-auto px-4">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8 animate-slide-up">
          <h1 class="text-4xl font-bold text-gradient">Cursos Disponibles</h1>
        </div>

        <!-- Loading State -->
        <div v-if="coursesStore.loading" class="text-center py-8">
          <span class="loading loading-spinner loading-lg"></span>
          <p class="mt-4">Cargando cursos...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="coursesStore.activeCourses.length === 0" class="text-center animate-fade-in">
          <div class="hero bg-base-200 rounded-2xl p-12 shadow-elegant">
            <div class="hero-content text-center">
              <div class="max-w-md">
                <div class="mb-6">
                  <svg class="w-24 h-24 mx-auto text-base-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 class="text-4xl font-bold mb-4 text-gray-700">No hay cursos disponibles</h2>
                <p class="py-6 text-gray-500">Vuelve a intentarlo más tarde.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Courses Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(course, index) in coursesStore.activeCourses" :key="course.id" class="card bg-base-100 shadow-elegant overflow-hidden card-elegant animate-slide-up" :style="`animation-delay: ${index * 0.1}s`">
            <figure class="h-48 overflow-hidden">
              <img :src="course.img" :alt="course.nombre" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
            </figure>
            <div class="card-body p-6">
              <div class="mb-3">
                <span class="badge badge-primary badge-icon mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ course.duracion }}
                </span>
              </div>
              <h2 class="card-title text-xl mb-2">{{ course.nombre }}</h2>
              <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ course.descripcion }}</p>
              
              <div class="mb-4 p-3 bg-gradient-to-r from-primary/5 to-primary-gradient-end/5 rounded-lg border border-primary/10">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-semibold text-gray-700">Cupos disponibles</span>
                  <span class="text-sm text-gray-500">{{ course.cupos - course.inscritos }} / {{ course.cupos }}</span>
                </div>
                <progress class="progress progress-primary h-2.5 w-full mt-2" :value="course.inscritos" :max="course.cupos"></progress>
                <div class="text-right mt-1">
                  <span class="text-xs font-medium text-primary">{{ Math.round((course.inscritos / course.cupos) * 100) }}% ocupado</span>
                </div>
              </div>
              
              <div class="flex items-center justify-between mb-4 pt-2 border-t border-base-300">
                <div>
                  <p class="text-xs text-gray-500">Precio</p>
                  <p class="text-2xl font-bold text-primary">${{ parseInt(course.precio).toLocaleString() }}</p>
                </div>
              </div>
              
              <div class="card-actions">
                <button class="btn btn-primary w-full btn-gradient transition-all duration-300 hover:shadow-lg hover:scale-105" @click="enroll(course)">Inscribirse</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de bienvenida -->
    <div v-if="authStore.showWelcomeModal" class="modal modal-open animate-fade-in">
      <div class="modal-box backdrop-blur-sm bg-base-100/95 animate-scale-in">
        <div class="text-center mb-4">
          <div class="w-16 h-16 bg-gradient-to-r from-primary to-primary-gradient-end rounded-full flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h3 class="font-bold text-2xl text-center mb-2">¡Bienvenido a AdWeb Online!</h3>
        <p class="text-center text-gray-600 py-4">Has ingresado correctamente al sistema.</p>
        <div class="modal-action justify-center">
          <button @click="closeWelcomeModal" class="btn btn-primary btn-gradient w-full sm:w-auto">Continuar</button>
        </div>
      </div>
    </div>
  </div>
</template>