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
const showConfirmAddModal = ref(false)
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
    showConfirmAddModal.value = false
    
    // Mostrar alerta de éxito
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
  <div>
    <NavBar />
    
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Administración de Cursos</h1>
        <button @click="openAddModal" class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Agregar Curso
        </button>
      </div>

      <div class="overflow-x-auto">
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
              <td>
                <img :src="course.img" :alt="course.nombre" class="w-16 h-16 object-cover rounded" />
              </td>
              <td>{{ course.codigo }}</td>
              <td>{{ course.nombre }}</td>
              <td>${{ parseInt(course.precio).toLocaleString() }}</td>
              <td>{{ course.duracion }}</td>
              <td>{{ course.cupos - course.inscritos }} / {{ course.cupos }}</td>
              <td>
                <input 
                  type="checkbox" 
                  :checked="course.estado" 
                  @change="toggleCourseStatus(course)"
                  class="toggle toggle-success"
                />
              </td>
              <td>
                <div class="flex gap-2">
                  <button @click="editCourse(course.id)" class="btn btn-sm btn-info">
                    Editar
                  </button>
                  <button @click="openDeleteModal(course)" class="btn btn-sm btn-error">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="coursesStore.courses.length === 0" class="alert alert-warning mt-4">
        <span>No hay cursos registrados</span>
      </div>
    </div>

    <!-- Modal para agregar curso -->
    <dialog :class="{ 'modal-open': showAddModal }" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Agregar Nuevo Curso</h3>
        
        <div class="form-control w-full mb-2">
          <label class="label">
            <span class="label-text">Código</span>
          </label>
          <input v-model="newCourse.codigo" type="text" class="input input-bordered" required />
        </div>

        <div class="form-control w-full mb-2">
          <label class="label">
            <span class="label-text">Nombre</span>
          </label>
          <input v-model="newCourse.nombre" type="text" class="input input-bordered" required />
        </div>

        <div class="form-control w-full mb-2">
          <label class="label">
            <span class="label-text">Precio</span>
          </label>
          <input v-model="newCourse.precio" type="number" class="input input-bordered" required />
        </div>

        <div class="form-control w-full mb-2">
          <label class="label">
            <span class="label-text">Duración</span>
          </label>
          <input v-model="newCourse.duracion" type="text" class="input input-bordered" required />
        </div>

        <div class="form-control w-full mb-2">
          <label class="label">
            <span class="label-text">Descripción</span>
          </label>
          <textarea v-model="newCourse.descripcion" class="textarea textarea-bordered" required></textarea>
        </div>

        <div class="form-control w-full mb-2">
          <label class="label">
            <span class="label-text">Cupos</span>
          </label>
          <input v-model="newCourse.cupos" type="number" class="input input-bordered" required />
        </div>

        <div class="form-control w-full mb-2">
          <label class="label">
            <span class="label-text">URL de Imagen</span>
          </label>
          <input v-model="newCourse.img" type="url" class="input input-bordered" required />
        </div>

        <div class="modal-action">
          <button @click="showAddModal = false" class="btn">Cancelar</button>
          <button @click="showConfirmAddModal = true" class="btn btn-primary">
            Agregar Curso
          </button>
        </div>
      </div>
    </dialog>

    <!-- Modal de confirmación para agregar -->
    <dialog :class="{ 'modal-open': showConfirmAddModal }" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Confirmar Agregado</h3>
        <p class="py-4">¿Deseas agregar este curso a la base de datos?</p>
        <div class="modal-action">
          <button @click="showConfirmAddModal = false" class="btn">Cancelar</button>
          <button @click="confirmAddCourse()" class="btn btn-primary">Agregar Curso</button>
        </div>
      </div>
    </dialog>

    <!-- Modal para eliminar curso -->
    <dialog :class="{ 'modal-open': showDeleteModal }" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Confirmar Eliminación</h3>
        <p class="py-4">
          ¿Estás seguro de que deseas eliminar el curso "{{ courseToDelete?.nombre }}"?
        </p>
        <div class="modal-action">
          <button @click="showDeleteModal = false" class="btn">Cancelar</button>
          <button @click="confirmDeleteCourse()" class="btn btn-error">Sí, borrar</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped></style>
