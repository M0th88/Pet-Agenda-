<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/UserStore.js';

const router = useRouter();
const userStore = useUserStore();

const email = ref('admin@petagenda.com'); 
const password = ref('password');

const handleLogin = async () => {
  const success = await userStore.login(email.value, password.value);
  
  if (success) {
    if (userStore.isAdmin) {
      router.push({ name: 'AdminDashboard' });
    } else {
      router.push({ name: 'Dashboard' });
    }
  } 
};
</script>

<template>
  <div 
    class="min-h-screen flex items-center justify-center p-4 font-sans relative bg-cover bg-center bg-no-repeat"
    style="background-image: url('/fondo_login.jpg');"
  >
    
    <div class="absolute inset-0 bg-black/70 z-0"></div>

    <div class="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-10 md:p-12">
        
        <div class="mb-8 text-center">
           
           <img 
             src="/logo.png" 
             alt="Logo PetAgenda" 
             class="h-24 mx-auto mb-4 drop-shadow-sm hover:scale-105 transition-transform duration-300"
           >

           <h2 class="text-3xl font-extrabold text-gray-800">
            Inicia Sesión
          </h2>
          <p class="text-gray-500 mt-2 font-medium">
            Bienvenido a PetAgenda
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          
          <div>
            <label for="email" class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Email
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <input 
                id="email" 
                type="email" 
                v-model="email" 
                required
                placeholder="tu@email.com"
                class="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EF6532] focus:border-transparent transition-all font-medium text-gray-800"
              >
            </div>
          </div>

          <div>
            <label for="password" class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Contraseña
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
                </svg>
              </span>
              <input 
                id="password" 
                type="password" 
                v-model="password" 
                required
                placeholder="••••••••"
                class="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EF6532] focus:border-transparent transition-all font-medium text-gray-800"
              >
            </div>
          </div>

        
          <button 
            type="submit"
            :disabled="userStore.isLoading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-[#B63101] hover:bg-[#902701] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EF6532] transition duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95 tracking-wide"
          >
            <span v-if="userStore.isLoading">Iniciando Sesión...</span>
            <span v-else>INICIAR SESIÓN</span>
          </button>
        </form>
        
        <div v-if="userStore.error && !userStore.isLoading" class="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm text-center font-bold">
          {{ userStore.error }}
        </div>

    </div>
  </div>
</template>