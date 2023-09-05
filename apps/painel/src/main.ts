import { inject } from '@vercel/analytics';
import { createApp } from 'vue';

import App from './App.vue';

import { setup as setupQuasar } from './boot/quasar';
import { setup as setupRouter } from './boot/router';
import { setup as setupStores } from './boot/stores';
import { setup as setupVueQuery } from './boot/vue-query';

import './global.css';

const app = createApp(App);

setupQuasar(app);
setupRouter(app);
setupStores(app);
setupVueQuery(app);

app.mount('#app');

if (import.meta.env.PROD) {
	inject();
}
