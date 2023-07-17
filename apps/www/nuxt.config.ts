// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	pages: true,
	runtimeConfig: {
		public: {
			baseURL: process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : 'https://imoveis-backend.vercel.app/',
		},
	},
	devtools: { enabled: false },
	css: ['bootstrap-icons/font/bootstrap-icons.css'],
	imports: {
		dirs: ['types'],
	},
	vite: {
		vue: {
			script: {
				defineModel: true,
				propsDestructure: true,
			},
		},
	},
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
});
