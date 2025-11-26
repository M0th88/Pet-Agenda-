<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminStore } from '@/store/AdminStore.js';
import { useUserStore } from '@/store/UserStore.js';

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();
const userStore = useUserStore();

const petId = route.params.id;

// Formularios
const newAppointmentForm = ref({ date: '', reason: '' });
const newRecordForm = ref({ type: 'Vacuna', name: '', date: '' });
const showAppointmentModal = ref(false);
const showRecordModal = ref(false);

// Helper para iconos de especie
const petIcon = computed(() => {
  const species = adminStore.selectedPetDetails?.pet?.species || '';
  switch (species) {
    case 'Perro': return '🐶';
    case 'Gato': return '🐱';
    case 'Conejo': return '🐰';
    case 'Ave': return '🐦';
    default: return '🐾';
  }
});

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
</script>

<template>
  <div class="min-h-screen bg-[#F1EBE8] font-sans text-gray-800 flex flex-col">
    
    <div v-if="adminStore.isLoading && !adminStore.selectedPetDetails" class="flex-grow flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-[#EF6532] border-t-transparent mb-4"></div>
      <p class="text-[#B63101] font-bold text-xl">Cargando expediente...</p>
    </div>

    <template v-else-if="adminStore.selectedPetDetails">
      
      <div class="bg-[#EF6532] text-white shadow-xl relative overflow-hidden pt-8 pb-10">
        <div class="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <svg class="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
        </div>
        
        <div class="container mx-auto px-4 sm:px-6 relative z-10">
          <div class="absolute top-0 left-4 sm:left-6">
            <router-link :to="{ name: 'AdminDashboard' }" class="inline-flex items-center gap-2 text-white hover:text-gray-100 hover:bg-white/20 px-4 py-2 rounded-full transition text-sm font-bold uppercase tracking-wide border border-white/30 backdrop-blur-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Volver
            </router-link>
          </div>

          <div class="flex flex-col items-center text-center mt-4">
            <div class="relative">
              <div class="h-36 w-36 rounded-full bg-white text-7xl flex items-center justify-center shadow-2xl border-4 border-white mb-4 z-10 relative">
                {{ petIcon }}
              </div>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center justify-center gap-3">
                <h1 class="text-5xl font-extrabold text-white tracking-tight drop-shadow-md">{{ adminStore.selectedPetDetails.pet.name }}</h1>
                <span class="bg-[#B63101] text-white px-3 py-1 rounded-lg text-sm font-extrabold uppercase shadow-sm transform -rotate-2">
                  {{ adminStore.selectedPetDetails.pet.species }}
                </span>
              </div>
              <p class="text-white/90 text-2xl font-medium">{{ adminStore.selectedPetDetails.pet.breed }}</p>
              
              <div class="mt-6 inline-flex items-center bg-white/20 px-6 py-3 rounded-2xl border border-white/30 gap-4 backdrop-blur-sm hover:bg-white/30 transition cursor-default shadow-lg">
                <div class="h-10 w-10 rounded-full bg-white text-[#EF6532] flex items-center justify-center text-lg font-bold shadow-inner">
                  {{ adminStore.selectedPetDetails.owner.name.charAt(0).toUpperCase() }}
                </div>
                <div class="text-left">
                  <p class="text-[10px] text-white/80 uppercase font-bold tracking-widest">Propietario</p>
                  <p class="text-base font-bold text-white leading-none mb-0.5">{{ adminStore.selectedPetDetails.owner.name }}</p>
                  <p class="text-xs text-white/90 font-mono">{{ adminStore.selectedPetDetails.owner.email }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main class="container mx-auto px-4 sm:px-6 py-8 mt-8 relative z-20 max-w-6xl pb-20">
        
        <div v-if="adminStore.error" class="bg-red-100 border-l-4 border-red-600 text-red-800 p-4 mb-8 rounded-r-lg shadow-md flex items-center gap-3">
           <span class="text-2xl">🚨</span>
          <p class="font-bold">{{ adminStore.error }}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          <div class="bg-white rounded-2xl shadow-xl shadow-gray-200 border border-gray-100 overflow-hidden flex flex-col h-full transform transition-all hover:-translate-y-1 duration-300">
            <div class="px-6 py-5 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span class="text-2xl">📅</span> Próximas Citas
                </h3>
              </div>
              <button 
                @click="showAppointmentModal = true" 
                class="px-4 py-2 bg-[#B63101] text-white hover:bg-[#902701] rounded-xl text-xs font-bold uppercase tracking-wide transition shadow-md"
              >
                + Agendar
              </button>
            </div>
            
            <div class="p-6 flex-grow bg-white relative">
              <div class="absolute top-0 right-0 w-32 h-32 bg-[#F1EBE8] rounded-bl-full opacity-50 pointer-events-none"></div>

              <div v-if="!adminStore.selectedPetDetails.appointments || adminStore.selectedPetDetails.appointments.length === 0" 
                   class="h-full flex flex-col items-center justify-center text-center py-12 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                <span class="text-4xl mb-2 grayscale opacity-20">📆</span>
                <p class="font-medium">No hay citas programadas</p>
              </div>
              
              <div v-else class="space-y-4 relative z-10">
                <div 
                  v-for="app in adminStore.selectedPetDetails.appointments" 
                  :key="app.id" 
                  class="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#EF6532] transition group"
                >
                  <div class="flex gap-4 items-center">
                    <div class="bg-[#F1EBE8] text-[#B63101] font-bold rounded-lg p-3 text-center min-w-[60px]">
                      <span class="block text-xs uppercase">{{ new Date(app.date).toLocaleDateString('es-CL', { month: 'short' }) }}</span>
                      <span class="block text-xl">{{ new Date(app.date).toLocaleDateString('es-CL', { day: 'numeric' }) }}</span>
                    </div>
                    <div>
                      <p class="font-bold text-gray-800 group-hover:text-[#B63101] transition">{{ app.reason }}</p>
                      <p class="text-sm text-gray-500 flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {{ new Date(app.date).toLocaleTimeString('es-CL', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' }) }}
                      </p>
                    </div>
                  </div>
                  <span 
                    class="mt-3 sm:mt-0 px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider"
                    :class="app.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'"
                  >
                    {{ app.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-xl shadow-gray-200 border border-gray-100 overflow-hidden flex flex-col h-full transform transition-all hover:-translate-y-1 duration-300">
            <div class="px-6 py-5 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span class="text-2xl">📋</span> Historial Médico
                </h3>
              </div>
              <button 
                @click="showRecordModal = true" 
                class="px-4 py-2 bg-[#B63101] text-white hover:bg-[#902701] rounded-xl text-xs font-bold uppercase tracking-wide transition shadow-md"
              >
                + Registro
              </button>
            </div>
            
            <div class="p-6 flex-grow bg-white relative">
              <div class="absolute top-0 left-0 w-32 h-32 bg-[#F1EBE8] rounded-br-full opacity-50 pointer-events-none"></div>

              <div v-if="!adminStore.selectedPetDetails.records || adminStore.selectedPetDetails.records.length === 0" 
                   class="h-full flex flex-col items-center justify-center text-center py-12 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                <span class="text-4xl mb-2 grayscale opacity-20">📂</span>
                <p class="font-medium">Historial clínico vacío</p>
              </div>
              
              <div v-else class="space-y-0 divide-y divide-gray-100 border border-gray-100 rounded-xl bg-white overflow-hidden shadow-sm relative z-10">
                <div v-for="rec in adminStore.selectedPetDetails.records" :key="rec.id" class="p-4 hover:bg-[#F1EBE8]/50 transition flex gap-4 items-center group">
                  <div class="flex-shrink-0 w-14 text-center bg-gray-50 rounded-lg p-1 border border-gray-100 group-hover:border-[#EF6532] transition">
                    <span class="block text-[10px] font-bold text-gray-400 uppercase">{{ new Date(rec.date).toLocaleDateString('es-CL', { month: 'short' }) }}</span>
                    <span class="block text-xl font-bold text-gray-700 group-hover:text-[#B63101]">{{ new Date(rec.date).toLocaleDateString('es-CL', { day: 'numeric' }) }}</span>
                    <span class="block text-[10px] text-gray-400">{{ new Date(rec.date).getFullYear() }}</span>
                  </div>
                  <div class="flex-grow">
                    <div class="flex items-center gap-2 mb-1">
                      <span 
                        class="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded border"
                        :class="{
                          'bg-green-50 text-green-700 border-green-200': rec.type === 'Vacuna',
                          'bg-blue-50 text-blue-700 border-blue-200': rec.type === 'Tratamiento',
                          'bg-red-50 text-red-700 border-red-200': rec.type === 'Cirugía',
                          'bg-purple-50 text-purple-700 border-purple-200': rec.type === 'Examen',
                          'bg-gray-50 text-gray-600 border-gray-200': rec.type === 'Observación'
                        }"
                      >
                        {{ rec.type }}
                      </span>
                    </div>
                    <p class="text-gray-800 font-semibold text-sm">{{ rec.name }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </template>

    <div v-if="showAppointmentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity" @click="showAppointmentModal = false"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border-t-8 border-[#EF6532] transform scale-100 transition-all">
        <div class="bg-white px-6 py-6 pb-0">
          <h3 class="text-2xl font-extrabold text-gray-800">Nueva Cita</h3>
          <p class="text-gray-500 text-sm mt-1">Programa una visita para {{ adminStore.selectedPetDetails.pet.name }}.</p>
        </div>
        <form @submit.prevent="handleAddAppointment" class="p-6 space-y-5">
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha y Hora</label>
            <input v-model="newAppointmentForm.date" type="datetime-local" required class="input-field bg-gray-50 border-gray-200 focus:ring-[#EF6532] focus:border-[#EF6532]">
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Motivo</label>
            <input v-model="newAppointmentForm.reason" type="text" required class="input-field bg-gray-50 border-gray-200 focus:ring-[#EF6532] focus:border-[#EF6532]" placeholder="Ej. Control sano">
          </div>
          
          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="showAppointmentModal = false" class="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition">CANCELAR</button>
            <button type="submit" :disabled="adminStore.isLoading" class="px-6 py-2 text-sm font-bold text-white bg-[#B63101] hover:bg-[#902701] rounded-lg shadow-lg transition">CONFIRMAR</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showRecordModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" @click="showRecordModal = false"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border-t-8 border-[#B63101] transform scale-100 transition-all">
        <div class="bg-white px-6 py-6 pb-0">
          <h3 class="text-2xl font-extrabold text-gray-800">Nuevo Registro</h3>
          <p class="text-gray-500 text-sm mt-1">Añade un evento al historial médico.</p>
        </div>
        <form @submit.prevent="handleAddRecord" class="p-6 space-y-5">
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</label>
            <input v-model="newRecordForm.date" type="date" required class="input-field bg-gray-50 border-gray-200 focus:ring-[#B63101] focus:border-[#B63101]">
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</label>
            <select v-model="newRecordForm.type" class="input-field bg-gray-50 border-gray-200 focus:ring-[#B63101] focus:border-[#B63101]">
              <option>Vacuna</option>
              <option>Tratamiento</option>
              <option>Cirugía</option>
              <option>Observación</option>
              <option>Examen</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Descripción</label>
            <input v-model="newRecordForm.name" type="text" required class="input-field bg-gray-50 border-gray-200 focus:ring-[#B63101] focus:border-[#B63101]" placeholder="Ej. Vacuna Óctuple">
          </div>

          <div class="pt-4 flex justify-end gap-3">
            <button type="button" @click="showRecordModal = false" class="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition">CANCELAR</button>
            <button type="submit" :disabled="adminStore.isLoading" class="px-6 py-2 text-sm font-bold text-white bg-[#B63101] hover:bg-[#902701] rounded-lg shadow-lg transition">GUARDAR</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>