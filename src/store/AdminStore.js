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
    
    // Acción para LEER clientes (Sin cambios)
    async fetchAllData() {
      const userStore = useUserStore();
      if (!userStore.isAdmin) {
        this.error = 'No tienes permisos de administrador.';
        return; 
      }
      this.isLoading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_URL}/admin/clients`);
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        this.users = await response.json();
      } catch (err) {
        this.error = 'Error al cargar datos de administrador.';
      } finally {
        this.isLoading = false;
      }
    },

    // --- ACCIÓN PARA CREAR CLIENTE (MODIFICADA) ---
    async createClient(clientData) { // clientData es { name, email, password }
      const userStore = useUserStore();
      if (!userStore.isAdmin) {
        this.error = "No tienes permisos.";
        return;
      }
      this.isLoading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_URL}/admin/clients`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // CAMBIO: Ahora enviamos el objeto completo, incluida la contraseña
          body: JSON.stringify(clientData), 
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'No se pudo crear el cliente');
        }
        this.users.push(data); 
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },

    // Acción para LEER detalles de UNA mascota (Sin cambios)
    async fetchAdminPetDetails(petId) {
      const userStore = useUserStore();
      if (!userStore.isAdmin) {
        this.error = "No tienes permisos.";
        return;
      }
      this.isLoading = true;
      this.error = null;
      this.selectedPetDetails = null;
      try {
        const response = await fetch(`${API_URL}/admin/pets/${petId}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'No se pudieron cargar los detalles');
        }
        this.selectedPetDetails = await response.json();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },

    // Acción para CREAR una mascota (Sin cambios)
    async createPetForClient(petData, userId) {
      const userStore = useUserStore();
      if (!userStore.isAdmin) {
        this.error = "No tienes permisos.";
        return;
      }
      this.isLoading = true;
      this.error = null;
      try {
        const payload = { ...petData, userId: userId };
        const response = await fetch(`${API_URL}/admin/pets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const newPet = await response.json();
        if (!response.ok) {
          throw new Error(newPet.error || 'No se pudo crear la mascota');
        }
        const client = this.users.find(u => u.id === userId);
        if (client) {
          client.pets.push(newPet);
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },

    // Acción para CREAR una cita (Sin cambios)
    async addAppointment(appointmentData) {
      const userStore = useUserStore();
      if (!userStore.isAdmin || !this.selectedPetDetails) {
        this.error = "Error: No hay mascota seleccionada";
        return;
      }
      this.isLoading = true;
      this.error = null;
      try {
        const payload = {
          ...appointmentData,
          petId: this.selectedPetDetails.pet.id
        };
        const response = await fetch(`${API_URL}/admin/appointments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const newAppointment = await response.json();
        if (!response.ok) {
          throw new Error(newAppointment.error || 'No se pudo agendar la cita');
        }
        this.selectedPetDetails.appointments.push(newAppointment);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },

    // Acción para CREAR un registro médico (Sin cambios)
    async addMedicalRecord(recordData) {
      const userStore = useUserStore();
      if (!userStore.isAdmin || !this.selectedPetDetails) {
        this.error = "Error: No hay mascota seleccionada";
        return;
      }
      this.isLoading = true;
      this.error = null;
      try {
        const payload = {
          ...recordData,
          petId: this.selectedPetDetails.pet.id
        };
        const response = await fetch(`${API_URL}/admin/records`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const newRecord = await response.json();
        if (!response.ok) {
          throw new Error(newRecord.error || 'No se pudo crear el registro');
        }
        this.selectedPetDetails.records.push(newRecord);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },

    // Acción para ELIMINAR un cliente (Sin cambios)
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
        this.users = this.users.filter(user => user.id !== clientId);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },

    // Acción para EDITAR un cliente (Sin cambios)
    async updateClient(clientId, clientData) {
      const userStore = useUserStore();
      if (!userStore.isAdmin) {
        this.error = "No tienes permisos.";
        return false;
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
        const index = this.users.findIndex(u => u.id === clientId);
        if (index !== -1) {
          this.users[index] = { 
            ...this.users[index],
            ...updatedUser      
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