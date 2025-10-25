<!-- src/views/Home.vue -->
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useCoursesStore } from '@/stores/courses'
import { useSeedData } from '@/composables/useSeedData'
import NavBar from '@/components/NavBar.vue'

// Exponer la función de seed en el objeto global para usar desde la consola
const { loadInitialCourses } = useSeedData()
if (typeof window !== 'undefined') {
  window.loadInitialCourses = loadInitialCourses
  console.log('💡 Usa loadInitialCourses() en la consola para cargar los cursos iniciales')
}

const router = useRouter()
const { user, showWelcomeModal } = useAuth()
const coursesStore = useCoursesStore()

let unsubscribe = null

async function handleLoadInitialCourses() {
  try {
    const result = await loadInitialCourses()
    if (result.success) {
      alert(`✅ ${result.message}. Se cargaron ${result.count} cursos.`)
    } else {
      alert(`⚠️ ${result.message}`)
    }
  } catch (error) {
    console.error('Error:', error)
    alert('❌ Error al cargar los cursos: ' + error.message)
  }
}

function closeWelcomeModal() {
  // Usar una variable local para el modal
  showWelcomeModal.value = false
}

onMounted(() => {
  unsubscribe = coursesStore.subscribeToCourses()
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>

<template>
  <div>
    <NavBar />
    <div class="pt-16">
      <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Cursos Disponibles</h1>
        <button 
          v-if="coursesStore.courses.length === 0" 
          @click="handleLoadInitialCourses"
          class="btn btn-primary"
        >
          Cargar Cursos Iniciales
        </button>
      </div>
      
      <div v-if="coursesStore.loading" class="text-center py-8">
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <div v-else-if="coursesStore.activeCourses.length === 0" class="alert alert-info">
        <span>No hay cursos disponibles en este momento.</span>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="course in coursesStore.activeCourses" 
          :key="course.id"
          class="card bg-base-100 shadow-xl"
        >
          <figure>
            <img :src="course.img" :alt="course.nombre" class="w-full h-48 object-cover" />
          </figure>
          <div class="card-body">
            <h2 class="card-title">{{ course.nombre }}</h2>
            <p>{{ course.descripcion }}</p>
            <div class="card-actions justify-between items-center mt-4">
              <div class="badge badge-primary">{{ course.duracion }}</div>
              <div class="text-lg font-bold">${{ parseInt(course.precio).toLocaleString() }}</div>
            </div>
            <div class="mt-2">
              <span class="text-sm">Cupos: {{ course.cupos - course.inscritos }} / {{ course.cupos }}</span>
              <progress 
                class="progress progress-success w-full mt-1" 
                :value="(course.inscritos / course.cupos) * 100" 
                max="100"
              ></progress>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>

    <!-- Modal de bienvenida -->
    <div v-if="showWelcomeModal" class="modal modal-open modal-middle">
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

<style scoped></style>