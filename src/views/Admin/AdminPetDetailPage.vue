<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminStore } from '@/store/AdminStore.js';
import { useUserStore } from '@/store/UserStore.js';

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();
const userStore = useUserStore();

const petId = route.params.id;

// Formularios para añadir nuevos registros
const newAppointmentForm = ref({ date: '', reason: '' });
const newRecordForm = ref({ type: 'Vacuna', name: '', date: '' });
const showAppointmentModal = ref(false);
const showRecordModal = ref(false);

onMounted(() => {
  adminStore.fetchAdminPetDetails(petId);
});

const handleAddAppointment = async () => {
  await adminStore.addAppointment(newAppointmentForm.value);
  if (!adminStore.error) {
    newAppointmentForm.value = { date: '', reason: '' };
    showAppointmentModal.value = false;
  }
};

const handleAddRecord = async () => {
  await adminStore.addMedicalRecord(newRecordForm.value);
  if (!adminStore.error) {
    newRecordForm.value = { type: 'Vacuna', name: '', date: '' };
    showRecordModal.value = false;
  }
};

const handleLogout = () => {
  userStore.logout();
  router.push({ name: 'Login' });
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    
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
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>
    </header>
    <main class="container mx-auto px-6 py-8">
      
      <router-link :to="{ name: 'AdminDashboard' }" class="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
        &larr; Volver a Gestión de Clientes
      </router-link>

      <div v-if="adminStore.error && !adminStore.isLoading" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong class="font-bold">Error: </strong>
        <span class="block sm:inline">{{ adminStore.error }}</span>
      </div>
      
      <div v-if="adminStore.isLoading && !adminStore.selectedPetDetails" class="text-center text-gray-600 text-xl py-12">
        Cargando datos de la mascota...
      </div>

      <div v-else-if="adminStore.selectedPetDetails" class="space-y-8">
        <div class="bg-white p-8 rounded-lg shadow-xl">
          <h2 class="text-4xl font-bold text-gray-900 mb-2">
            {{ adminStore.selectedPetDetails.pet.name }}
          </h2>
          <p class="text-2xl text-indigo-600 font-medium mb-4">
            {{ adminStore.selectedPetDetails.pet.species }} ({{ adminStore.selectedPetDetails.pet.breed }})
          </p>
          <p class="text-lg text-gray-700">
            <strong>Dueño:</strong> {{ adminStore.selectedPetDetails.owner.name }} ({{ adminStore.selectedPetDetails.owner.email }})
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-2xl font-semibold text-gray-800">Próximas Citas</h3>
              <button @click="showAppointmentModal = true" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">+ Agendar Cita</button>
            </div>
            <div class="space-y-3">
              <div v-if="!adminStore.selectedPetDetails.appointments || adminStore.selectedPetDetails.appointments.length === 0" class="text-gray-500 italic">No hay citas agendadas.</div>
              <div v-for="app in adminStore.selectedPetDetails.appointments" :key="app.id" class="p-4 border rounded-lg bg-gray-50">
                <p><strong>Fecha:</strong> {{ new Date(app.date).toLocaleString('es-CL', { timeZone: 'UTC' }) }}</p>
                <p><strong>Motivo:</strong> {{ app.reason }}</p>
                <p><strong>Estado:</strong> {{ app.status }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-lg">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-2xl font-semibold text-gray-800">Historial Médico</h3>
              <button @click="showRecordModal = true" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">+ Añadir Registro</button>
            </div>
            <div class="space-y-3">
              <div v-if="!adminStore.selectedPetDetails.records || adminStore.selectedPetDetails.records.length === 0" class="text-gray-500 italic">No hay historial médico.</div>
              <div v-for="rec in adminStore.selectedPetDetails.records" :key="rec.id" class="p-4 border rounded-lg bg-gray-50">
                <p><strong>Fecha:</strong> {{ new Date(rec.date).toLocaleDateString('es-CL', { timeZone: 'UTC' }) }}</p>
                <p><strong>Tipo:</strong> <span class="font-medium" :class="rec.type === 'Vacuna' ? 'text-green-600' : 'text-blue-600'">{{ rec.type }}</span></p>
                <p><strong>Nombre:</strong> {{ rec.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showAppointmentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
        <h3 class="text-2xl font-bold mb-6">Agendar Nueva Cita</h3>
        <form @submit.prevent="handleAddAppointment" class="space-y-4">
          <div>
            <label class="block text-sm font-medium">Fecha y Hora</label>
            <input v-model="newAppointmentForm.date" type="datetime-local" required class="mt-1 block w-full input-field">
          </div>
          <div>
            <label class="block text-sm font-medium">Motivo</label>
            <input v-model="newAppointmentForm.reason" type="text" required class="mt-1 block w-full input-field">
          </div>
          <div v-if="adminStore.error && !adminStore.isLoading" class="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {{ adminStore.error }}
          </div>
          <div class="flex justify-end space-x-4 pt-4">
            <button type="button" @click="showAppointmentModal = false" class="btn-secondary">Cancelar</button>
            <button type="submit" :disabled="adminStore.isLoading" class="btn-primary-green">
              {{ adminStore.isLoading ? '...' : 'Guardar Cita' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showRecordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
        <h3 class="text-2xl font-bold mb-6">Añadir Registro Médico</h3>
        <form @submit.prevent="handleAddRecord" class="space-y-4">
          <div>
            <label class="block text-sm font-medium">Fecha</label>
            <input v-model="newRecordForm.date" type="date" required class="mt-1 block w-full input-field">
          </div>
          <div>
            <label class="block text-sm font-medium">Tipo</label>
            <select v-model="newRecordForm.type" class="mt-1 block w-full input-field">
              <option>Vacuna</option>
              <option>Tratamiento</option>
              <option>Cirugía</option>
              <option>Observación</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium">Nombre / Descripción</label>
            <input v-model="newRecordForm.name" type="text" required class="mt-1 block w-full input-field">
          </div>
           <div v-if="adminStore.error && !adminStore.isLoading" class="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {{ adminStore.error }}
          </div>
          <div class="flex justify-end space-x-4 pt-4">
            <button type="button" @click="showRecordModal = false" class="btn-secondary">Cancelar</button>
            <button type="submit" :disabled="adminStore.isLoading" class="btn-primary-blue">
              {{ adminStore.isLoading ? '...' : 'Guardar Registro' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>