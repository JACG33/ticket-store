import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';

import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)
app.use(PrimeVue, {
	theme: {
		preset: Aura
	}
})
app.use(ToastService)
app.use(pinia)
app.use(router)

app.mount('#app')

const auth = useAuthStore(pinia)
auth.initStore()