import { type Config } from 'tailwindcss';

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./components-variants/**/*.{js,vue,ts}',
		'./components/**/*.{js,vue,ts}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./plugins/**/*.{js,ts}',
		'./nuxt.config.{js,ts}',
		'./app.vue',
	],
	theme: {
		extend: {},
	},
	plugins: [],
} satisfies Config;
