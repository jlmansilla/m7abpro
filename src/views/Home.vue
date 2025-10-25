<!-- src/views/Home.vue -->
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useCoursesStore } from '@/stores/courses'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const { user } = useAuth()
const coursesStore = useCoursesStore()

let unsubscribe = null

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
    
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Cursos Disponibles</h1>
      
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
</template>

<style scoped></style>