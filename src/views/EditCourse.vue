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
const showSuccessToast = ref(false)
const showErrorToast = ref(false)

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
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
      router.push('/admin')
    }, 2000)
  } catch (error) {
    showUpdateConfirmModal.value = false
    showErrorToast.value = true
    setTimeout(() => {
      showErrorToast.value = false
    }, 3000)
  }
}
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <NavBar />
    <div class="container mx-auto p-4 pt-24">
      <h1 class="text-3xl font-bold mb-6">Editar Curso</h1>
      
      <div v-if="course" class="max-w-lg mx-auto bg-base-100 p-8 rounded-lg shadow-xl">
        <form @submit.prevent="showUpdateConfirmModal = true">
          <div class="form-control w-full mb-2">
            <label class="label"><span class="label-text">Código</span></label>
            <input v-model="course.codigo" type="text" class="input input-bordered" />
          </div>

          <div class="form-control w-full mb-2">
            <label class="label"><span class="label-text">Nombre</span></label>
            <input v-model="course.nombre" type="text" class="input input-bordered" />
          </div>

          <div class="form-control w-full mb-2">
            <label class="label"><span class="label-text">Precio</span></label>
            <input v-model="course.precio" type="number" class="input input-bordered" />
          </div>

          <div class="form-control w-full mb-2">
            <label class="label"><span class="label-text">Duración</span></label>
            <input v-model="course.duracion" type="text" class="input input-bordered" />
          </div>

          <div class="form-control w-full mb-2">
            <label class="label"><span class="label-text">Descripción</span></label>
            <textarea v-model="course.descripcion" class="textarea textarea-bordered"></textarea>
          </div>

          <div class="form-control w-full mb-2">
            <label class="label"><span class="label-text">Cupos</span></label>
            <input v-model="course.cupos" type="number" class="input input-bordered" />
          </div>

          <div class="form-control w-full mb-2">
            <label class="label"><span class="label-text">URL de Imagen</span></label>
            <input v-model="course.img" type="url" class="input input-bordered" />
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button type="button" @click="router.push('/admin')" class="btn">Cancelar</button>
            <button type="submit" class="btn btn-primary">Actualizar Curso</button>
          </div>
        </form>
      </div>
      
      <div v-else class="alert alert-warning">
        <span>Cargando información del curso...</span>
      </div>
    </div>

    <div v-if="showUpdateConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-2xl border-4 border-blue-600 max-w-md w-full p-6">
        <h3 class="font-bold text-xl mb-3 text-blue-600">✨ Confirmar Actualización</h3>
        <div class="divider my-3"></div>
        <p class="py-2 text-base">¿Estás seguro de que deseas guardar los cambios en este curso?</p>
        <div class="mt-4 pt-4 border-t border-gray-300 flex justify-evenly">
          <button @click="showUpdateConfirmModal = false" class="btn btn-ghost btn-sm">Cancelar</button>
          <button @click="confirmUpdateCourse()" class="btn btn-primary btn-sm">Sí, actualizar</button>
        </div>
      </div>
      <div class="absolute inset-0 bg-gray-800/80 -z-10" @click="showUpdateConfirmModal = false"></div>
    </div>

    <!-- Toast de éxito -->
    <div v-if="showSuccessToast" class="toast toast-top toast-end">
      <div class="alert alert-success">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>¡Curso actualizado exitosamente!</span>
      </div>
    </div>

    <!-- Toast de error -->
    <div v-if="showErrorToast" class="toast toast-top toast-end">
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error al actualizar el curso</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>