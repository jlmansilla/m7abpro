<!-- src/views/Home.vue -->
<template>
    <div class="min-h-screen bg-gray-800 text-white">
      <div class="container mx-auto px-4 pt-24 pb-8">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-4xl font-bold">Cursos Disponibles</h1>
          <button 
            @click="cargarCursosIniciales" 
            class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
          >
            Cargar Cursos Iniciales
          </button>
        </div>
  
        <p class="text-center text-gray-400 mb-8">
          No hay cursos disponibles en este momento.
        </p>
  
        <div class="text-center bg-gray-700 rounded-lg p-8 max-w-md mx-auto">
          <h2 class="text-2xl font-semibold mb-3">¡Bienvenido a AdWeb Online!</h2>
          <p class="text-gray-300 mb-6">Has ingresado correctamente al sistema.</p>
          <button 
            @click="continuar" 
            class="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded transition-colors font-medium"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  function cargarCursosIniciales() {
    // lógica para cargar cursos
    console.log('Cargando cursos iniciales...');
  }
  
  function continuar() {
    // redirigir o hacer algo
    console.log('Continuando...');
  }
  </script>