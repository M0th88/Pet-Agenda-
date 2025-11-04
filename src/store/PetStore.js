import { defineStore } from 'pinia';
import { useUserStore } from './UserStore.js';
// ¡Ya no importamos la base de datos simulada!

const API_URL = 'http://localhost:3000/api';

export const usePetStore = defineStore('pet', {
  state: () => ({
    pets: [], // Mascotas del usuario logueado
    selectedPet: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    petsForCurrentUser: (state) => state.pets,
  },

  actions: {
    // --- ¡ACCIÓN fetchPets CONECTADA! ---
    async fetchPets() {
      const userStore = useUserStore();
      if (!userStore.isAuthenticated || !userStore.user) return;

      this.isLoading = true;
      this.error = null;

      try {
        // Pedimos las mascotas para el ID del usuario logueado
        const response = await fetch(`${API_URL}/pets?userId=${userStore.user.id}`);
        if (!response.ok) {
          throw new Error('Error al cargar las mascotas.');
        }
        this.pets = await response.json();
        
      } catch (err) {
        this.error = 'Error al cargar las mascotas.';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    // --- ¡ACCIÓN fetchPetById CONECTADA! ---
    // (Esta usa la ruta de admin, ya que es más potente)
    async fetchPetById(petId) {
      const userStore = useUserStore();
      if (!userStore.isAuthenticated) return;
      
      this.isLoading = true;
      this.error = null;
      this.selectedPet = null;

      try {
        // Usamos la ruta de admin/pets/:id que ya nos da todo
        const response = await fetch(`${API_URL}/admin/pets/${petId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Mascota no encontrada');
        }

        // Verificamos que la mascota sea de este usuario
        if (data.pet.userId !== userStore.user.id) {
          this.error = 'No tienes permiso para ver esta mascota.';
          return;
        }
        
        // Asignamos los datos para la vista de detalle del cliente
        // Cambiamos 'selectedPet.pet' a 'selectedPet'
        this.selectedPet = {
          ...data.pet,
          appointments: data.appointments,
          records: data.records
        };

      } catch (err) {
        this.error = err.message || 'Error al cargar la mascota.';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    // El cliente ya no puede crear mascotas (createPet se eliminó)
  },
});