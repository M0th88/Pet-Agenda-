import { createRouter, createWebHistory } from 'vue-router';

// Asegúrate de importar el .js al final
import { useUserStore } from '../store/UserStore.js';

// Vistas que usaremos
const routes = [
  // 1. NUEVA RUTA RAÍZ: LANDING PAGE (Pública)
  {
    path: '/',
    name: 'Landing',
    component: () => import('../views/LandingPage.vue'),
    // No tiene 'meta: { requiresAuth: true }' porque es pública
  },

  // 2. DASHBOARD DEL CLIENTE (Movido a /dashboard)
  {
    path: '/dashboard',
    name: 'Dashboard', 
    component: () => import('../views/Pets/DashboardPage.vue'), 
    meta: { requiresAuth: true } // CLAVE: Solo autenticados
  },

  // Detalle de mascota (Cliente)
  {
    path: '/pet/:id', 
    name: 'PetDetail',
    component: () => import('../views/Pets/PetDetailPage.vue'),
    meta: { requiresAuth: true }
  },

  // --- RUTAS DE ADMINISTRADOR ---
  {
    path: '/admin',
    name: 'AdminDashboard', // Vista del Admin (CRUD Clientes)
    component: () => import('../views/Admin/AdminDashboardPage.vue'),
    meta: { requiresAuth: true, requiresAdmin: true } // CLAVE: Solo Admin
  },
  {
    path: '/admin/pet/:id', // Vista del Admin (Gestionar Mascota)
    name: 'AdminPetDetail',
    component: () => import('../views/Admin/AdminPetDetailPage.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  // --- FIN RUTAS ADMIN ---

  // --- AUTENTICACIÓN ---
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

// *** GUARD DE NAVEGACIÓN GLOBAL (ACTUALIZADO) ***
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  
  // 1. Cargar datos del usuario si hay un token (solo al iniciar la app)
  if (!userStore.user && userStore.token) {
    // Lógica de carga de usuario si fuera necesaria
    // await userStore.loadUserFromToken(); 
  }

  const isAuthenticated = userStore.isAuthenticated;
  const isAdmin = userStore.isAdmin; 
  
  // 2. Comprobar si la ruta requiere ser ADMIN
  if (to.meta.requiresAdmin && !isAdmin) {
    // Si no es admin, lo mandamos al dashboard de usuario
    console.warn('Acceso de admin denegado. Redirigiendo a Dashboard.');
    next({ name: 'Dashboard' });
  }
  // 3. Comprobar si la ruta requiere autenticación (y no es admin)
  else if (to.meta.requiresAuth && !isAuthenticated) {
    // Si requiere autenticación y no está logeado, lo mandamos a login
    console.warn('Acceso no autenticado. Redirigiendo a Login.');
    next({ name: 'Login' });
  } 
  // 4. Comprobar si la ruta requiere ser invitado (ej: Login, Register)
  else if (to.meta.requiresGuest && isAuthenticated) {
    // Si está logeado e intenta acceder a Login/Register, lo mandamos a su Dashboard correspondiente
    console.warn('Usuario autenticado intentando acceder a ruta de invitado.');
    if (isAdmin) {
      next({ name: 'AdminDashboard' });
    } else {
      next({ name: 'Dashboard' });
    }
  } 
  // 5. Si pasa todas las comprobaciones, continuamos
  else {
    next();
  }
});

export default router;