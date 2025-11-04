import { defineStore } from 'pinia';
import { useUserStore } from './UserStore.js';
// Importamos la DB simulada
import { MOCK_PETS, simulateApiCall } from './mockDatabase.js';

export const usePetStore = defineStore('pet', {
  state: () => ({
    pets: [], // Mascotas del usuario logeado
    selectedPet: null, // *** AÑADIDO: Para la página de detalle ***
    isLoading: false,
    error: null,
  }),

  getters: {
    petsForCurrentUser: (state) => state.pets,
  },

  actions: {
    // 1. Acción para CARGAR (Modificada para usar la DB simulada)
    async fetchPets() {
      const userStore = useUserStore();
      if (!userStore.isAuthenticated) return;

      this.isLoading = true;
      this.error = null;

      try {
        await simulateApiCall(800);
        
        // Filtramos las mascotas simuladas (de la DB) que pertenecen al usuario
        this.pets = MOCK_PETS.filter(pet => pet.userId === userStore.user.id);
        
      } catch (err) {
        this.error = 'Error al cargar las mascotas.';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    // 2. Acción para CREAR (Modificada para usar la DB simulada)
    async createPet(petData) {
      const userStore = useUserStore();
      if (!userStore.isAuthenticated) return;

      this.isLoading = true;
      this.error = null;

      try {
        await simulateApiCall(600);
        
        const newPet = {
          id: Math.floor(Math.random() * 1000),
          userId: userStore.user.id,
          ...petData,
        };
        
        // Añadimos la mascota a la DB simulada
        MOCK_PETS.push(newPet);
        // Y al estado local
        this.pets.push(newPet);
        
      } catch (err) {
        this.error = 'Error al crear la mascota.';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    // 3. *** ACCIÓN NUEVA (Faltaba para PetDetailPage.vue) ***
    async fetchPetById(petId) {
      const userStore = useUserStore();
      if (!userStore.isAuthenticated) return;
      
      this.isLoading = true;
      this.error = null;
      this.selectedPet = null;

      try {
        await simulateApiCall(500);
        
        // Buscamos la mascota en la DB simulada
        const pet = MOCK_PETS.find(p => p.id == petId); // Usar == por si el ID es string

        if (pet) {
          // Verificamos que la mascota pertenezca al usuario (seguridad)
          if (pet.userId === userStore.user.id) {
            this.selectedPet = pet;
          } else {
            throw new Error('No tienes permiso para ver esta mascota.');
          }
        } else {
          throw new Error('Mascota no encontrada.');
        }

      } catch (err) {
        this.error = err.message || 'Error al cargar la mascota.';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
  },
});