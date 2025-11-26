<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/UserStore.js';

const router = useRouter();
const userStore = useUserStore();

// Campos del formulario
// Dejamos los valores por defecto que tenías para facilitar las pruebas
const email = ref('admin@petagenda.com'); 
const password = ref('password');

const handleLogin = async () => {
  // Esta lógica de login y redirección por rol es la misma que tenías
  // y es correcta.
  const success = await userStore.login(email.value, password.value);
  
  if (success) {
    if (userStore.isAdmin) {
      router.push({ name: 'AdminDashboard' }); // <-- Redirige al admin
    } else {
      router.push({ name: 'Dashboard' }); // <-- Redirige al cliente
    }
  } 
  // El store se encarga de gestionar el error
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    
    <div class="flex w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden m-auto">

      <div class="w-1/2 hidden md:block">
        
        <img 
          src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1000&q=80" 
          alt="Perro en clínica veterinaria"
          class="h-full w-full object-cover"
        >
      </div>

      <div class="w-full md:w-1/2 bg-white p-10 md:p-14">
        
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-2">
          Inicia Sesión
        </h2>
        <p class="text-center text-gray-500 mb-8">
          ¡Bienvenido de vuelta! Por favor, ingresa tus datos.
        </p>

        <form @submit.prevent="handleLogin" class="space-y-5">
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
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
                class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
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
                class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>
          </div>

          <div class="text-right">
            <a href="#" class="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button 
            type="submit"
            :disabled="userStore.isLoading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:bg-indigo-400"
          >
            <span v-if="userStore.isLoading">Iniciando Sesión...</span>
            <span v-else>Iniciar Sesión</span>
          </button>
        </form>
        
        <p class="mt-8 text-center text-sm text-gray-600">
          ¿No tienes una cuenta? 
          <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
            Regístrate
          </router-link>
        </p>
        
        <div v-if="userStore.error && !userStore.isLoading" class="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
          {{ userStore.error }}
        </div>

      </div>
    </div>
  </div>
</template>