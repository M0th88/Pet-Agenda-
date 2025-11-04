import { defineStore } from 'pinia';
import { useUserStore } from './UserStore.js'; // Importamos la UserStore

// Datos de simulación iniciales
const MOCK_PETS = [
  { id: 1, userId: 1, name: 'Rex', species: 'Perro', breed: 'Pastor Alemán' },
  { id: 2, userId: 1, name: 'Mishi', species: 'Gato', breed: 'Siamés' },
];

export const usePetStore = defineStore('pet', {
  state: () => ({
    pets: [], // Lista de mascotas del usuario
    isLoading: false,
    error: null,
  }),

  getters: {
    // Obtener mascotas por ID de usuario (aunque por ahora solo cargamos las del usuario logeado)
    petsForCurrentUser: (state) => state.pets,
  },

  actions: {
    // 1. Acción para CARGAR las mascotas (Simulada)
    async fetchPets() {
      const userStore = useUserStore();
      if (!userStore.isAuthenticated) return; // Seguridad

      this.isLoading = true;
      this.error = null;

      try {
        // En un backend real:
        // const response = await axios.get('/api/pets', {
        //   headers: { Authorization: `Bearer ${userStore.token}` }
        // });
        // this.pets = response.data;

        // --- SIMULACIÓN ---
        await new Promise(resolve => setTimeout(resolve, 800)); // Delay de red
        // Filtramos las mascotas simuladas que pertenecen al usuario (id: 1)
        this.pets = MOCK_PETS.filter(pet => pet.userId === userStore.user.id);
        // ------------------

      } catch (err) {
        this.error = 'Error al cargar las mascotas.';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    // 2. Acción para CREAR una mascota (Simulada)
    async createPet(petData) {
      const userStore = useUserStore();
      if (!userStore.isAuthenticated) return;

      this.isLoading = true;
      this.error = null;

      try {
        // En un backend real:
        // const response = await axios.post('/api/pets', petData, {
        //   headers: { Authorization: `Bearer ${userStore.token}` }
        // });
        // this.pets.push(response.data); // Añadimos la mascota devuelta por el backend

        // --- SIMULACIÓN ---
        await new Promise(resolve => setTimeout(resolve, 600));
        const newPet = {
          id: Math.floor(Math.random() * 1000), // ID aleatorio
          userId: userStore.user.id,
          ...petData, // name, species, breed
        };
        this.pets.push(newPet);
        // ------------------
        
        // *** CAMBIO: Añadido explícitamente ***
        this.isLoading = false; 

      } catch (err) {
        this.error = 'Error al crear la mascota.';
        console.error(err);
        
        // *** CAMBIO: Añadido explícitamente ***
        this.isLoading = false; 
        
      } finally {
        // Lo mantenemos aquí por si acaso
        this.isLoading = false;
      }
    },
  },
});
// La llave "}" extra que estaba aquí ha sido eliminada.

