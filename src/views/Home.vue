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
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
    <NavBar />

    <div class="pt-24 pb-12">
      <div class="container mx-auto px-4 animate-fade-in">
        <!-- Hero Section -->
        <div class="text-center mb-12 animate-slide-up">
          <h1 class="text-5xl md:text-6xl font-bold mb-4 gradient-text tracking-tight">
            Explora Nuestros Cursos
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Aprende habilidades que demandan las empresas del futuro. 
            Cursos actualizados con metodología práctica.
          </p>
          
          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto">
            <div class="flex gap-2">
              <div class="relative flex-1">
                <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Buscar cursos..." 
                  class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 shadow-sm"
                />
              </div>
              <button class="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg">
                Buscar
              </button>
            </div>
          </div>
          
          <!-- Stats -->
          <div class="flex flex-wrap justify-center gap-8 mt-8">
            <div class="stats-card text-center">
              <div class="text-3xl font-bold text-primary">{{ coursesStore.activeCourses.length }}</div>
              <div class="text-sm text-gray-600">Cursos Disponibles</div>
            </div>
            <div class="stats-card text-center">
              <div class="text-3xl font-bold text-success">{{ coursesStore.courses.reduce((sum, c) => sum + c.inscritos, 0) }}</div>
              <div class="text-sm text-gray-600">Estudiantes Activos</div>
            </div>
            <div class="stats-card text-center">
              <div class="text-3xl font-bold text-accent">100%</div>
              <div class="text-sm text-gray-600">Satisfacción</div>
            </div>
          </div>
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
          <div v-for="(course, index) in coursesStore.activeCourses" :key="course.id" class="card-3d bg-white rounded-3xl overflow-hidden shadow-elegant border border-gray-100 animate-slide-up" :style="`animation-delay: ${index * 0.1}s`">
            <!-- Card Header with Image and Badge -->
            <div class="relative h-56 overflow-hidden">
              <img :src="course.img" :alt="course.nombre" class="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
              <div class="gradient-overlay absolute inset-0"></div>
              
              <!-- Badge (New/Popular) -->
              <div class="absolute top-4 left-4">
                <span v-if="index % 3 === 0" class="badge-new px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  NUEVO
                </span>
                <span v-else-if="index % 3 === 1" class="badge-popular px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  POPULAR
                </span>
              </div>
              
              <!-- Category Badge -->
              <div class="absolute top-4 right-4">
                <span class="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                  DESARROLLO
                </span>
              </div>
              
              <!-- Price -->
              <div class="absolute bottom-4 left-4">
                <div class="px-4 py-2 bg-white/95 backdrop-blur-md rounded-xl shadow-lg">
                  <p class="text-xs text-gray-500">Desde</p>
                  <p class="text-2xl font-bold text-primary">${{ parseInt(course.precio).toLocaleString() }}</p>
                </div>
              </div>
            </div>
            
            <!-- Card Body -->
            <div class="p-6">
              <!-- Duration Badge -->
              <div class="mb-3">
                <span class="badge badge-ghost badge-icon border border-gray-200 px-3 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ course.duracion }}
                </span>
              </div>
              
              <!-- Title -->
              <h2 class="text-xl font-bold mb-2 text-gray-900 line-clamp-2">{{ course.nombre }}</h2>
              <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ course.descripcion }}</p>
              
              <!-- Stats -->
              <div class="flex items-center gap-4 mb-4">
                <div class="flex items-center gap-1 text-sm text-gray-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{{ course.inscritos }} estudiantes</span>
                </div>
                <div class="flex items-center gap-1 text-sm text-gray-600">
                  <svg class="w-4 h-4 fill-current text-yellow-400" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <span>4.8</span>
                </div>
              </div>
              
              <!-- Availability Bar -->
              <div class="mb-4 p-3 bg-gradient-to-r from-primary/5 to-cyan-50 rounded-xl border border-primary/10">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-semibold text-gray-700">Cupos disponibles</span>
                  <span class="text-sm font-bold text-primary">{{ course.cupos - course.inscritos }} / {{ course.cupos }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div class="bg-gradient-to-r from-primary to-accent h-2.5 rounded-full progress-animated" 
                       :style="`width: ${(course.inscritos / course.cupos) * 100}%`"></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ Math.round((course.inscritos / course.cupos) * 100) }}% ocupado</p>
              </div>
              
              <!-- CTA Button -->
              <button class="btn btn-primary w-full btn-hover-lift bg-gradient-to-r from-primary to-secondary text-white border-none shadow-elegant mb-2" @click="enroll(course)">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Inscribirse Ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de bienvenida -->
    <div v-if="authStore.showWelcomeModal" class="modal modal-open animate-fade-in">
      <div class="modal-box backdrop-blur-md bg-white/95 animate-scale-in shadow-elegant-xl max-w-md">
        <div class="text-center mb-4">
          <div class="w-20 h-20 bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce-subtle">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h3 class="font-bold text-3xl text-center mb-3 gradient-text">¡Bienvenido a AdWeb Online!</h3>
        <p class="text-center text-gray-600 py-4 text-lg">Has ingresado correctamente al sistema.</p>
        <div class="flex flex-col gap-2">
          <button @click="closeWelcomeModal" class="btn btn-primary w-full bg-gradient-to-r from-primary to-secondary text-white border-none shadow-elegant-lg hover:shadow-elegant-xl transition-all duration-300">
            Comenzar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>