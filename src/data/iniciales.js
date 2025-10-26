// Asumiendo que ya has inicializado Firebase y Firestore
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const db = getFirestore();
const cursosCollectionRef = collection(db, 'cursos');

const cursosParaAgregar = [
  {
    "codigo": "0001",
    "nombre": "HTML",
    "estado": true,
    "precio": "30000",
    "duracion": "1 mes",
    "descripcion": "curso html",
    "cupos": 10,
    "inscritos": 0,
    "img": "https://www.w3.org/html/logo/downloads/HTML5_Logo_512.png"
  },
  {
    "codigo": "0002",
    "nombre": "CSS",
    "estado": false,
    "precio": "20000",
    "duracion": "1 mes",
    "descripcion": "curso css",
    "cupos": 20,
    "inscritos": 0,
    "img": "https://lineadecodigo.com/wpcontent/uploads/2014/04/css.png"
  },
  {
    "codigo": "0003",
    "nombre": "SASS",
    "estado": true,
    "precio": "40000",
    "duracion": "2 mes",
    "descripcion": "curso sass",
    "cupos": 30,
    "inscritos": 0,
    "img": "https://miro.medium.com/max/512/1*9U1toerFxB8aiFRreLxEUQ.png"
  },
  {
    "codigo": "0004",
    "nombre": "VUE",
    "estado": false,
    "precio": "50000",
    "duracion": "3 mes",
    "descripcion": "curso vue",
    "cupos": 15,
    "inscritos": 0,
    "img": "https://thumbs.gfycat.com/PinkPiercingBullsize_restricted.gif"
  }
];

// Función exportada para agregar los cursos a Firestore
export async function agregarCursos() {
  for (const cursoData of cursosParaAgregar) {
    try {
      // Verificar si ya existe un curso con este código
      const q = query(cursosCollectionRef, where('codigo', '==', cursoData.codigo));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // No existe un curso con este código, agregarlo
        const docRef = await addDoc(cursosCollectionRef, cursoData);
        console.log("✅ Curso agregado con ID: ", docRef.id, " Datos:", cursoData.nombre);
      } else {
        console.log("⏭️ El curso", cursoData.nombre, "ya existe en Firestore, omitiendo...");
      }
    } catch (e) {
      console.error("❌ Error al verificar/agregar el curso", cursoData.nombre, ": ", e);
    }
  }
}