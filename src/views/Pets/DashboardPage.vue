<script setup>
// Se quitó 'ref' porque ya no se usa para el modal
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
// Usamos los alias que ya configuraste (¡recuerda añadir .js!)
import { useUserStore } from '@/store/UserStore.js'; 
import { usePetStore } from '@/store/PetStore.js'; 

const router = useRouter();
const userStore = useUserStore();
const petStore = usePetStore();

// --- LÓGICA DEL MODAL Y FORMULARIO ELIMINADA ---
// const showAddModal = ref(false);
// const newPetForm = ref({ ... });

// Cargar las mascotas cuando el componente se monte
onMounted(() => {
  petStore.fetchPets();
});

// Función para cerrar sesión
const handleLogout = () => {
  userStore.logout();
  router.push({ name: 'Login' });
};

// --- FUNCIÓN handleAddPet ELIMINADA ---
// const handleAddPet = async () => { ... };
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    
    <header class="bg-white shadow-md">
      <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-indigo-600">
          🐾 PetAgenda
        </h1>
        <div class="flex items-center space-x-4">
          
          <router-link
            v-if="userStore.isAdmin"
            :to="{ name: 'AdminDashboard' }"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold"
          >
            Panel Admin
          </router-link>

          <span class="text-gray-700">
            Hola, {{ userStore.user?.name || 'Usuario' }}
          </span>
          <button 
            @click="handleLogout"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
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
        
        </div>

      <div v-if="petStore.isLoading" class="text-center text-gray-600">
        Cargando mascotas...
      </div>
      
      <div v-else-if="petStore.pets.length === 0" class="bg-white p-6 rounded-lg shadow text-center text-gray-500">
        No tienes mascotas registradas.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link 
          v-for="pet in petStore.pets" 
          :key="pet.id" 
          :to="{ name: 'PetDetail', params: { id: pet.id } }"
          class="block bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
        >
          <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-900">{{ pet.name }}</h3>
            <p class="text-indigo-500 font-medium">{{ pet.species }}</p>
            <p class="text-gray-600">{{ pet.breed }}</p>
          </div>
        </router-link>
      </div>
    </main>

    </div>
</template>