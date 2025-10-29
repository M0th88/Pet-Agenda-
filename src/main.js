// import './assets/base.css' // Importa estilos base (puede ser diferente en tu proyecto)

import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // <--- Importa el router
import { createPinia } from 'pinia' // <--- Importa Pinia
import './assets/style.css' // <-- Importa Tailwind

const app = createApp(App)

app.use(createPinia()) // <--- Usa Pinia
app.use(router) // <--- Usa Vue Router

app.mount('#app')