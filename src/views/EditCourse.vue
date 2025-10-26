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
  <div class="min-h-screen bg-gray-100">
    <NavBar />

    <main class="pt-24 pb-8">
      <div class="container mx-auto px-4">
        <header class="mb-8">
          <h1 class="text-3xl font-bold text-gray-800">Editar Curso</h1>
        </header>

        <div v-if="course" class="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
          <form @submit.prevent="showUpdateConfirmModal = true">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label"><span class="label-text">Código</span></label>
                <input v-model="course.codigo" type="text" class="input input-bordered w-full focus:ring-2 focus:ring-blue-500" />
              </div>

              <div class="form-control">
                <label class="label"><span class="label-text">Nombre</span></label>
                <input v-model="course.nombre" type="text" class="input input-bordered w-full focus:ring-2 focus:ring-blue-500" />
              </div>

              <div class="form-control">
                <label class="label"><span class="label-text">Precio</span></label>
                <input v-model="course.precio" type="number" class="input input-bordered w-full focus:ring-2 focus:ring-blue-500" />
              </div>

              <div class="form-control">
                <label class="label"><span class="label-text">Duración</span></label>
                <input v-model="course.duracion" type="text" class="input input-bordered w-full focus:ring-2 focus:ring-blue-500" />
              </div>

              <div class="form-control md:col-span-2">
                <label class="label"><span class="label-text">Descripción</span></label>
                <textarea v-model="course.descripcion" class="textarea textarea-bordered w-full focus:ring-2 focus:ring-blue-500"></textarea>
              </div>

              <div class="form-control">
                <label class="label"><span class="label-text">Cupos</span></label>
                <input v-model="course.cupos" type="number" class="input input-bordered w-full focus:ring-2 focus:ring-blue-500" />
              </div>

              <div class="form-control md:col-span-2">
                <label class="label"><span class="label-text">URL de Imagen</span></label>
                <input v-model="course.img" type="url" class="input input-bordered w-full focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div class="flex justify-end gap-4 mt-6">
              <button type="button" @click="router.push('/admin')" class="btn hover:scale-105 transition-transform">Cancelar</button>
              <button type="submit" class="btn btn-primary hover:scale-105 transition-transform">Actualizar Curso</button>
            </div>
          </form>
        </div>
        
        <div v-else class="text-center py-16">
          <h2 class="text-2xl font-bold text-gray-700">Cargando información del curso...</h2>
        </div>
      </div>
    </main>

    <!-- Update Confirmation Modal -->
    <dialog :class="{ 'modal-open': showUpdateConfirmModal }" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Confirmar Actualización</h3>
        <p class="py-4">¿Estás seguro de que deseas guardar los cambios en este curso?</p>
        <div class="modal-action">
          <button @click="showUpdateConfirmModal = false" class="btn hover:scale-105 transition-transform">Cancelar</button>
          <button @click="confirmUpdateCourse()" class="btn btn-primary hover:scale-105 transition-transform">Sí, actualizar</button>
        </div>
      </div>
    </dialog>
  </div>
</template>