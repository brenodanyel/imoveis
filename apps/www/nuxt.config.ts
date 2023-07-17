// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	pages: true,
	runtimeConfig: {
		public: {
			...(process.env.NODE_ENV === 'production'
				? {
						baseURL: 'https://imoveis-backend.vercel.app/',
						painelURL: 'https://imoveis-painel.vercel.app/',
				  }
				: {
						baseURL: 'http://localhost:3000',
						painelURL: 'http://localhost:5173',
				  }),
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
