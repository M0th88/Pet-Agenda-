import { defineStore } from 'pinia';

// Definimos la URL de tu backend
const API_URL = 'http://localhost:3000/api';

// ¡Esta es la exportación que te falta!
export const useUserStore = defineStore('user', {
  state: () => ({
    // Leemos los datos de la sesión guardada en el navegador
    token: localStorage.getItem('userToken') || null, 
    user: JSON.parse(localStorage.getItem('userData')) || null,
    isLoading: false,
    error: null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    userId: (state) => state.user ? state.user.id : null,
    isAdmin: (state) => state.user?.role === 'admin',
  },
  
  actions: {
    // Acción de LOGIN conectada
    async login(email, password) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error al iniciar sesión');
        }

        this.token = data.token;
        this.user = data.user;
        
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        return true; // Login exitoso

      } catch (err) {
        this.error = err.message;
        this.token = null;
        this.user = null;
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        return false; // Login fallido
      } finally {
        this.isLoading = false;
      }
    },
    
    // Acción de LOGOUT
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
    },

    // Cargar usuario desde el token guardado
    loadUserFromToken() {
        if (!this.token || !this.user) {
            this.logout();
            return;
        }
        this.isLoading = false;
    }
  }
});