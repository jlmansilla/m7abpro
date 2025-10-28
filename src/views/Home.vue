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
  <div class="home-container">
    <NavBar />
    
    <!-- Contenedor principal con espacio fijo -->
    <main class="main-content">
      <div class="container mx-auto px-4 py-4 md:py-6">
        <div class="mb-6 md:mb-8">
          <h1 class="text-2xl md:text-3xl font-bold text-center md:text-left">Cursos Disponibles</h1>
        </div>

        <div v-if="coursesStore.loading" class="text-center py-8">
          <span class="loading loading-spinner loading-lg"></span>
        </div>

        <div v-else-if="coursesStore.activeCourses.length === 0" class="text-center py-8">
          <p class="text-lg">No hay cursos disponibles</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div v-for="course in coursesStore.activeCourses" :key="course.id" class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <figure class="bg-base-200 flex items-center justify-center" style="height: 200px; overflow: hidden;">
              <img 
                :src="course.img" 
                :alt="course.nombre"
                class="w-full h-full object-cover"
              />
            </figure>
            <div class="card-body text-center p-4">
              <h2 class="card-title justify-center font-bold text-base md:text-xl uppercase tracking-wide line-clamp-2">{{ course.nombre }}</h2>
              <p class="text-sm md:text-base text-base-content/80 font-medium line-clamp-2">{{ course.descripcion }}</p>
              <div class="badge badge-primary badge-sm md:badge-lg uppercase">{{ course.cupos - course.inscritos }} CUPOS</div>
              <div class="card-actions justify-center">
                <button class="btn btn-primary btn-sm md:btn-md hover:scale-105 transition-all duration-200 font-semibold uppercase">
                  INSCRIBIRSE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="authStore.showWelcomeModal" class="modal modal-open">
      <div class="modal-box max-w-sm md:max-w-md">
        <h3 class="font-bold text-lg md:text-xl">¡Bienvenido!</h3>
        <p class="py-4 text-sm md:text-base">Has ingresado correctamente.</p>
        <div class="modal-action">
          <button @click="closeWelcomeModal" class="btn btn-primary w-full sm:w-auto">Continuar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: hsl(var(--b2));
  position: relative;
}

.main-content {
  padding-top: 80px; /* Espacio reducido para móviles */
  padding-bottom: 2rem;
  min-height: calc(100vh - 80px);
}

@media (min-width: 768px) {
  .main-content {
    padding-top: 100px; /* Espacio completo para desktop */
    min-height: calc(100vh - 100px);
  }
}

/* Asegurar que el navbar tenga altura consistente */
:deep(.fixed) {
  height: 80px; /* Altura fija para el navbar */
  display: flex;
  align-items: center;
}

/* Reset adicional para contenedores */
:deep(.container) {
  margin-top: 0 !important;
}
</style>