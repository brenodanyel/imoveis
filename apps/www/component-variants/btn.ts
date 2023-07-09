import { tv } from 'tailwind-variants';

export default tv({
	base: ' ',
	variants: {
		color: {
			primary: 'bg-red-500 text-white',
			secondary: 'bg-purple-500 text-white',
		},
		size: {
			sm: 'text-sm',
			md: 'text-base',
			lg: 'px-4 py-3 text-lg',
		},
	},
	defaultVariants: {
		size: 'md',
		color: 'primary',
	},
});

console.log('btn.ts2');
