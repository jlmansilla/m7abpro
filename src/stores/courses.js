import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore'
import { db } from '@/firebase'

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const activeCourses = computed(() => {
    const filtered = courses.value.filter(c => c.estado === true)
    console.log(`🔄 activeCourses computed: ${filtered.length} cursos activos de ${courses.value.length} totales`)
    return filtered
  })

  // Suscribirse a cambios en tiempo real con onSnapshot
  function subscribeToCourses() {
    try {
      loading.value = true
      const unsubscribe = onSnapshot(
        collection(db, 'cursos'),
        (snapshot) => {
          courses.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          
          // Diagnóstico: contabilizar cursos por estado
          const activos = courses.value.filter(c => c.estado === true).length
          const inactivos = courses.value.filter(c => c.estado === false).length
          const sinEstado = courses.value.filter(c => c.estado === undefined).length
          
          console.log(`📊 Total cursos cargados: ${courses.value.length}`)
          console.log(`✅ Activos (estado: true): ${activos}`)
          console.log(`❌ Inactivos (estado: false): ${inactivos}`)
          console.log(`⚠️ Sin estado: ${sinEstado}`)
          console.log('📋 Detalle de cursos:', courses.value.map(c => ({ 
            nombre: c.nombre, 
            estado: c.estado,
            codigo: c.codigo,
            id: c.id
          })))
          
          loading.value = false
          error.value = null
        },
        (err) => {
          console.error('❌ Error en onSnapshot:', err)
          error.value = err.message
          loading.value = false
        }
      )
      return unsubscribe
    } catch (err) {
      console.error('❌ Error al suscribirse a cursos:', err)
      error.value = err.message
      loading.value = false
      return () => {}
    }
  }

  // Agregar curso con método add
  async function addCourse(courseData) {
    try {
      loading.value = true
      const docRef = await addDoc(collection(db, 'cursos'), courseData)
      return docRef.id
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actualizar curso con método update
  async function updateCourse(courseId, courseData) {
    try {
      loading.value = true
      await updateDoc(doc(db, 'cursos', courseId), courseData)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Eliminar curso con método delete
  async function deleteCourse(courseId) {
    try {
      loading.value = true
      await deleteDoc(doc(db, 'cursos', courseId))
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    courses,
    activeCourses,
    loading,
    error,
    subscribeToCourses,
    addCourse,
    updateCourse,
    deleteCourse
  }
})
