<!-- src/views/Home.vue -->
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useCoursesStore } from '@/stores/courses'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const { user, showWelcomeModal } = useAuth()
const coursesStore = useCoursesStore()

let unsubscribe = null

function closeWelcomeModal() {
  showWelcomeModal.value = false
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
  <div class="min-h-screen bg-gray-800">
    <NavBar />
    
    <div class="pt-24 pb-8">
      <div class="container mx-auto px-4">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-4xl font-bold text-white">Cursos Activos</h1>
        </div>

        <!-- Loading State -->
        <div v-if="coursesStore.loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p class="text-white mt-4">Cargando cursos...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="coursesStore.activeCourses.length === 0" class="text-center">
          <div class="bg-blue-500/10 border border-blue-500/50 rounded-lg p-6 max-w-md mx-auto">
            <svg class="w-16 h-16 mx-auto mb-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-gray-300 text-lg">No hay cursos disponibles en este momento.</p>
          </div>
        </div>

        <!-- Courses Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="course in coursesStore.activeCourses"
            :key="course.id"
            class="bg-gray-700 rounded-lg shadow-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <figure>
              <img :src="course.img" :alt="course.nombre" class="w-full h-48 object-cover" />
            </figure>
            <div class="p-6">
              <h2 class="text-2xl font-bold text-white mb-2">{{ course.nombre }}</h2>
              <p class="text-gray-300 mb-4">{{ course.descripcion }}</p>
              
              <div class="flex justify-between items-center mb-4">
                <span class="bg-blue-600 text-white px-3 py-1 rounded text-sm">{{ course.duracion }}</span>
                <span class="text-2xl font-bold text-white">${{ parseInt(course.precio).toLocaleString() }}</span>
              </div>
              
              <div class="mt-4">
                <div class="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Cupos disponibles: {{ course.cupos - course.inscritos }} / {{ course.cupos }}</span>
                  <span>{{ Math.round((course.inscritos / course.cupos) * 100) }}%</span>
                </div>
                <div class="w-full bg-gray-600 rounded-full h-2">
                  <div
                    class="bg-green-500 h-2 rounded-full transition-all"
                    :style="{ width: `${(course.inscritos / course.cupos) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de bienvenida -->
    <div v-if="showWelcomeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-8 max-w-md mx-4 shadow-2xl">
        <h3 class="text-2xl font-bold text-white mb-4">¡Bienvenido a AdWeb Online!</h3>
        <p class="text-gray-300 mb-6">Has ingresado correctamente al sistema.</p>
        <div class="flex justify-end">
          <button 
            @click="closeWelcomeModal" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors font-medium"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>