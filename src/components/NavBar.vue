<!-- src/views/Home.vue (ejemplo) -->
<template>
    <div class="bg-gray-800 text-white min-h-screen pt-16"> <!-- 👈 padding-top aquí -->
      <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-4xl font-bold">Cursos Disponibles</h1>
          <button @click="cargarCursosIniciales" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
            Cargar Cursos Iniciales
          </button>
        </div>
  
        <p class="text-center text-gray-400 mb-4">
          No hay cursos disponibles en este momento.
        </p>
  
        <div class="text-center">
          <h2 class="text-xl font-semibold mb-2">¡Bienvenido a AdWeb Online!</h2>
          <p class="text-sm mb-6">Has ingresado correctamente al sistema.</p>
          <button @click="continuar" class="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded">
            Continuar
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  function cargarCursosIniciales() {
    // lógica para cargar cursos
  }
  
  function continuar() {
    // redirigir o hacer algo
  }
  </script>