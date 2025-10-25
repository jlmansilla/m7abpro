// src/composables/useSeedData.js
import { initialCourses } from '@/data/initialCourses'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'

export function useSeedData() {
  async function loadInitialCourses() {
    try {
      // Verificar si ya existen cursos
      const coursesRef = collection(db, 'cursos')
      const snapshot = await getDocs(coursesRef)
      
      if (snapshot.size > 0) {
        console.log('⚠️ Ya existen cursos en Firestore. No se cargarán cursos iniciales.')
        return { success: false, message: 'Los cursos ya existen en Firestore' }
      }

      // Cargar cursos iniciales
      const promises = initialCourses.map(course => {
        return addDoc(collection(db, 'cursos'), course)
      })

      await Promise.all(promises)
      console.log('✅ Cursos iniciales cargados exitosamente en Firestore')
      
      return { success: true, message: 'Cursos cargados exitosamente', count: initialCourses.length }
    } catch (error) {
      console.error('❌ Error al cargar cursos iniciales:', error)
      return { success: false, message: error.message }
    }
  }

  return {
    loadInitialCourses
  }
}
