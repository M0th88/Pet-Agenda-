// 1. IMPORTACIÓN DE ESTILOS (MOVIDA AL INICIO)
import './assets/style.css' 

// (Asegúrate de que 'base.css' no se esté importando)
// import './assets/base.css' 

import { createApp } from 'vue'
import App from './App.vue'
// Usa la ruta completa al archivo del router para evitar errores
import router from './router/index.js' 
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(createPinia())
app.use(router) 

app.mount('#app')
