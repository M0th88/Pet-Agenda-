<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/UserStore.js';
import { useAdminStore } from '@/store/AdminStore.js';

const router = useRouter();
const userStore = useUserStore();
const adminStore = useAdminStore();

// --- Estados de Modales ---
const showAddClientModal = ref(false);
const newClientForm = ref({ name: '', email: '', password: '' });

const showAddPetModal = ref(false);
const currentClientId = ref(null);
const newPetForm = ref({ name: '', species: 'Perro', breed: '' });

const showEditClientModal = ref(false);
const editingClient = ref({ id: null, name: '', email: '' });

const showEditPetModal = ref(false);
const editingPet = ref({ id: null, userId: null, name: '', species: '', breed: '' });

// Helper visual para avatares
const getInitials = (name) => {
  return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'CL';
};

onMounted(() => {
  adminStore.fetchAllData();
});

const handleLogout = () => {
  userStore.logout();
  router.push({ name: 'Login' });
};

// --- Acciones de Cliente ---
const handleAddClient = async () => {
  if (!newClientForm.value.name || !newClientForm.value.email || !newClientForm.value.password) {
    adminStore.error = 'Todos los campos son obligatorios.';
    return;
  };
  try {
    await adminStore.createClient(newClientForm.value);
    showAddClientModal.value = false;
    newClientForm.value = { name: '', email: '', password: '' };
  } catch (error) {
    console.error(error);
  }
};

const openEditModal = (client) => {
  editingClient.value = { id: client.id, name: client.name, email: client.email };
  adminStore.error = null;
  showEditClientModal.value = true;
};

const handleUpdateClient = async () => {
  if (!editingClient.value.id) return;
  try {
    const success = await adminStore.updateClient(editingClient.value.id, {
      name: editingClient.value.name,
      email: editingClient.value.email
    });
    if (success) showEditClientModal.value = false;
  } catch (error) { console.error(error); }
};

const handleDeleteClient = async (clientId) => {
  if (window.confirm('¿Eliminar cliente y todas sus mascotas asociadas?')) {
    try { await adminStore.deleteClient(clientId); } catch (error) { alert(error.message); }
  }
};

// --- Acciones de Mascota ---
const openAddPetModal = (clientId) => {
  adminStore.error = null;
  currentClientId.value = clientId;
  newPetForm.value = { name: '', species: 'Perro', breed: '' };
  showAddPetModal.value = true;
};

const handleAddPet = async () => {
  if (!newPetForm.value.name || !currentClientId.value) return;
  try {
    await adminStore.createPetForClient(newPetForm.value, currentClientId.value);
    showAddPetModal.value = false;
    currentClientId.value = null;
  } catch (error) { console.error(error); }
};

const openEditPetModal = (pet) => {
  editingPet.value = { ...pet, id: parseInt(pet.id, 10) };
  adminStore.error = null;
  showEditPetModal.value = true;
};

const handleUpdatePet = async () => {
  if (!editingPet.value.id) return;
  try {
    const success = await adminStore.updatePet(parseInt(editingPet.value.id), {
      name: editingPet.value.name,
      species: editingPet.value.species,
      breed: editingPet.value.breed
    });
    if (success) showEditPetModal.value = false;
  } catch (error) { console.error(error); }
};

const handleDeletePet = async (petId, clientId) => {
  if (window.confirm('¿Eliminar permanentemente a esta mascota?')) {
    try { await adminStore.deletePet(parseInt(petId), parseInt(clientId)); } catch (err) { alert(err.message); }
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col">
    
    <header class="bg-slate-900 text-white shadow-sm sticky top-0 z-40">
      <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
        <router-link :to="{ name: 'AdminDashboard' }" class="flex items-center gap-3 group">
          <div class="bg-indigo-500 p-2 rounded-full group-hover:bg-indigo-400 transition shadow-lg shadow-indigo-500/30">
            <span class="text-xl">🐾</span>
          </div>
          <div class="leading-tight">
            <h1 class="text-lg font-extrabold tracking-wider text-indigo-100">VET MANAGER</h1>
            <span class="text-[10px] text-slate-400 uppercase font-semibold tracking-widest">Panel Administrativo</span>
          </div>
        </router-link>
        
        <div class="flex items-center gap-4">
          <div class="hidden md:block text-right">
            <p class="text-sm font-bold text-white">{{ userStore.user?.name || 'Administrador' }}</p>
            <p class="text-xs text-indigo-300">Sesión Activa</p>
          </div>
          <button 
            @click="handleLogout"
            class="text-xs font-bold bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition border border-slate-700"
          >
            Salir
          </button>
        </div>
      </nav>
    </header>

    <div class="bg-indigo-600 text-white py-8 shadow-xl relative overflow-hidden">
      <div class="absolute top-0 right-0 opacity-10 text-9xl transform translate-x-10 -translate-y-10 pointer-events-none">🐾</div>
      <div class="absolute bottom-0 left-10 opacity-10 text-8xl transform -translate-x-10 translate-y-10 pointer-events-none">🦴</div>

      <div class="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 class="text-3xl font-bold text-white">Base de Datos Veterinaria</h2>
          <p class="text-indigo-100 mt-1 text-sm font-medium">Administra dueños, mascotas e historiales clínicos.</p>
        </div>
        <button
          @click="showAddClientModal = true; adminStore.error = null;"
          class="flex items-center gap-2 bg-amber-400 text-amber-950 px-6 py-3 rounded-xl font-bold shadow-lg shadow-amber-900/20 hover:bg-amber-300 hover:scale-105 transition-all duration-200"
        >
          <span class="text-xl">👤</span>
          <span>Registrar Cliente</span>
        </button>
      </div>
    </div>

    <main class="flex-grow container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
      
      <div v-if="adminStore.error && !adminStore.isLoading && !showAddClientModal" 
           class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 shadow-sm rounded-r-lg flex items-center animate-pulse">
        <span class="text-2xl mr-3">⚠️</span>
        <div>
          <p class="font-bold">Error del Sistema</p>
          <p class="text-sm">{{ adminStore.error }}</p>
        </div>
      </div>

      <div v-if="adminStore.isLoading && adminStore.users.length === 0" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-14 w-14 border-4 border-indigo-500 border-t-transparent mb-4"></div>
        <p class="text-indigo-900 font-bold text-lg">Cargando registros...</p>
      </div>
      
      <div class="space-y-8">
        
        <div v-if="!adminStore.isLoading && adminStore.usersWithPets.length === 0" 
             class="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-16 text-center">
          <div class="inline-block p-6 bg-slate-50 rounded-full mb-4">
            <span class="text-5xl grayscale opacity-50">🐕</span>
          </div>
          <h3 class="text-2xl font-bold text-slate-700">Sin registros</h3>
          <p class="text-slate-500 mt-2">No hay clientes registrados en el sistema.</p>
        </div>
        
        <div 
          v-for="client in adminStore.usersWithPets" 
          :key="client.id"
          class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
        >
          <div class="bg-slate-50 px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="flex items-center gap-4 w-full">
              <div class="h-14 w-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-indigo-200">
                {{ getInitials(client.name) }}
              </div>
              <div class="flex-grow">
                <h3 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                  {{ client.name }}
                  <span class="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wide">Dueño</span>
                </h3>
                <div class="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-1">
                  <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    {{ client.email }}
                  </span>
                  <span class="hidden sm:inline text-slate-300">|</span>
                  <span class="text-slate-400 text-xs font-mono">
                    ID: #{{ client.id }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-3 text-sm">
              <button @click="openEditModal(client)" class="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition">
                Editar
              </button>
              <button @click="handleDeleteClient(client.id)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Eliminar Cliente">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
          
          <div class="p-6 bg-white">
            <div class="flex justify-between items-end mb-6 border-b border-slate-100 pb-4">
              <div>
                <h4 class="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  Mascotas Registradas
                  <span class="bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-md text-xs">{{ client.pets.length }}</span>
                </h4>
                <p class="text-xs text-slate-400 mt-1">Animales asociados a este dueño</p>
              </div>
              <button
                @click="openAddPetModal(client.id)"
                class="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
              >
                <span>+</span> Añadir Mascota
              </button>
            </div>
            
            <div v-if="client.pets.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              
              <div 
                v-for="pet in client.pets" 
                :key="pet.id"
                class="group relative overflow-hidden bg-white rounded-xl border-2 border-slate-100 hover:border-amber-300 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                @click="router.push({ name: 'AdminPetDetail', params: { id: pet.id } })"
              >
                <div class="h-2 w-full bg-gradient-to-r from-amber-300 to-orange-400"></div>
                
                <div class="p-4 flex items-start gap-4">
                  <div class="w-12 h-12 rounded-full bg-orange-50 text-2xl flex items-center justify-center border border-orange-100 flex-shrink-0">
                    <span v-if="pet.species === 'Perro'">🐶</span>
                    <span v-else-if="pet.species === 'Gato'">🐱</span>
                    <span v-else-if="pet.species === 'Conejo'">🐰</span>
                    <span v-else-if="pet.species === 'Ave'">🐦</span>
                    <span v-else>🐾</span>
                  </div>
                  
                  <div class="min-w-0">
                    <p class="font-bold text-slate-800 text-lg truncate leading-tight">{{ pet.name }}</p>
                    <p class="text-xs font-bold text-indigo-500 uppercase tracking-wider mt-0.5">{{ pet.species }}</p>
                    <p v-if="pet.breed" class="text-xs text-slate-500 truncate mt-1">{{ pet.breed }}</p>
                  </div>
                </div>

                <div class="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                  <button 
                    @click.stop="openEditPetModal(pet)" 
                    class="p-1.5 bg-white text-indigo-600 rounded-md shadow border border-slate-100 hover:bg-indigo-50" title="Editar"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button 
                    @click.stop="handleDeletePet(pet.id, client.id)" 
                    class="p-1.5 bg-white text-red-600 rounded-md shadow border border-slate-100 hover:bg-red-50" title="Borrar"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <span class="text-2xl block mb-2 opacity-30">🦴</span>
              <span class="text-sm text-slate-400 font-medium">Este cliente no tiene mascotas registradas aún.</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showAddClientModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" @click="showAddClientModal = false"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 border border-slate-100">
        <div class="bg-indigo-600 px-6 py-4 border-b border-indigo-700">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <span>👤</span> Registrar Nuevo Cliente
          </h3>
        </div>
        <form @submit.prevent="handleAddClient" class="p-6 space-y-5">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre Completo</label>
            <input v-model="newClientForm.name" type="text" required class="input-field bg-slate-50 border-slate-200 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Ej. María González">
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Correo Electrónico</label>
            <input v-model="newClientForm.email" type="email" required class="input-field bg-slate-50 border-slate-200 focus:ring-indigo-500 focus:border-indigo-500" placeholder="maria@ejemplo.com">
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Contraseña</label>
            <input v-model="newClientForm.password" type="password" required class="input-field bg-slate-50 border-slate-200 focus:ring-indigo-500 focus:border-indigo-500" placeholder="••••••••">
          </div>
          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="showAddClientModal = false" class="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition">CANCELAR</button>
            <button type="submit" :disabled="adminStore.isLoading" class="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg shadow-indigo-500/30 transition">GUARDAR CLIENTE</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showEditClientModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" @click="showEditClientModal = false"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="bg-slate-800 px-6 py-4 border-b border-slate-700">
          <h3 class="text-lg font-bold text-white">Editar Datos Cliente</h3>
        </div>
        <form @submit.prevent="handleUpdateClient" class="p-6 space-y-5">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre</label>
            <input v-model="editingClient.name" type="text" required class="input-field bg-slate-50">
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
            <input v-model="editingClient.email" type="email" required class="input-field bg-slate-50">
          </div>
          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="showEditClientModal = false" class="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg">CANCELAR</button>
            <button type="submit" class="px-6 py-2 text-sm font-bold text-white bg-slate-800 hover:bg-black rounded-lg shadow-lg transition">ACTUALIZAR</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showAddPetModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" @click="showAddPetModal = false"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="bg-amber-500 px-6 py-4 border-b border-amber-600">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <span>🐾</span> Nueva Mascota
          </h3>
        </div>
        <form @submit.prevent="handleAddPet" class="p-6 space-y-5">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre de la Mascota</label>
            <input v-model="newPetForm.name" type="text" required class="input-field bg-slate-50" placeholder="Ej. Firulais">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Especie</label>
              <select v-model="newPetForm.species" class="input-field bg-slate-50">
                <option>Perro</option>
                <option>Gato</option>
                <option>Conejo</option>
                <option>Ave</option>
                <option>Otro</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Raza</label>
              <input v-model="newPetForm.breed" type="text" class="input-field bg-slate-50" placeholder="Opcional">
            </div>
          </div>
          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="showAddPetModal = false" class="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg">CANCELAR</button>
            <button type="submit" class="px-6 py-2 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-lg shadow-amber-500/30 transition">AGREGAR MASCOTA</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showEditPetModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" @click="showEditPetModal = false"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="bg-amber-500 px-6 py-4 border-b border-amber-600">
          <h3 class="text-lg font-bold text-white">Editar Mascota</h3>
        </div>
        <form @submit.prevent="handleUpdatePet" class="p-6 space-y-5">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre</label>
            <input v-model="editingPet.name" type="text" required class="input-field bg-slate-50">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Especie</label>
              <select v-model="editingPet.species" class="input-field bg-slate-50">
                <option>Perro</option>
                <option>Gato</option>
                <option>Conejo</option>
                <option>Ave</option>
                <option>Otro</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Raza</label>
              <input v-model="editingPet.breed" type="text" class="input-field bg-slate-50">
            </div>
          </div>
          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="showEditPetModal = false" class="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg">CANCELAR</button>
            <button type="submit" class="px-6 py-2 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-lg transition">GUARDAR CAMBIOS</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>