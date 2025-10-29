<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store/UserStore.js'; // Ruta relativa
import { usePetStore } from '../../store/PetStore.js'; // Ruta relativa

const router = useRouter();
const userStore = useUserStore();
const petStore = usePetStore();

// Estado para controlar el modal de "Añadir Mascota"
const showAddModal = ref(false);

// Estado para el formulario de nueva mascota
const newPetForm = ref({
  name: '',
  species: 'Perro', // Valor por defecto
  breed: '',
});

// Cargar las mascotas cuando el componente se monte
onMounted(() => {
  petStore.fetchPets();
});

// Función para cerrar sesión
const handleLogout = () => {
  userStore.logout();
  router.push({ name: 'Login' });
};

// Función para manejar el envío del formulario
const handleAddPet = async () => {
  if (!newPetForm.value.name || !newPetForm.value.species) {
    alert('Nombre y Especie son obligatorios.');
    return;
  }
  
  await petStore.createPet(newPetForm.value);
  
  // Limpiar formulario y cerrar modal
  newPetForm.value = { name: '', species: 'Perro', breed: '' };
  showAddModal.value = false;
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    
    <header class="bg-white shadow-md">
      <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-indigo-600">
          🐾 PetAgenda
        </h1>
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

    <main class="container mx-auto px-6 py-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-semibold text-gray-800">
          Mis Mascotas
        </h2>
        <button
          @click="showAddModal = true"
          class="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          + Añadir Mascota
        </button>
      </div>

      <div v-if="petStore.isLoading" class="text-center text-gray-600">
        Cargando mascotas...
      </div>
      
      <div v-else-if="petStore.pets.length === 0" class="bg-white p-6 rounded-lg shadow text-center text-gray-500">
        No tienes mascotas registradas. ¡Añade una!
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="pet in petStore.pets" 
          :key="pet.id" 
          class="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
        >
          <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-900">{{ pet.name }}</h3>
            <p class="text-indigo-500 font-medium">{{ pet.species }}</p>
            <p class="text-gray-600">{{ pet.breed }}</p>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
        <h3 class="text-2xl font-bold mb-6 text-gray-800">Nueva Mascota</h3>
        
        <form @submit.prevent="handleAddPet" class="space-y-4">
          <div>
            <label for="petName" class="block text-sm font-medium text-gray-700">Nombre</label>
            <input v-model="newPetForm.name" id="petName" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          
          <div>
            <label for="petSpecies" class="block text-sm font-medium text-gray-700">Especie</label>
            <select v-model="newPetForm.species" id="petSpecies" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option>Perro</option>
              <option>Gato</option>
              <option>Conejo</option>
              <option>Otro</option>
            </select>
          </div>

          <div>
            <label for="petBreed" class="block text-sm font-medium text-gray-700">Raza (Opcional)</label>
            <input v-model="newPetForm.breed" id="petBreed" type="text" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          
          <div class="flex justify-end space-x-4 pt-4">
            <button 
              type="button" 
              @click="showAddModal = false"
              class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              :disabled="petStore.isLoading"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400"
            >
              {{ petStore.isLoading ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>