import { createRouter, createWebHistory } from 'vue-router';

// POR esta línea de ruta relativa:
import { useUserStore } from '../store/UserStore.js';
// Vistas que usaremos
const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Pets/DashboardPage.vue'), 
    meta: { requiresAuth: true } // CLAVE: Solo autenticados
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Auth/LoginPage.vue'),
    meta: { requiresGuest: true } // CLAVE: Para que no acceda si ya está logeado
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Auth/RegisterPage.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/:pathMatch(.*)*', // Catch-all 404
    name: 'NotFound',
    component: { template: '<div class="p-8 text-center text-2xl">404 | Página no encontrada</div>' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// *** GUARD DE NAVEGACIÓN GLOBAL ***
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  
  // 1. Cargar datos del usuario si hay un token (solo al iniciar la app)
  if (!userStore.user && userStore.token) {
    await userStore.loadUserFromToken();
  }

  const isAuthenticated = userStore.isAuthenticated;
  
  // 2. Comprobar si la ruta requiere autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Si requiere autenticación y no está logeado, lo mandamos a login
    next({ name: 'Login' });
  } 
  // 3. Comprobar si la ruta requiere ser invitado (ej: Login, Register)
  else if (to.meta.requiresGuest && isAuthenticated) {
    // Si está logeado e intenta acceder a Login/Register, lo mandamos al Dashboard
    next({ name: 'Dashboard' });
  } 
  // 4. Si pasa todas las comprobaciones, continuamos
  else {
    next();
  }
});
// **********************************

export default router;
