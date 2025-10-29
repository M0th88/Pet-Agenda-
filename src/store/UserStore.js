import { defineStore } from 'pinia';

// Simulación de un token JWT
// En un backend real, este token vendría de la respuesta del servidor al hacer login
const FAKE_AUTH_TOKEN = 'jwt-fake-token-12345'; 

export const useUserStore = defineStore('user', {
  state: () => ({
    // El token se almacena en localStorage para simular persistencia
    token: localStorage.getItem('userToken') || null, 
    user: null, // Objeto del usuario logeado
    isLoading: false,
    error: null,
  }),
  
  getters: {
    // Getter para saber si el usuario está autenticado
    isAuthenticated: (state) => !!state.token,
    
    // Si queremos obtener el ID del usuario, por ejemplo
    userId: (state) => state.user ? state.user.id : null,
  },
  
  actions: {
    // *** 1. Acción de LOGIN (Simulada) ***
    async login(email, password) {
      this.isLoading = true;
      this.error = null;
      
      try {
        // En un proyecto real, aquí harías una llamada POST a tu backend
        // const response = await axios.post('/api/auth/login', { email, password });
        
        // --- SIMULACIÓN ---
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula un delay de red
        if (email === 'test@petagenda.com' && password === 'password') {
            const token = FAKE_AUTH_TOKEN;
            const userData = { id: 1, name: 'Dueño de Prueba', email: email };

            this.token = token;
            this.user = userData;
            
            // Guardar el token en localStorage para mantener la sesión
            localStorage.setItem('userToken', token);
            return true; // Login exitoso
        } else {
            throw new Error('Credenciales inválidas (Simulación)');
        }
        // ------------------
      } catch (err) {
        this.error = err.message || 'Error desconocido al iniciar sesión';
        this.token = null;
        this.user = null;
        return false; // Login fallido
      } finally {
        this.isLoading = false;
      }
    },
    
    // *** 2. Acción de LOGOUT ***
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('userToken');
      // Redirigir al usuario (esto lo haremos en el componente)
    },

    // *** 3. Acción para cargar datos del usuario al recargar la página ***
    async loadUserFromToken() {
        if (!this.token) return;

        this.isLoading = true;
        
        try {
            // En un proyecto real, usarías el token guardado para pedir
            // los datos del usuario al backend.
            // const response = await axios.get('/api/auth/me', {
            //     headers: { Authorization: `Bearer ${this.token}` }
            // });
            
            // --- SIMULACIÓN (Asumiendo que el token es válido) ---
            await new Promise(resolve => setTimeout(resolve, 500));
            this.user = { id: 1, name: 'Dueño de Prueba', email: 'test@petagenda.com' };
            // ------------------
            
        } catch (error) {
            console.error('Token inválido o expirado. Cerrando sesión.', error);
            this.logout(); // Si el token falla, cerramos sesión
        } finally {
            this.isLoading = false;
        }
    }
  }
});
