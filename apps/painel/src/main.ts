import { inject } from '@vercel/analytics';
import 'dotenv/config';
import { createApp } from 'vue';

import App from './App.vue';
import { setup as setupQuasar } from './boot/quasar';
import { setup as setupRouter } from './boot/router';
import { setup as setupStores } from './boot/stores';
import './global.css';

const app = createApp(App);

setupQuasar(app);
setupRouter(app);
setupStores(app);

app.mount('#app');

if (import.meta.env.PROD) {
	inject();
}
