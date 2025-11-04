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
    
    // --- ACCIÓN PARA CARGAR TODOS LOS CLIENTES ---
    async fetchAllData() {
      const userStore = useUserStore();
      if (!userStore.isAdmin) {
        this.error = "No tienes permisos de administrador.";
        return;
      }

      this.isLoading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_URL}/admin/clients`);
        
        if (!response.ok) {
          throw new Error('Error al cargar los clientes');
        }

        const data = await response.json();
        this.users = data; // Array de clientes con sus mascotas

      } catch (err) {
        this.error = err.message;
        console.error('Error en fetchAllData:', err);
      } finally {
        this.isLoading = false;
      }
    },

    // --- ACCIÓN PARA CREAR CLIENTE ---
    async createClient(clientData) {
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
          body: JSON.stringify(clientData)
        });

        const newClient = await response.json();
        
        if (!response.ok) {
          throw new Error(newClient.error || 'No se pudo crear el cliente');
        }

        // Añadimos el nuevo cliente al estado local
        this.users.push(newClient);

      } catch (err) {
        this.error = err.message;
        console.error('Error en createClient:', err);
      } finally {
        this.isLoading = false;
      }
    },

    // --- ACCIÓN PARA VER DETALLE DE MASCOTA (Admin) ---
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
          throw new Error('Error al cargar los detalles de la mascota');
        }

        const data = await response.json();
        this.selectedPetDetails = data;

      } catch (err) {
        this.error = err.message;
        console.error('Error en fetchAdminPetDetails:', err);
      } finally {
        this.isLoading = false;
      }
    },

    // --- ACCIÓN PARA CREAR MASCOTA ---
    async createPetForClient(petData, userId) {
      const userStore = useUserStore();
      if (!userStore.isAdmin) {
        this.error = "No tienes permisos.";
        return;
      }

      this.isLoading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_URL}/admin/pets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...petData, userId })
        });

        const newPet = await response.json();
        
        if (!response.ok) {
          throw new Error(newPet.error || 'No se pudo crear la mascota');
        }

        // Añadimos la mascota al cliente correspondiente en el estado local
        const clientIndex = this.users.findIndex(u => u.id === userId);
        if (clientIndex !== -1) {
          if (!this.users[clientIndex].pets) {
            this.users[clientIndex].pets = [];
          }
          this.users[clientIndex].pets.push(newPet);
        }

      } catch (err) {
        this.error = err.message;
        console.error('Error en createPetForClient:', err);
      } finally {
        this.isLoading = false;
      }
    },

    // --- ACCIÓN PARA AÑADIR CITA ---
    async addAppointment(appointmentData) {
      const userStore = useUserStore();
      if (!userStore.isAdmin) {
        this.error = "No tienes permisos.";
        return;
      }

      this.isLoading = true;
      this.error = null;
      try {
        // Aseguramos que tenemos el petId del detalle seleccionado
        if (!this.selectedPetDetails) {
          throw new Error('No hay mascota seleccionada');
        }

        const response = await fetch(`${API_URL}/admin/appointments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...appointmentData, 
            petId: this.selectedPetDetails.pet.id 
          })
        });

        const newAppointment = await response.json();
        
        if (!response.ok) {
          throw new Error(newAppointment.error || 'No se pudo crear la cita');
        }

        // Añadimos la cita al detalle de la mascota
        if (this.selectedPetDetails.appointments) {
          this.selectedPetDetails.appointments.push(newAppointment);
        }

      } catch (err) {
        this.error = err.message;
        console.error('Error en addAppointment:', err);
      } finally {
        this.isLoading = false;
      }
    },

    // --- ACCIÓN PARA AÑADIR REGISTRO MÉDICO ---
    async addMedicalRecord(recordData) {
      const userStore = useUserStore();
      if (!userStore.isAdmin) {
        this.error = "No tienes permisos.";
        return;
      }

      this.isLoading = true;
      this.error = null;
      try {
        if (!this.selectedPetDetails) {
          throw new Error('No hay mascota seleccionada');
        }

        const response = await fetch(`${API_URL}/admin/records`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...recordData, 
            petId: this.selectedPetDetails.pet.id 
          })
        });

        const newRecord = await response.json();
        
        if (!response.ok) {
          throw new Error(newRecord.error || 'No se pudo crear el registro');
        }

        // Añadimos el registro al detalle de la mascota
        if (this.selectedPetDetails.records) {
          this.selectedPetDetails.records.push(newRecord);
        }

      } catch (err) {
        this.error = err.message;
        console.error('Error en addMedicalRecord:', err);
      } finally {
        this.isLoading = false;
      }
    },

    // --- ACCIÓN PARA ELIMINAR CLIENTE ---
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
        console.error('Error en deleteClient:', err);
      } finally {
        this.isLoading = false;
      }
    },

    // --- ACCIÓN PARA EDITAR CLIENTE ---
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

        // Actualizamos el usuario en el estado local
        const index = this.users.findIndex(u => u.id === clientId);
        if (index !== -1) {
          this.users[index] = { 
            ...this.users[index], // Mantiene 'pets'
            ...updatedUser      // Actualiza 'name', 'email'
          };
        }
        return true;

      } catch (err) {
        this.error = err.message;
        console.error('Error en updateClient:', err);
        return false;
      } finally {
        this.isLoading = false;
      }
    }
  },
});