<script setup>
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePetStore } from '@/store/PetStore.js';
import { useUserStore } from '@/store/UserStore.js';

const route = useRoute();
const router = useRouter();
const petStore = usePetStore();
const userStore = useUserStore();

const petId = route.params.id;

onMounted(() => {
  petStore.fetchPetById(petId);
});

// Helper para iconos
const petIcon = computed(() => {
  const species = petStore.selectedPet?.species || '';
  switch (species) {
    case 'Perro': return '🐶';
    case 'Gato': return '🐱';
    case 'Conejo': return '🐰';
    case 'Ave': return '🐦';
    default: return '🐾';
  }
});
</script>

<template>
  <div class="min-h-screen bg-[#F1EBE8] font-sans text-gray-800 flex flex-col">
    
    <div v-if="petStore.isLoading" class="flex-grow flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-[#EF6532] border-t-transparent mb-4"></div>
      <p class="text-[#B63101] font-bold text-xl">Cargando perfil...</p>
    </div>

    <div v-else-if="petStore.error" class="flex-grow flex items-center justify-center">
       <div class="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md mx-4 border-t-4 border-red-500">
         <div class="text-5xl mb-4">🐕‍🦺❓</div>
         <h3 class="text-xl font-bold text-gray-800 mb-2">No pudimos cargar la mascota</h3>
         <p class="text-gray-500 mb-6">{{ petStore.error }}</p>
         <router-link :to="{ name: 'Dashboard' }" class="bg-[#B63101] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#902701] transition">Volver al Inicio</router-link>
       </div>
    </div>

    <template v-else-if="petStore.selectedPet">
      <div class="bg-[#EF6532] text-white shadow-xl relative overflow-hidden pt-8 pb-10">
        <div class="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <svg class="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
        </div>
        
        <div class="container mx-auto px-4 sm:px-6 relative z-10">
          <div class="absolute top-0 left-4 sm:left-6">
            <router-link :to="{ name: 'Dashboard' }" class="inline-flex items-center gap-2 text-white hover:text-gray-100 hover:bg-white/20 px-4 py-2 rounded-full transition text-sm font-bold uppercase tracking-wide border border-white/30 backdrop-blur-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Mis Mascotas
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
                <h1 class="text-5xl font-extrabold text-white tracking-tight drop-shadow-md">{{ petStore.selectedPet.name }}</h1>
                <span class="bg-[#B63101] text-white px-3 py-1 rounded-lg text-sm font-extrabold uppercase shadow-sm transform -rotate-2">
                  {{ petStore.selectedPet.species }}
                </span>
              </div>
              <p class="text-white/90 text-2xl font-medium">{{ petStore.selectedPet.breed }}</p>
            </div>
          </div>
        </div>
      </div>

      <main class="container mx-auto px-4 sm:px-6 py-8 mt-8 relative z-20 max-w-6xl pb-20">
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          <div class="bg-white rounded-2xl shadow-xl shadow-gray-200 border border-gray-100 overflow-hidden flex flex-col h-full transform transition-all hover:-translate-y-1 duration-300">
            <div class="px-6 py-5 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span class="text-2xl">📅</span> Próximas Citas
                </h3>
                <p class="text-xs text-gray-500 font-medium mt-0.5">Tus visitas agendadas</p>
              </div>
            </div>
            
            <div class="p-6 flex-grow bg-white relative">
              <div class="absolute top-0 right-0 w-32 h-32 bg-[#F1EBE8] rounded-bl-full opacity-50 pointer-events-none"></div>

              <div v-if="!petStore.selectedPet.appointments || petStore.selectedPet.appointments.length === 0" 
                   class="h-full flex flex-col items-center justify-center text-center py-12 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                <span class="text-4xl mb-2 grayscale opacity-20">📆</span>
                <p class="font-medium">No tienes citas pendientes</p>
              </div>
              
              <div v-else class="space-y-4 relative z-10">
                <div 
                  v-for="app in petStore.selectedPet.appointments" 
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
                <p class="text-xs text-gray-500 font-medium mt-0.5">Registro de vacunas y atenciones</p>
              </div>
            </div>
            
            <div class="p-6 flex-grow bg-white relative">
              <div class="absolute top-0 left-0 w-32 h-32 bg-[#F1EBE8] rounded-br-full opacity-50 pointer-events-none"></div>

              <div v-if="!petStore.selectedPet.records || petStore.selectedPet.records.length === 0" 
                   class="h-full flex flex-col items-center justify-center text-center py-12 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                <span class="text-4xl mb-2 grayscale opacity-20">📂</span>
                <p class="font-medium">No hay registros aún</p>
              </div>
              
              <div v-else class="space-y-0 divide-y divide-gray-100 border border-gray-100 rounded-xl bg-white overflow-hidden shadow-sm relative z-10">
                <div v-for="rec in petStore.selectedPet.records" :key="rec.id" class="p-4 hover:bg-[#F1EBE8]/50 transition flex gap-4 items-center group">
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
  </div>
</template>