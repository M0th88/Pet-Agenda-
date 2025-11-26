<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/UserStore.js'; 
import { usePetStore } from '@/store/PetStore.js'; 

const router = useRouter();
const userStore = useUserStore();
const petStore = usePetStore();

onMounted(() => {
  petStore.fetchPets();
});

const handleLogout = () => {
  userStore.logout();
  router.push({ name: 'Login' });
};

// Helper para iconos
const getPetIcon = (species) => {
  switch (species) {
    case 'Perro': return '🐶';
    case 'Gato': return '🐱';
    case 'Conejo': return '🐰';
    case 'Ave': return '🐦';
    default: return '🐾';
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#F1EBE8] font-sans text-gray-800 flex flex-col">
    
    <header class="bg-[#EF6532] text-white shadow-sm sticky top-0 z-40">
      <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center gap-3">
          
          <div class="bg-white p-1.5 rounded-full shadow-lg">
            <img src="/logo.png" alt="Logo" class="h-8 w-8 object-contain">
          </div>

          <div class="leading-tight">
            <h1 class="text-lg font-extrabold tracking-wider text-white">PetAgenda</h1>
            <span class="text-[10px] text-white/80 uppercase font-semibold tracking-widest">Portal Cliente</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="hidden md:block text-right">
            <p class="text-sm font-bold text-white">{{ userStore.user?.name || 'Usuario' }}</p>
            <p class="text-xs text-white/80">Sesión Activa</p>
          </div>
          <button 
            @click="handleLogout"
            class="text-xs font-bold bg-white/10 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition border border-white/20"
          >
            Salir
          </button>
        </div>
      </nav>
    </header>

    <div class="bg-[#EF6532] text-white py-10 shadow-xl relative overflow-hidden">
      <div class="absolute top-0 right-0 opacity-10 text-9xl transform translate-x-10 -translate-y-10 pointer-events-none">🐾</div>
      <div class="container mx-auto px-4 relative z-10">
        <h2 class="text-3xl font-bold text-white mb-2">Mis Mascotas</h2>
        <p class="text-white/90 font-medium max-w-xl">
          Administra el historial médico y las próximas citas de tus compañeros.
        </p>
      </div>
    </div>

    <main class="container mx-auto px-4 py-8 -mt-6 relative z-20">
      
      <div v-if="petStore.isLoading" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-[#EF6532] border-t-transparent mb-4"></div>
        <p class="text-[#B63101] font-medium">Cargando tus mascotas...</p>
      </div>
      
      <div v-else-if="petStore.pets.length === 0" class="bg-white p-12 rounded-2xl shadow-lg text-center border border-gray-100">
        <div class="inline-block p-4 bg-[#F1EBE8] rounded-full mb-4 text-4xl grayscale opacity-50">🐕</div>
        <h3 class="text-xl font-bold text-gray-700">No tienes mascotas registradas</h3>
        <p class="text-gray-500 mt-2">Contacta a la administración para agregar a tus mascotas.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link 
          v-for="pet in petStore.pets" 
          :key="pet.id" 
          :to="{ name: 'PetDetail', params: { id: pet.id } }"
          class="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 hover:border-[#EF6532]/50 transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
        >
          <div class="h-3 w-full bg-gradient-to-r from-[#EF6532] to-[#B63101]"></div>
          
          <div class="p-6 flex items-start gap-5">
            <div class="w-16 h-16 rounded-full bg-[#F1EBE8] text-3xl flex items-center justify-center border border-gray-100 shadow-sm group-hover:scale-110 transition-transform duration-300">
              {{ getPetIcon(pet.species) }}
            </div>
            
            <div class="flex-grow">
              <h3 class="text-xl font-bold text-gray-800 group-hover:text-[#B63101] transition-colors">{{ pet.name }}</h3>
              <p class="text-xs font-bold text-[#B63101] uppercase tracking-wider mt-1 bg-[#F1EBE8] inline-block px-2 py-0.5 rounded">{{ pet.species }}</p>
              <p class="text-sm text-gray-500 mt-2 flex items-center gap-1">
                <span class="font-medium text-gray-400">Raza:</span> {{ pet.breed || 'No especificada' }}
              </p>
            </div>
            
            <div class="text-gray-300 group-hover:text-[#EF6532] self-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </div>
        </router-link>
      </div>
    </main>
  </div>
</template>