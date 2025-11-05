import { defineStore } from 'pinia';
import { useUserStore } from './UserStore.js';

// ¡Ya no importamos la base de datos simulada!
// import { MOCK_PETS, simulateApiCall } from './mockDatabase.js';

const API_URL = 'http://localhost:3000/api';

export const usePetStore = defineStore('pet', {
  state: () => ({
    pets: [], // Mascotas del usuario logueado
    selectedPet: null, // Mascota seleccionada CON citas e historial
    isLoading: false,
    error: null,
  }),

  getters: {
    petsForCurrentUser: (state) => state.pets,
  },

  actions: {
    // --- ¡ACCIÓN fetchPets CONECTADA! ---
    // (Esta ya debería estar conectada, pero la incluimos para asegurar)
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
    // (Esta usa la ruta de admin, ya que es más potente y ya la tenemos)
    async fetchPetById(petId) {
      const userStore = useUserStore();
      if (!userStore.isAuthenticated) return;
      
      this.isLoading = true;
      this.error = null;
      this.selectedPet = null;

      try {
        // 1. Usamos la ruta de admin/pets/:id que ya nos da todo
        const response = await fetch(`${API_URL}/admin/pets/${petId}`);
        const data = await response.json(); // { pet, owner, appointments, records }
        
        if (!response.ok) {
          throw new Error(data.error || 'Mascota no encontrada');
        }

        // 2. Verificamos que la mascota sea de este usuario
        //    (¡Importante por seguridad!)
        if (data.pet.userId !== userStore.user.id) {
          this.error = 'No tienes permiso para ver esta mascota.';
          return;
        }
        
        // 3. Guardamos TODOS los datos en selectedPet
        this.selectedPet = {
          ...data.pet, // name, species, breed...
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