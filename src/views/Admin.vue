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
  <div class="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
    <NavBar />
    
    <div class="container mx-auto p-4 pt-24 animate-fade-in">
      <div class="flex justify-between items-center mb-8 animate-slide-up">
        <h1 class="text-3xl font-bold text-gradient">Administración de Cursos</h1>
        <button @click="openAddModal" class="btn btn-primary btn-gradient shadow-elegant hover:shadow-elegant-lg transition-all duration-300 hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Agregar Curso
        </button>
      </div>

      <div class="overflow-x-auto bg-base-100 rounded-xl shadow-elegant border border-base-300">
        <table class="table w-full">
          <thead class="bg-base-200">
            <tr>
              <th class="text-sm font-semibold text-gray-700">Imagen</th>
              <th class="text-sm font-semibold text-gray-700">Código</th>
              <th class="text-sm font-semibold text-gray-700">Nombre</th>
              <th class="text-sm font-semibold text-gray-700">Precio</th>
              <th class="text-sm font-semibold text-gray-700">Duración</th>
              <th class="text-sm font-semibold text-gray-700">Cupos</th>
              <th class="text-sm font-semibold text-gray-700">Estado</th>
              <th class="text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(course, index) in coursesStore.courses" :key="course.id" class="table-row-elegant" :style="`animation-delay: ${index * 0.05}s`">
              <td>
                <div class="avatar">
                  <div class="w-16 h-16 rounded-lg overflow-hidden ring-2 ring-base-300">
                    <img :src="course.img" :alt="course.nombre" class="w-full h-full object-cover" />
                  </div>
                </div>
              </td>
              <td class="font-medium">{{ course.codigo }}</td>
              <td class="font-semibold text-gray-800">{{ course.nombre }}</td>
              <td class="text-primary font-bold">${{ parseInt(course.precio).toLocaleString() }}</td>
              <td>
                <span class="badge badge-icon badge-info">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ course.duracion }}
                </span>
              </td>
              <td>
                <div class="flex flex-col">
                  <span class="text-sm font-semibold">{{ course.cupos - course.inscritos }} / {{ course.cupos }}</span>
                  <progress class="progress progress-info h-1 w-16" :value="course.inscritos" :max="course.cupos"></progress>
                </div>
              </td>
              <td>
                <input 
                  type="checkbox" 
                  :checked="course.estado" 
                  @change="toggleCourseStatus(course)"
                  class="toggle toggle-success toggle-lg"
                />
              </td>
              <td>
                <div class="flex gap-2">
                  <button @click="editCourse(course.id)" class="btn btn-sm btn-info transition-all duration-300 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                  <button @click="openDeleteModal(course)" class="btn btn-sm btn-error transition-all duration-300 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      <div v-if="coursesStore.courses.length === 0" class="alert alert-warning mt-6 shadow-elegant">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>No hay cursos registrados</span>
      </div>
    </div>

    <!-- Modal para agregar curso -->
    <dialog :class="{ 'modal-open': showAddModal }" class="modal backdrop-blur-sm">
      <div class="modal-box w-11/12 max-w-5xl animate-scale-in bg-base-100 shadow-elegant-lg">
        <h3 class="font-bold text-2xl mb-6 text-gradient">Agregar Nuevo Curso</h3>
        
        <form @submit.prevent="confirmAddCourse">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Código</span></label>
              <input v-model="newCourse.codigo" type="text" class="input input-bordered input-elegant" required />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Nombre</span></label>
              <input v-model="newCourse.nombre" type="text" class="input input-bordered input-elegant" required />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Precio</span></label>
              <input v-model="newCourse.precio" type="number" class="input input-bordered input-elegant" required />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Duración</span></label>
              <input v-model="newCourse.duracion" type="text" class="input input-bordered input-elegant" required />
            </div>
            <div class="form-control md:col-span-2">
              <label class="label"><span class="label-text font-semibold">Descripción</span></label>
              <textarea v-model="newCourse.descripcion" class="textarea textarea-bordered input-elegant" required></textarea>
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Cupos</span></label>
              <input v-model="newCourse.cupos" type="number" class="input input-bordered input-elegant" required />
            </div>
            <div class="form-control md:col-span-2">
              <label class="label"><span class="label-text font-semibold">URL de Imagen</span></label>
              <input v-model="newCourse.img" type="url" class="input input-bordered input-elegant" required />
            </div>
          </div>
          <div class="modal-action mt-8">
            <button type="button" @click="showAddModal = false" class="btn btn-ghost">Cancelar</button>
            <button type="submit" class="btn btn-primary btn-gradient">Agregar Curso</button>
          </div>
        </form>
      </div>
    </dialog>

    <!-- Modal para eliminar curso -->
    <dialog :class="{ 'modal-open': showDeleteModal }" class="modal backdrop-blur-sm">
      <div class="modal-box animate-scale-in shadow-elegant-lg">
        <div class="text-center mb-4">
          <div class="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <h3 class="font-bold text-xl mb-2">Confirmar Eliminación</h3>
        <p class="text-gray-600 py-4">¿Estás seguro de que deseas eliminar el curso "<span class="font-semibold">{{ courseToDelete?.nombre }}</span>"?</p>
        <div class="modal-action justify-center gap-3">
          <button @click="showDeleteModal = false" class="btn btn-ghost">Cancelar</button>
          <button @click="confirmDeleteCourse()" class="btn btn-error">Sí, eliminar</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped></style>
