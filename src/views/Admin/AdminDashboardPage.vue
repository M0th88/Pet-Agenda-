<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/UserStore.js';
import { useAdminStore } from '@/store/AdminStore.js';

const router = useRouter();
const userStore = useUserStore();
const adminStore = useAdminStore();

// --- Lógica para modal "Añadir Cliente" ---
const showAddClientModal = ref(false);
const newClientForm = ref({ name: '', email: '', password: '' });

// --- Lógica para modal "Añadir Mascota" ---
const showAddPetModal = ref(false);
const currentClientId = ref(null);
const newPetForm = ref({ name: '', species: 'Perro', breed: '' });

// --- Lógica para modal "Editar Cliente" ---
const showEditClientModal = ref(false);
const editingClient = ref({ id: null, name: '', email: '' });


onMounted(() => {
  adminStore.fetchAllData();
});

const handleLogout = () => {
  userStore.logout();
  router.push({ name: 'Login' });
};

// --- (Función para añadir cliente) ---
const handleAddClient = async () => {
  if (!newClientForm.value.name || !newClientForm.value.email || !newClientForm.value.password) {
    adminStore.error = 'Nombre, email y contraseña son obligatorios.';
    return;
  };
  
  await adminStore.createClient(newClientForm.value);
  
  if (!adminStore.error) {
    showAddClientModal.value = false;
    newClientForm.value = { name: '', email: '', password: '' };
  }
};

// --- (Función para abrir modal de mascota) ---
const openAddPetModal = (clientId) => {
  currentClientId.value = clientId;
  newPetForm.value = { name: '', species: 'Perro', breed: '' };
  showAddPetModal.value = true;
};

// --- (Función para añadir mascota) ---
const handleAddPet = async () => {
  if (!newPetForm.value.name || !currentClientId.value) return;
  await adminStore.createPetForClient(newPetForm.value, currentClientId.value);
  if (!adminStore.error) {
    showAddPetModal.value = false;
    currentClientId.value = null;
  }
};

// --- (Función para abrir modal de edición) ---
const openEditModal = (client) => {
  editingClient.value = { id: client.id, name: client.name, email: client.email };
  adminStore.error = null;
  showEditClientModal.value = true;
};

// --- (Función para guardar edición) ---
const handleUpdateClient = async () => {
  if (!editingClient.value.id || !editingClient.value.name || !editingClient.value.email) {
    return;
  }
  
  const success = await adminStore.updateClient(editingClient.value.id, {
    name: editingClient.value.name,
    email: editingClient.value.email
  });

  if (success) {
    showEditClientModal.value = false;
    editingClient.value = { id: null, name: '', email: '' };
  }
};

// --- (Función para eliminar) ---
const handleDeleteClient = async (clientId) => {
  if (window.confirm('¿Estás seguro de que quieres eliminar este cliente? Esta acción también eliminará TODAS sus mascotas y citas asociadas.')) {
    await adminStore.deleteClient(clientId);
  }
};

</script>

<template>
  <div class="min-h-screen bg-slate-100">
    
    <header class="bg-gray-800 text-white shadow-lg">
      <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
        <router-link :to="{ name: 'AdminDashboard' }" class="text-2xl font-bold flex items-center space-x-2 hover:text-gray-300 transition">
          <span role="img" aria-label="Escudo">🛡️</span>
          <h1>Panel de Administración</h1>
        </router-link>
        
        <div class="flex items-center space-x-4">
          <span class="text-gray-300 hidden sm:inline">
            {{ userStore.user?.name || 'Admin' }}
          </span>
          <button 
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm shadow hover:shadow-md"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>
    </header>
    <main class="container mx-auto px-6 py-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-4xl font-bold text-gray-700">
          Gestión de Clientes
        </h2>
        <button
          @click="showAddClientModal = true; adminStore.error = null;"
          class="flex items-center space-x-2 px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <span>Registrar Cliente</span>
        </button>
      </div>

      <div v-if="adminStore.error && !adminStore.isLoading" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
        <p class="font-bold">Error</p>
        <p>{{ adminStore.error }}</p>
      </div>

      <div v-if="adminStore.isLoading && adminStore.users.length === 0" class="text-center text-gray-600 py-12">
        <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-4 text-lg">Cargando datos...</p>
      </div>
      
      <div v-else class="space-y-6">
        
        <div v-if="adminStore.usersWithPets.length === 0" class="bg-white p-12 rounded-lg shadow-md text-center text-gray-500">
          <svg class="mx-auto h-16 w-16 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 00-12.728 0m12.728 0A9.094 9.094 0 0118 18.72zm-1.636-1.636a9.094 9.094 0 01-1.636-1.636m1.636 1.636a9.094 9.094 0 001.636-1.636m-1.636 1.636a9.094 9.094 0 01-1.636-1.636M6.728 18.72a9.094 9.094 0 010-12.728m0 12.728A9.094 9.094 0 006.728 18.72zm-1.636-1.636a9.094 9.094 0 00-1.636-1.636m1.636 1.636a9.094 9.094 0 01-1.636-1.636m1.636 1.636A9.094 9.094 0 005.092 15.45M12 12a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
          <h3 class="mt-4 text-xl font-medium text-gray-900">No hay clientes</h3>
          <p class="mt-1 text-base text-gray-500">Empieza por registrar un nuevo cliente usando el botón verde.</p>
        </div>
        
        <div 
          v-for="client in adminStore.usersWithPets" 
          :key="client.id"
          class="bg-white p-6 rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-2xl font-bold text-gray-900">{{ client.name }}</h3>
              <p class="text-gray-600">{{ client.email }}</p>
              <p class="text-sm text-gray-400 mt-1">ID Cliente: {{ client.id }}</p>
            </div>
            <div class="flex-shrink-0 flex space-x-2">
              <button @click="openEditModal(client)" class="text-sm px-4 py-2 font-medium bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-500 transition-all shadow-sm hover:shadow-md">Editar</button>
              <button @click="handleDeleteClient(client.id)" class="text-sm px-4 py-2 font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-sm hover:shadow-md">Eliminar</button>
            </div>
          </div>
          
          <hr class="my-4 border-gray-200">
          
          <div class="flex justify-between items-center mb-3">
            <h4 class="text-xl font-semibold text-indigo-800">Mascotas</h4>
            <button
              @click="openAddPetModal(client.id)"
              class="flex items-center space-x-1 px-3 py-1 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              <span>Añadir</span>
            </button>
          </div>
          
          <div v-if="client.pets.length === 0" class="text-gray-500 italic text-center py-4">
            Este cliente no tiene mascotas registradas.
          </div>
          
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <router-link 
              v-for="pet in client.pets" 
              :key="pet.id" 
              :to="{ name: 'AdminPetDetail', params: { id: pet.id } }"
              class="block bg-slate-50 p-4 rounded-lg border border-slate-200 hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200 ease-in-out cursor-pointer shadow-sm hover:shadow-md"
            >
              <p class="font-bold text-indigo-900 flex items-center">
                <span class="mr-2 text-lg">🐾</span>
                {{ pet.name }}
              </p>
              <p class="text-sm text-slate-600 pl-7">{{ pet.species }}<span v-if="pet.breed"> ({{ pet.breed }})</span></p>
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showAddClientModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">
        <h3 class="text-2xl font-bold mb-6 text-gray-800">Registrar Nuevo Cliente</h3>
        <form @submit.prevent="handleAddClient" class="space-y-4">
          <div>
            <label for="clientName" class="block text-sm font-medium text-gray-700">Nombre Completo</label>
            <input v-model="newClientForm.name" id="clientName" type="text" required class="mt-1 block w-full input-field">
          </div>
          <div>
            <label for="clientEmail" class="block text-sm font-medium text-gray-700">Email</label>
            <input v-model="newClientForm.email" id="clientEmail" type="email" required class="mt-1 block w-full input-field">
          </div>
          <div>
            <label for="clientPassword" class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input v-model="newClientForm.password" id="clientPassword" type="password" required class="mt-1 block w-full input-field">
          </div>
          
          <div v-if="adminStore.error && !adminStore.isLoading" class="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {{ adminStore.error }}
          </div>
          <div class="flex justify-end space-x-4 pt-4">
            <button type="button" @click="showAddClientModal = false" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" :disabled="adminStore.isLoading" class="btn-primary-green">
              {{ adminStore.isLoading ? 'Guardando...' : 'Guardar Cliente' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showEditClientModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">
        <h3 class="text-2xl font-bold mb-6 text-gray-800">Editar Cliente</h3>
        <form @submit.prevent="handleUpdateClient" class="space-y-4">
          <div>
            <label for="editClientName" class="block text-sm font-medium text-gray-700">Nombre Completo</label>
            <input v-model="editingClient.name" id="editClientName" type="text" required class="mt-1 block w-full input-field">
          </div>
          <div>
            <label for="editClientEmail" class="block text-sm font-medium text-gray-700">Email</label>
            <input v-model="editingClient.email" id="editClientEmail" type="email" required class="mt-1 block w-full input-field">
          </div>
          <div v-if="adminStore.error && !adminStore.isLoading" class="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {{ adminStore.error }}
          </div>
          <div class="flex justify-end space-x-4 pt-4">
            <button type="button" @click="showEditClientModal = false" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" :disabled="adminStore.isLoading" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition disabled:bg-yellow-300">
              {{ adminStore.isLoading ? 'Actualizando...' : 'Actualizar Cliente' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showAddPetModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">
        <h3 class="text-2xl font-bold mb-6 text-gray-800">Nueva Mascota</h3>
        <form @submit.prevent="handleAddPet" class="space-y-4">
          <div>
            <label for="petName" class="block text-sm font-medium text-gray-700">Nombre</label>
            <input v-model="newPetForm.name" id="petName" type="text" required class="mt-1 block w-full input-field">
          </div>
          <div>
            <label for="petSpecies" class="block text-sm font-medium text-gray-700">Especie</label>
            <select v-model="newPetForm.species" id="petSpecies" class="mt-1 block w-full input-field">
              <option>Perro</option>
              <option>Gato</option>
              <option>Conejo</option>
              <option>Otro</option>
            </select>
          </div>
          <div>
            <label for="petBreed" class="block text-sm font-medium text-gray-700">Raza (Opcional)</label>
            <input v-model="newPetForm.breed" id="petBreed" type="text" class="mt-1 block w-full input-field">
          </div>
          <div class="flex justify-end space-x-4 pt-4">
            <button type="button" @click="showAddPetModal = false" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" :disabled="adminStore.isLoading" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400">
              {{ adminStore.isLoading ? 'Guardando...' : 'Guardar Mascota' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>