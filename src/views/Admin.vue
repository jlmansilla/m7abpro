<!-- src/views/Admin.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const coursesStore = useCoursesStore()

// Estados para modales
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const courseToDelete = ref(null)

// Formulario de nuevo curso
const newCourse = ref({
  codigo: '',
  nombre: '',
  estado: true,
  precio: '',
  duracion: '',
  descripcion: '',
  cupos: '',
  inscritos: 0,
  img: ''
})

let unsubscribe = null

onMounted(() => {
  unsubscribe = coursesStore.subscribeToCourses()
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

// Abrir modal de agregar
function openAddModal() {
  newCourse.value = {
    codigo: '',
    nombre: '',
    estado: true,
    precio: '',
    duracion: '',
    descripcion: '',
    cupos: '',
    inscritos: 0,
    img: ''
  }
  showAddModal.value = true
}

// Confirmar agregar curso
async function confirmAddCourse() {
  try {
    const courseData = {
      ...newCourse.value,
      precio: String(newCourse.value.precio),
      cupos: parseInt(newCourse.value.cupos),
      inscritos: parseInt(newCourse.value.inscritos)
    }
    await coursesStore.addCourse(courseData)
    
    showAddModal.value = false
    alert('Curso agregado exitosamente')
  } catch (error) {
    alert('Error al agregar el curso: ' + error.message)
  }
}

// Abrir modal de eliminar
function openDeleteModal(course) {
  courseToDelete.value = course
  showDeleteModal.value = true
}

// Confirmar eliminar curso
async function confirmDeleteCourse() {
  try {
    await coursesStore.deleteCourse(courseToDelete.value.id)
    showDeleteModal.value = false
    alert('Curso eliminado exitosamente')
  } catch (error) {
    alert('Error al eliminar el curso: ' + error.message)
  }
}

// Ir a editar curso
function editCourse(courseId) {
  router.push({ name: 'edit-course', params: { id: courseId } })
}

// Cambiar estado del curso
async function toggleCourseStatus(course) {
  try {
    await coursesStore.updateCourse(course.id, { estado: !course.estado })
  } catch (error) {
    alert('Error al actualizar el estado: ' + error.message)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
    <NavBar />
    
    <div class="container mx-auto p-6 pt-24">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8 animate-slide-up">
        <div>
          <h1 class="text-4xl font-bold gradient-text mb-2">Panel de Administración</h1>
          <p class="text-gray-600">Gestiona tus cursos y estadísticas</p>
        </div>
        <button @click="openAddModal" class="btn btn-primary shadow-elegant-lg hover:shadow-3d transition-all duration-300 hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Agregar Curso
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="stats-card">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600 font-medium">Total de Cursos</span>
            <div class="p-2 bg-primary/10 rounded-lg">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-primary">{{ coursesStore.courses.length }}</p>
        </div>
        
        <div class="stats-card">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600 font-medium">Estudiantes Inscritos</span>
            <div class="p-2 bg-success/10 rounded-lg">
              <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-success">{{ coursesStore.courses.reduce((sum, c) => sum + c.inscritos, 0) }}</p>
        </div>
        
        <div class="stats-card">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600 font-medium">Cursos Activos</span>
            <div class="p-2 bg-accent/10 rounded-lg">
              <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-accent">{{ coursesStore.activeCourses.length }}</p>
        </div>
        
        <div class="stats-card">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600 font-medium">Tasa de Ocupación</span>
            <div class="p-2 bg-warning/10 rounded-lg">
              <svg class="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-warning">{{ Math.round((coursesStore.courses.reduce((sum, c) => sum + c.inscritos, 0) / coursesStore.courses.reduce((sum, c) => sum + c.cupos, 0)) * 100) || 0 }}%</p>
        </div>
      </div>

      <!-- Courses Table -->
      <div class="bg-white rounded-3xl shadow-elegant-lg overflow-hidden border border-gray-100">
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead class="bg-gradient-to-r from-slate-50 to-blue-50">
              <tr>
                <th class="text-sm font-bold text-gray-700 py-4">
                  <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Curso
                </th>
                <th class="text-sm font-bold text-gray-700 py-4">
                  <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Código
                </th>
                <th class="text-sm font-bold text-gray-700 py-4">Nombre</th>
                <th class="text-sm font-bold text-gray-700 py-4">
                  <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Precio
                </th>
                <th class="text-sm font-bold text-gray-700 py-4">
                  <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Duración
                </th>
                <th class="text-sm font-bold text-gray-700 py-4">
                  <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cupos
                </th>
                <th class="text-sm font-bold text-gray-700 py-4">Estado</th>
                <th class="text-sm font-bold text-gray-700 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(course, index) in coursesStore.courses" :key="course.id" 
                  class="table-row-elegant border-b border-gray-100"
                  :style="`animation-delay: ${index * 0.05}s`">
                <td class="py-4">
                  <div class="avatar">
                    <div class="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-gray-100">
                      <img :src="course.img" :alt="course.nombre" class="w-full h-full object-cover" />
                    </div>
                  </div>
                </td>
                <td class="font-mono text-sm font-semibold text-gray-700">{{ course.codigo }}</td>
                <td class="font-bold text-gray-900">{{ course.nombre }}</td>
                <td class="text-primary font-bold">${{ parseInt(course.precio).toLocaleString() }}</td>
                <td>
                  <span class="badge badge-ghost border border-gray-200 px-3 py-1">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ course.duracion }}
                  </span>
                </td>
                <td>
                  <div class="flex flex-col gap-1">
                    <div class="text-sm font-semibold text-gray-700">{{ course.cupos - course.inscritos }} / {{ course.cupos }}</div>
                    <div class="w-20 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div class="bg-gradient-to-r from-primary to-accent h-1.5 rounded-full progress-animated" 
                           :style="`width: ${(course.inscritos / course.cupos) * 100}%`"></div>
                    </div>
                  </div>
                </td>
                <td>
                  <input 
                    type="checkbox" 
                    :checked="course.estado" 
                    @change="toggleCourseStatus(course)"
                    class="toggle toggle-lg toggle-success transition-all duration-300"
                  />
                </td>
                <td>
                  <div class="flex gap-2">
                    <button @click="editCourse(course.id)" 
                            class="btn btn-sm bg-primary text-white border-none shadow-elegant hover:shadow-elegant-lg transition-all duration-300 hover:scale-105">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button @click="openDeleteModal(course)" 
                            class="btn btn-sm btn-error shadow-elegant hover:shadow-elegant-lg transition-all duration-300 hover:scale-105">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="coursesStore.courses.length === 0" class="alert alert-warning mt-4 shadow-elegant">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>No hay cursos registrados</span>
      </div>
    </div>

    <!-- Modal para agregar curso -->
    <dialog :class="{ 'modal-open': showAddModal }" class="modal">
      <div class="modal-box w-11/12 max-w-5xl">
        <h3 class="font-bold text-lg mb-4">Agregar Nuevo Curso</h3>
        
        <form @submit.prevent="confirmAddCourse">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label"><span class="label-text">Código</span></label>
              <input v-model="newCourse.codigo" type="text" class="input input-bordered" required />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">Nombre</span></label>
              <input v-model="newCourse.nombre" type="text" class="input input-bordered" required />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">Precio</span></label>
              <input v-model="newCourse.precio" type="number" class="input input-bordered" required />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">Duración</span></label>
              <input v-model="newCourse.duracion" type="text" class="input input-bordered" required />
            </div>
            <div class="form-control md:col-span-2">
              <label class="label"><span class="label-text">Descripción</span></label>
              <textarea v-model="newCourse.descripcion" class="textarea textarea-bordered" required></textarea>
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">Cupos</span></label>
              <input v-model="newCourse.cupos" type="number" class="input input-bordered" required />
            </div>
            <div class="form-control md:col-span-2">
              <label class="label"><span class="label-text">URL de Imagen</span></label>
              <input v-model="newCourse.img" type="url" class="input input-bordered" required />
            </div>
          </div>
          <div class="modal-action mt-6">
            <button type="button" @click="showAddModal = false" class="btn">Cancelar</button>
            <button type="submit" class="btn btn-primary">Agregar Curso</button>
          </div>
        </form>
      </div>
    </dialog>

    <!-- Modal para eliminar curso -->
    <dialog :class="{ 'modal-open': showDeleteModal }" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Confirmar Eliminación</h3>
        <p class="py-4">¿Estás seguro de que deseas eliminar el curso "{{ courseToDelete?.nombre }}"?</p>
        <div class="modal-action">
          <button @click="showDeleteModal = false" class="btn">Cancelar</button>
          <button @click="confirmDeleteCourse()" class="btn btn-error">Sí, borrar</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped></style>