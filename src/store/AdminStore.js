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
    
    // Acción para LEER clientes
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

    // Acción para CREAR CLIENTE
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
          body: JSON.stringify(clientData), 
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'No se pudo crear el cliente');
        }
        this.users.push(data); 
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // Acción para LEER detalles de UNA mascota
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

    // Acción para CREAR una mascota
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
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // Acción para CREAR una cita
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
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // Acción para CREAR un registro médico
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
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // Acción para ELIMINAR un cliente
    async deleteClient(clientId) {
      const userStore = useUserStore();
      if (!userStore.isAdmin) {
        this.error = "No tienes permisos.";
        return false;
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
        return true;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // Acción para EDITAR un cliente
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
        return true;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // Acción para EDITAR una mascota
    async updatePet(petId, petData) {
      const userStore = useUserStore();
      if (!userStore.isAdmin) {
        this.error = "No tienes permisos.";
        return false;
      }
      this.isLoading = true;
      this.error = null;

      try {
        console.log('🔍 Llamando a:', `${API_URL}/admin/pets/${petId}`);
        console.log('📦 Datos enviados:', petData);
        
        const response = await fetch(`${API_URL}/admin/pets/${petId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(petData),
        });

        console.log('📊 Status:', response.status);
        console.log('📋 Headers:', response.headers.get('content-type'));
        
        const textResponse = await response.text();
        console.log('📄 Respuesta raw:', textResponse);

        let updatedPet;
        try {
          updatedPet = JSON.parse(textResponse);
        } catch (parseError) {
          console.error('❌ Error al parsear JSON:', parseError);
          throw new Error(`El servidor devolvió HTML en lugar de JSON. Respuesta: ${textResponse.substring(0, 100)}...`);
        }

        if (!response.ok) {
          throw new Error(updatedPet.error || 'No se pudo actualizar la mascota');
        }

        // 1. Actualizar la vista de detalle (AdminPetDetailPage)
        if (this.selectedPetDetails && this.selectedPetDetails.pet.id === petId) {
          this.selectedPetDetails.pet = { ...this.selectedPetDetails.pet, ...updatedPet };
        }

        // 2. Actualizar la lista de mascotas en el dashboard principal (AdminDashboardPage)
        const client = this.users.find(u => u.id === updatedPet.userId);
        if (client) {
          const petIndex = client.pets.findIndex(p => p.id === petId);
          if (petIndex !== -1) {
            client.pets[petIndex] = updatedPet;
          }
        }
        
        return true;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // Acción para ELIMINAR una mascota
    async deletePet(petId, userId) {
      const userStore = useUserStore();
      if (!userStore.isAdmin) {
        this.error = "No tienes permisos.";
        return false;
      }
      this.isLoading = true;
      this.error = null;

      try {
        const response = await fetch(`${API_URL}/admin/pets/${petId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'No se pudo eliminar la mascota');
        }

        // 1. Quitar de la lista de mascotas en el dashboard principal
        if (userId) {
          const client = this.users.find(u => u.id === userId);
          if (client) {
            client.pets = client.pets.filter(p => p.id !== petId);
          }
        }

        // 2. Limpiar la vista de detalle si era la mascota seleccionada
        if (this.selectedPetDetails && this.selectedPetDetails.pet.id === petId) {
          this.selectedPetDetails = null;
        }

        return true;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    }

  },
});