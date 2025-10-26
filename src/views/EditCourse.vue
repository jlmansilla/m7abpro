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

    <!-- Modal de confirmación para actualizar -->
    <dialog :class="{ 'modal-open': showUpdateConfirmModal }" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Confirmar Actualización</h3>
        <p class="py-4">¿Estás seguro de que deseas guardar los cambios en este curso?</p>
        <div class="modal-action">
          <button @click="showUpdateConfirmModal = false" class="btn">Cancelar</button>
          <button @click="confirmUpdateCourse()" class="btn btn-primary">Sí, actualizar</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped></style>