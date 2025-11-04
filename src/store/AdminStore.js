import { defineStore } from 'pinia';
import { useUserStore } from './UserStore.js';

const API_URL = 'http://localhost:3000/api';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: [], 
    selectedPetDetails: null, 
    isLoading: false,
    error: null,
  }),

  getters: {
    usersWithPets: (state) => state.users,
  },

  actions: {
    
    // --- ACCIONES CONECTADAS (Sin cambios) ---
    async fetchAllData() { /* ... (código existente) ... */ },
    async createClient(clientData) { /* ... (código existente) ... */ },
    async fetchAdminPetDetails(petId) { /* ... (código existente) ... */ },
    async createPetForClient(petData, userId) { /* ... (código existente) ... */ },
    async addAppointment(appointmentData) { /* ... (código existente) ... */ },
    async addMedicalRecord(recordData) { /* ... (código existente) ... */ },

    // --- ACCIÓN PARA ELIMINAR (DELETE) ---
    async deleteClient(clientId) {
      const userStore = useUserStore();
      if (!userStore.isAdmin) {
        this.error = "No tienes permisos.";
        return;
      }

      this.isLoading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_URL}/admin/clients/${clientId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'No se pudo eliminar el cliente');
        }

        // Si tuvo éxito, lo quitamos de la lista local
        this.users = this.users.filter(user => user.id !== clientId);

      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },

    // --- ACCIÓN PARA EDITAR (UPDATE/PUT) ---
    async updateClient(clientId, clientData) {
      const userStore = useUserStore();
      if (!userStore.isAdmin) {
        this.error = "No tienes permisos.";
        return false; // Devuelve 'false' para que el modal no se cierre
      }

      this.isLoading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_URL}/admin/clients/${clientId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clientData)
        });

        const updatedUser = await response.json();
        if (!response.ok) {
          throw new Error(updatedUser.error || 'No se pudo actualizar');
        }

        // Actualizamos el usuario en el estado local
        const index = this.users.findIndex(u => u.id === clientId);
        if (index !== -1) {
          this.users[index] = { 
            ...this.users[index], // Mantiene 'pets'
            ...updatedUser      // Actualiza 'name', 'email'
          };
        }
        return true; // Éxito

      } catch (err) {
        this.error = err.message;
        return false; // Falla
      } finally {
        this.isLoading = false;
      }
    }
  },
});