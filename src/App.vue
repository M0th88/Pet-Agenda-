<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView /> 
</template>

<style>
/* Estilos globales básicos */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center;  <-- También te recomiendo quitar esto si usas Tailwind */
  color: #2c3e50;
  
  /* ELIMINA ESTA LÍNEA QUE CAUSA EL ESPACIO: */
  /* margin-top: 60px; */ 
}
</style>