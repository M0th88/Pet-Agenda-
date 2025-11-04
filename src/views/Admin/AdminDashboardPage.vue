<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/UserStore.js';
import { useAdminStore } from '@/store/AdminStore.js'; // <-- ¡Usa el AdminStore!

const router = useRouter();
const userStore = useUserStore();
const adminStore = useAdminStore(); // <-- ¡Usa el AdminStore!

// --- Lógica para modal de "Añadir Cliente" ---
const showAddClientModal = ref(false);
const newClientForm = ref({ name: '', email: '' });

// --- Lógica para modal de "Añadir Mascota" ---
const showAddPetModal = ref(false);
const currentClientId = ref(null);
const newPetForm = ref({ name: '', species: 'Perro', breed: '' });

// --- Lógica para modal "Editar Cliente" ---
const showEditClientModal = ref(false);
const editingClient = ref({ id: null, name: '', email: '' });


onMounted(() => {
  // --- ¡LLAMA A LA ACCIÓN CORRECTA! ---
  adminStore.fetchAllData();
});

const handleLogout = () => {
  userStore.logout();
  router.push({ name: 'Login' });
};

// --- (Función para añadir cliente) ---
const handleAddClient = async () => {
  if (!newClientForm.value.name || !newClientForm.value.email) return;
  await adminStore.createClient(newClientForm.value);
  if (!adminStore.error) {
    showAddClientModal.value = false;
    newClientForm.value = { name: '', email: '' };
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
  <div class="min-h-screen bg-gray-200">
    
    <header class="bg-white shadow-md">
      <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-red-600">
            PANEL DE ADMINISTRACIÓN
          </h1>
          <router-link 
            :to="{ name: 'Dashboard' }"
            class="text-sm text-indigo-600 hover:underline"
          >
            &larr; Volver a la vista de usuario
          </router-link>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-gray-700">
            Admin: {{ userStore.user?.name }}
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
          Gestión de Clientes
        </h2>
        <button
          @click="showAddClientModal = true; adminStore.error = null;"
          class="px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          + Registrar Nuevo Cliente
        </button>
      </div>

      <div v-if="adminStore.error && !adminStore.isLoading" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong class="font-bold">Error: </strong>
        <span class="block sm:inline">{{ adminStore.error }}</span>
      </div>

      <div v-if="adminStore.isLoading && adminStore.users.length === 0" class="text-center text-gray-600">
        Cargando datos...
      </div>
      
      <div v-else class="space-y-6">
        
        <div v-if="adminStore.usersWithPets.length === 0" class="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          No hay clientes registrados.
        </div>
        
        <div 
          v-for="client in adminStore.usersWithPets" 
          :key="client.id"
          class="bg-white p-6 rounded-lg shadow-lg"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-2xl font-bold text-gray-900">{{ client.name }}</h3>
              <p class="text-gray-600">{{ client.email }}</p>
              <p class="text-sm text-gray-500">ID Cliente: {{ client.id }}</p>
            </div>
            <div class="flex space-x-2">
              <button @click="openEditModal(client)" class="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Editar</button>
              <button @click="handleDeleteClient(client.id)" class="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Eliminar</button>
            </div>
          </div>
          
          <hr class="my-4">
          
          <div class="flex justify-between items-center mb-2">
            <h4 class="text-lg font-semibold text-indigo-700">Mascotas Registradas:</h4>
            <button
              @click="openAddPetModal(client.id)"
              class="px-3 py-1 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition text-sm"
            >
              + Añadir Mascota
            </button>
          </div>
          
          <div v-if="client.pets.length === 0" class="text-gray-500 italic">
            Este cliente no tiene mascotas registradas.
          </div>
          <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <router-link 
              v-for="pet in client.pets" 
              :key="pet.id" 
              :to="{ name: 'AdminPetDetail', params: { id: pet.id } }"
              class="block bg-gray-100 p-4 rounded-md border border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 transition"
            >
              <p class="font-bold text-gray-800">{{ pet.name }}</p>
              <p class="text-sm">{{ pet.species }}</p>
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showAddClientModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
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

    <div v-if="showEditClientModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
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

    <div v-if="showAddPetModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
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