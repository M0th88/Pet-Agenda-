<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePetStore } from '@/store/PetStore.js';
import { useUserStore } from '@/store/UserStore.js';

const route = useRoute();
const router = useRouter();
const petStore = usePetStore();
const userStore = useUserStore();

// Obtenemos el ID de la mascota desde la URL
const petId = route.params.id;

// Cargamos los datos de la mascota (¡ahora esto trae todo!)
onMounted(() => {
  petStore.fetchPetById(petId);
});

const handleLogout = () => {
  userStore.logout();
  router.push({ name: 'Login' });
};

// Helper para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no especificada';
  try {
    return new Date(dateString).toLocaleString('es-CL', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'UTC' // Ajusta si es necesario
    });
  } catch (e) {
    return dateString;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    
    <header class="bg-white shadow-md">
      <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
        <router-link :to="{ name: 'Dashboard' }" class="text-2xl font-bold text-indigo-600 hover:text-indigo-800">
          &larr; 🐾 Mis Mascotas
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

    <main class="container mx-auto px-6 py-8">
      
      <div v-if="petStore.isLoading" class="text-center text-gray-600 text-xl">
        Cargando datos de la mascota...
      </div>

      <div v-else-if="petStore.error" class="bg-white p-6 rounded-lg shadow text-center text-red-600">
        {{ petStore.error }}
      </div>

      <div v-else-if="petStore.selectedPet" class="space-y-8">
        
        <div class="bg-white p-8 rounded-lg shadow-xl">
          <h2 class="text-4xl font-bold text-gray-900 mb-2">
            {{ petStore.selectedPet.name }}
          </h2>
          <p class="text-2xl text-indigo-600 font-medium mb-4">
            {{ petStore.selectedPet.species }}
          </p>
          <p class="text-lg text-gray-700">
            <strong>Raza:</strong> {{ petStore.selectedPet.breed || 'No especificada' }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="text-2xl font-semibold mb-4 text-gray-800">Próximas Citas</h3>
            <div class="space-y-4">
              <div v-if="!petStore.selectedPet.appointments || petStore.selectedPet.appointments.length === 0" class="text-gray-500 italic">
                No hay citas agendadas.
              </div>
              <div v-else v-for="app in petStore.selectedPet.appointments" :key="app.id" class="p-4 border rounded-lg bg-gray-50">
                <p><strong>Fecha:</strong> {{ formatDate(app.date) }}</p>
                <p><strong>Motivo:</strong> {{ app.reason }}</p>
                <p><strong>Estado:</strong> 
                  <span :class="app.status === 'Pendiente' ? 'text-yellow-600' : 'text-green-600'" class="font-medium">
                    {{ app.status }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="text-2xl font-semibold mb-4 text-gray-800">Historial Médico</h3>
            <div class="space-y-4">
              <div v-if="!petStore.selectedPet.records || petStore.selectedPet.records.length === 0" class="text-gray-500 italic">
                No hay historial médico.
              </div>
              <div v-else v-for="rec in petStore.selectedPet.records" :key="rec.id" class="p-4 border rounded-lg bg-gray-50">
                <p><strong>Fecha:</strong> {{ new Date(rec.date).toLocaleDateString('es-CL', { timeZone: 'UTC' }) }}</p>
                <p><strong>Tipo:</strong> 
                  <span class="font-medium" :class="rec.type === 'Vacuna' ? 'text-green-600' : 'text-blue-600'">
                    {{ rec.type }}
                  </span>
                </p>
                <p><strong>Descripción:</strong> {{ rec.name }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>