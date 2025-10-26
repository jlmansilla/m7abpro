<!-- src/views/EditCourse.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()

const courseId = route.params.id
const course = ref(null)
const showUpdateConfirmModal = ref(false)

onMounted(() => {
  const foundCourse = coursesStore.courses.find(c => c.id === courseId)
  if (foundCourse) {
    course.value = { ...foundCourse }
  } else {
    router.push('/admin')
  }
})

async function confirmUpdateCourse() {
  try {
    const courseData = {
      ...course.value,
      precio: String(course.value.precio),
      cupos: parseInt(course.value.cupos)
    }
    await coursesStore.updateCourse(courseId, courseData)
    showUpdateConfirmModal.value = false
    alert('Curso actualizado exitosamente')
    router.push('/admin')
  } catch (error) {
    alert('Error al actualizar el curso: ' + error.message)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
    <NavBar />
    <div class="container mx-auto p-4 pt-24 animate-fade-in">
      <div class="text-center mb-8 animate-slide-up">
        <h1 class="text-4xl font-bold text-gradient mb-2">Editar Curso</h1>
        <p class="text-gray-600">Modifica la información del curso</p>
      </div>
      
      <div v-if="course" class="max-w-2xl mx-auto bg-base-100 p-8 rounded-2xl shadow-elegant-lg border border-base-300 animate-scale-in">
        <form @submit.prevent="showUpdateConfirmModal = true">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-control w-full">
              <label class="label"><span class="label-text font-semibold">Código</span></label>
              <input v-model="course.codigo" type="text" class="input input-bordered input-elegant" />
            </div>

            <div class="form-control w-full">
              <label class="label"><span class="label-text font-semibold">Nombre</span></label>
              <input v-model="course.nombre" type="text" class="input input-bordered input-elegant" />
            </div>

            <div class="form-control w-full">
              <label class="label"><span class="label-text font-semibold">Precio</span></label>
              <input v-model="course.precio" type="number" class="input input-bordered input-elegant" />
            </div>

            <div class="form-control w-full">
              <label class="label"><span class="label-text font-semibold">Duración</span></label>
              <input v-model="course.duracion" type="text" class="input input-bordered input-elegant" />
            </div>

            <div class="form-control w-full md:col-span-2">
              <label class="label"><span class="label-text font-semibold">Descripción</span></label>
              <textarea v-model="course.descripcion" class="textarea textarea-bordered input-elegant h-24"></textarea>
            </div>

            <div class="form-control w-full">
              <label class="label"><span class="label-text font-semibold">Cupos</span></label>
              <input v-model="course.cupos" type="number" class="input input-bordered input-elegant" />
            </div>

            <div class="form-control w-full md:col-span-2">
              <label class="label"><span class="label-text font-semibold">URL de Imagen</span></label>
              <input v-model="course.img" type="url" class="input input-bordered input-elegant" />
            </div>
          </div>

          <div class="flex justify-end gap-4 mt-8 pt-6 border-t border-base-300">
            <button type="button" @click="router.push('/admin')" class="btn btn-ghost">Cancelar</button>
            <button type="submit" class="btn btn-primary btn-gradient shadow-elegant hover:shadow-elegant-lg transition-all duration-300 hover:scale-105">Actualizar Curso</button>
          </div>
        </form>
      </div>
      
      <div v-else class="text-center animate-fade-in">
        <div class="alert alert-info shadow-elegant">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>Cargando información del curso...</span>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para actualizar -->
    <dialog :class="{ 'modal-open': showUpdateConfirmModal }" class="modal backdrop-blur-sm">
      <div class="modal-box animate-scale-in shadow-elegant-lg">
        <div class="text-center mb-4">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h3 class="font-bold text-xl mb-2">Confirmar Actualización</h3>
        <p class="text-gray-600 py-4">¿Estás seguro de que deseas guardar los cambios en este curso?</p>
        <div class="modal-action justify-center gap-3">
          <button @click="showUpdateConfirmModal = false" class="btn btn-ghost">Cancelar</button>
          <button @click="confirmUpdateCourse()" class="btn btn-primary btn-gradient">Sí, actualizar</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped></style>

