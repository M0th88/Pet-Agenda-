<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// CORRECCIÓN: Añadido .js al final
import { useUserStore } from '@/store/UserStore.js';

const router = useRouter();
const userStore = useUserStore();

// Campos del formulario
const email = ref('test@petagenda.com'); // Valor pre-rellenado para simulación
const password = ref('password');

const handleLogin = async () => {
  const success = await userStore.login(email.value, password.value);
  
  if (success) {
    // Si el login es exitoso, redirige al Dashboard
    router.push({ name: 'Dashboard' }); 
  } else {
    // Muestra un mensaje de error (manejo de errores muy simple)
    // ¡NUNCA USES alert() en producción! Lo cambiaremos después.
    alert(userStore.error);
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
      <h2 class="text-3xl font-bold text-center text-indigo-600 mb-6">
        <span class="mr-2">🐾</span> Acceso a PetAgenda
      </h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 text-left">Correo Electrónico</label>
          <input 
            id="email" 
            type="email" 
            v-model="email" 
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 text-left">Contraseña</label>
          <input 
            id="password" 
            type="password" 
            v-model="password" 
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
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
      
      <p class="mt-6 text-center text-sm text-gray-600">
        ¿No tienes cuenta? 
        <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
          Regístrate aquí
        </router-link>
      </p>
      
      <!-- Mensaje de error simple -->
      <div v-if="userStore.error" class="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {{ userStore.error }}
      </div>
    </div>
  </div>
</template>

