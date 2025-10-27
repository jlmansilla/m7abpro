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
    alert('Curso agregado exitosamente')
  } catch (error) {
    alert('Error al agregar el curso: ' + error.message)
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
    alert('Curso eliminado exitosamente')
  } catch (error) {
    alert('Error al eliminar el curso: ' + error.message)
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
            <button type="submit" class="btn btn-primary hover:scale-105 hover:shadow-lg transition-all duration-200">Agregar Curso</button>
          </div>
        </form>
      </div>
    </dialog>

    <dialog :class="{ 'modal-open': showDeleteModal }" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Confirmar Eliminación</h3>
        <p class="py-4">¿Estás seguro de que deseas eliminar el curso "{{ courseToDelete?.nombre }}"?</p>
        <div class="modal-action">
          <button @click="showDeleteModal = false" class="btn">Cancelar</button>
          <button @click="confirmDeleteCourse()" class="btn btn-secondary hover:scale-105 hover:shadow-lg transition-all duration-200">Sí, borrar</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped></style>