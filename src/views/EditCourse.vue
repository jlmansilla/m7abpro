<!-- src/views/EditCourse.vue -->
<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const route = useRoute()
const coursesStore = useCoursesStore()

const showConfirmModal = ref(false)
const editedCourse = ref({
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
  // Cargar el curso existente
  const course = coursesStore.courses.find(c => c.id === route.params.id)
  if (course) {
    editedCourse.value = {
      codigo: course.codigo,
      nombre: course.nombre,
      estado: course.estado,
      precio: course.precio,
      duracion: course.duracion,
      descripcion: course.descripcion,
      cupos: course.cupos,
      inscritos: course.inscritos,
      img: course.img
    }
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

const currentCourse = computed(() => {
  return coursesStore.courses.find(c => c.id === route.params.id)
})

async function confirmUpdate() {
  try {
    const courseData = {
      codigo: editedCourse.value.codigo,
      nombre: editedCourse.value.nombre,
      estado: editedCourse.value.estado,
      precio: String(editedCourse.value.precio),
      duracion: editedCourse.value.duracion,
      descripcion: editedCourse.value.descripcion,
      cupos: parseInt(editedCourse.value.cupos),
      inscritos: parseInt(editedCourse.value.inscritos),
      img: editedCourse.value.img
    }
    
    await coursesStore.updateCourse(route.params.id, courseData)
    
    showConfirmModal.value = false
    alert('Curso actualizado exitosamente')
    
    // Redirigir a administración
    router.push('/admin')
  } catch (error) {
    alert('Error al actualizar el curso: ' + error.message)
  }
}
</script>

<template>
  <div>
    <NavBar />
    
    <div class="container mx-auto p-4 max-w-3xl">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Editar Curso</h1>
        <button @click="router.push('/admin')" class="btn btn-ghost">
          Volver
        </button>
      </div>

      <div v-if="!currentCourse" class="alert alert-error">
        <span>Curso no encontrado</span>
      </div>

      <div v-else class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">{{ currentCourse.nombre }}</h2>
          
          <div class="form-control w-full mb-2">
            <label class="label">
              <span class="label-text">Código</span>
            </label>
            <input v-model="editedCourse.codigo" type="text" class="input input-bordered" required />
          </div>

          <div class="form-control w-full mb-2">
            <label class="label">
              <span class="label-text">Nombre</span>
            </label>
            <input v-model="editedCourse.nombre" type="text" class="input input-bordered" required />
          </div>

          <div class="form-control w-full mb-2">
            <label class="label">
              <span class="label-text">Precio</span>
            </label>
            <input v-model="editedCourse.precio" type="number" class="input input-bordered" required />
          </div>

          <div class="form-control w-full mb-2">
            <label class="label">
              <span class="label-text">Duración</span>
            </label>
            <input v-model="editedCourse.duracion" type="text" class="input input-bordered" required />
          </div>

          <div class="form-control w-full mb-2">
            <label class="label">
              <span class="label-text">Descripción</span>
            </label>
            <textarea v-model="editedCourse.descripcion" class="textarea textarea-bordered" required></textarea>
          </div>

          <div class="form-control w-full mb-2">
            <label class="label">
              <span class="label-text">Cupos</span>
            </label>
            <input v-model="editedCourse.cupos" type="number" class="input input-bordered" required />
          </div>

          <div class="form-control w-full mb-2">
            <label class="label">
              <span class="label-text">Inscritos</span>
            </label>
            <input v-model="editedCourse.inscritos" type="number" class="input input-bordered" required />
          </div>

          <div class="form-control w-full mb-2">
            <label class="label">
              <span class="label-text">URL de Imagen</span>
            </label>
            <input v-model="editedCourse.img" type="url" class="input input-bordered" required />
          </div>

          <div class="form-control w-full mb-4">
            <label class="label cursor-pointer">
              <span class="label-text">Estado (Activo)</span>
              <input v-model="editedCourse.estado" type="checkbox" class="toggle toggle-success" />
            </label>
          </div>

          <div class="card-actions justify-end">
            <button @click="router.push('/admin')" class="btn">Cancelar</button>
            <button @click="showConfirmModal = true" class="btn btn-primary">
              Actualizar Curso
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de actualización -->
    <dialog :class="{ 'modal-open': showConfirmModal }" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Confirmar Actualización</h3>
        <p class="py-4">¿Deseas actualizar este curso?</p>
        <div class="modal-action">
          <button @click="showConfirmModal = false" class="btn">Cancelar</button>
          <button @click="confirmUpdate()" class="btn btn-primary">
            Actualizar Curso
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped></style>
