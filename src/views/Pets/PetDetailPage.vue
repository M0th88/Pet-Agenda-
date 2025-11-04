<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePetStore } from '@/store/PetStore.js'; // Usamos alias
import { useUserStore } from '@/store/UserStore.js'; // Usamos alias

const route = useRoute();
const router = useRouter();
const petStore = usePetStore();
const userStore = useUserStore(); // Para el header

// Obtenemos el ID de la mascota desde la URL
const petId = route.params.id;

// Cargamos los datos de la mascota al montar la página
onMounted(() => {
  petStore.fetchPetById(petId);
});

const handleLogout = () => {
  userStore.logout();
  router.push({ name: 'Login' });
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    
    <!-- Header (Similar al Dashboard) -->
    <header class="bg-white shadow-md">
      <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
        <!-- Enlace para volver al Dashboard -->
        <router-link :to="{ name: 'Dashboard' }" class="text-2xl font-bold text-indigo-600 hover:text-indigo-800">
          &larr; 🐾 PetAgenda
        </router-link>
        <div class="flex items-center space-x-4">
          <span class="text-gray-700">
            Hola, {{ userStore.user?.name || 'Usuario' }}
          </span>
          <button 
            @click="handleLogout"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>
    </header>

    <!-- Contenido Principal del Detalle -->
    <main class="container mx-auto px-6 py-8">
      
      <!-- Estado de Carga -->
      <div v-if="petStore.isLoading" class="text-center text-gray-600 text-xl">
        Cargando datos de la mascota...
      </div>

      <!-- Estado de Error -->
      <div v-else-if="petStore.error" class="bg-white p-6 rounded-lg shadow text-center text-red-600">
        {{ petStore.error }}
      </div>

      <!-- Contenido de la Mascota -->
      <div v-else-if="petStore.selectedPet" class="bg-white p-8 rounded-lg shadow-xl">
        <h2 class="text-4xl font-bold text-gray-900 mb-2">
          {{ petStore.selectedPet.name }}
        </h2>
        <p class="text-2xl text-indigo-600 font-medium mb-4">
          {{ petStore.selectedPet.species }}
        </p>
        <p class="text-lg text-gray-700">
          <strong>Raza:</strong> {{ petStore.selectedPet.breed || 'No especificada' }}
        </p>
        <!-- Aquí irán más detalles, como fecha de nacimiento, etc. -->

        <hr class="my-8">

        <!-- Secciones Futuras -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-50 p-6 rounded-lg border">
            <h3 class="text-2xl font-semibold mb-4 text-gray-800">Próximas Citas</h3>
            <p class="text-gray-600">(Aquí irá el calendario de citas)</p>
          </div>
          <div class="bg-gray-50 p-6 rounded-lg border">
            <h3 class="text-2xl font-semibold mb-4 text-gray-800">Historial Médico</h3>
            <p class="text-gray-600">(Aquí irá el historial de operaciones y remedios)</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

