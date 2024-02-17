import {createApp} from 'vue';
import PrimeVue from 'primevue/config';
import App from './App.vue'
import Tooltip from 'primevue/tooltip';
import ToastService from 'primevue/toastservice';

export const app = createApp(App);
app.use(PrimeVue);
app.use(ToastService);
app.directive('tooltip', Tooltip);
app.mount('#app')
import 'primevue/resources/themes/aura-light-green/theme.css';
import '@/assets/style/main.scss';