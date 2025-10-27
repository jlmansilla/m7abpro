<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const coursesStore = useCoursesStore()

const showAddModal = ref(false)
const showDeleteModal = ref(false)
const courseToDelete = ref(null)
const showSuccessToast = ref(false)
const showErrorToast = ref(false)
const showDeleteSuccessToast = ref(false)

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
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)
  } catch (error) {
    showErrorToast.value = true
    setTimeout(() => {
      showErrorToast.value = false
    }, 3000)
  }
}

function openDeleteModal(course) {
  courseToDelete.value = course
  showDeleteModal.value = true
}

async function confirmDeleteCourse() {
  try {
    await coursesStore.deleteCourse(courseToDelete.value.id)
    showDeleteModal.value = false
    showDeleteSuccessToast.value = true
    setTimeout(() => {
      showDeleteSuccessToast.value = false
    }, 3000)
  } catch (error) {
    showErrorToast.value = true
    setTimeout(() => {
      showErrorToast.value = false
    }, 3000)
  }
}

function editCourse(courseId) {
  router.push({ name: 'edit-course', params: { id: courseId } })
}

async function toggleCourseStatus(course) {
  try {
    await coursesStore.updateCourse(course.id, { estado: !course.estado })
  } catch (error) {
    alert('Error al actualizar el estado: ' + error.message)
  }
}
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <NavBar />
    
    <div class="container mx-auto p-4 pt-24">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Administración de Cursos</h1>
        <button @click="openAddModal" class="btn btn-primary hover:scale-105 hover:shadow-lg transition-all duration-200 font-semibold">Agregar Curso</button>
      </div>

      <div class="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Duración</th>
              <th>Cupos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in coursesStore.courses" :key="course.id">
              <td class="text-center">
                <div class="avatar mx-auto">
                  <div class="w-16 rounded">
                    <img :src="course.img" :alt="course.nombre" />
                  </div>
                </div>
              </td>
              <td class="text-center">{{ course.codigo }}</td>
              <td class="text-center">{{ course.nombre }}</td>
              <td class="text-center">${{ parseInt(course.precio).toLocaleString() }}</td>
              <td class="text-center">{{ course.duracion }}</td>
              <td class="text-center">{{ course.cupos - course.inscritos }} / {{ course.cupos }}</td>
              <td class="text-center">
                <input type="checkbox" :checked="course.estado" @change="toggleCourseStatus(course)" class="toggle toggle-success" />
              </td>
              <td class="text-center">
                <div class="flex gap-4 justify-center">
                  <button @click="editCourse(course.id)" class="btn btn-sm btn-primary hover:scale-105 hover:shadow-md transition-all duration-200">Editar</button>
                  <button @click="openDeleteModal(course)" class="btn btn-sm btn-secondary hover:scale-105 hover:shadow-md transition-all duration-200">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showAddModal" class="modal modal-open z-50">
      <div class="modal-box bg-base-100 shadow-2xl w-11/12 max-w-5xl mx-auto">
        <h3 class="font-bold text-2xl mb-4 text-primary">➕ Agregar Nuevo Curso</h3>
        <div class="divider"></div>
        <form @submit.prevent="confirmAddCourse">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Código</span></label>
              <input v-model="newCourse.codigo" type="text" class="input input-bordered w-full" required />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Nombre</span></label>
              <input v-model="newCourse.nombre" type="text" class="input input-bordered w-full" required />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Precio</span></label>
              <input v-model="newCourse.precio" type="number" class="input input-bordered w-full" required />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Duración</span></label>
              <input v-model="newCourse.duracion" type="text" class="input input-bordered w-full" required />
            </div>
            <div class="form-control md:col-span-2">
              <label class="label"><span class="label-text font-semibold">Descripción</span></label>
              <textarea v-model="newCourse.descripcion" class="textarea textarea-bordered w-full" rows="3" required></textarea>
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold">Cupos</span></label>
              <input v-model="newCourse.cupos" type="number" class="input input-bordered w-full" required />
            </div>
            <div class="form-control md:col-span-2">
              <label class="label"><span class="label-text font-semibold">URL de Imagen</span></label>
              <input v-model="newCourse.img" type="url" class="input input-bordered w-full" required />
            </div>
          </div>
          <div class="modal-action mt-6 pt-4 border-t border-base-300">
            <button type="button" @click="showAddModal = false" class="btn btn-ghost w-32">Cancelar</button>
            <button type="submit" class="btn btn-primary w-32">Agregar</button>
          </div>
        </form>
      </div>
      <div class="modal-backdrop bg-black/50" @click="showAddModal = false"></div>
    </div>

    <div v-if="showDeleteModal" class="modal modal-open z-50">
      <div class="modal-box bg-base-100 shadow-2xl max-w-md mx-auto">
        <h3 class="font-bold text-2xl mb-4 text-error">⚠️ Confirmar Eliminación</h3>
        <div class="divider"></div>
        <p class="py-4 text-lg">¿Estás seguro de que deseas eliminar el curso <strong class="text-error">"{{ courseToDelete?.nombre }}"</strong>?</p>
        <p class="text-sm text-base-content/70 mb-6 bg-warning/10 p-3 rounded-lg">⚠️ Esta acción no se puede deshacer.</p>
        <div class="modal-action mt-6 pt-4 border-t border-base-300">
          <button @click="showDeleteModal = false" class="btn btn-ghost w-32">Cancelar</button>
          <button @click="confirmDeleteCourse()" class="btn btn-error w-32">Sí, borrar</button>
        </div>
      </div>
      <div class="modal-backdrop bg-black/50" @click="showDeleteModal = false"></div>
    </div>

    <!-- Toast de éxito - Curso agregado -->
    <div v-if="showSuccessToast" class="toast toast-top toast-end">
      <div class="alert alert-success">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>¡Curso agregado exitosamente!</span>
      </div>
    </div>

    <!-- Toast de éxito - Curso eliminado -->
    <div v-if="showDeleteSuccessToast" class="toast toast-top toast-end">
      <div class="alert alert-success">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>¡Curso eliminado exitosamente!</span>
      </div>
    </div>

    <!-- Toast de error -->
    <div v-if="showErrorToast" class="toast toast-top toast-end">
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error al procesar la operación</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>