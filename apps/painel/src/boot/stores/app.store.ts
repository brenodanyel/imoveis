import { defineStore } from 'pinia';
import { Dark } from 'quasar';

type State = {
	dark: boolean;
};

export const useAppStore = defineStore('app', {
	state(): State {
		return {
			dark: localStorage.getItem('sucatech:dark')
				? localStorage.getItem('sucatech:dark') === 'true'
				: window.matchMedia('(prefers-color-scheme: dark)').matches,
		};
	},
	actions: {
		setDark(state: boolean) {
			this.dark = state;
			localStorage.setItem('sucatech:dark', state.toString());
			Dark.set(state);
		},
	},
});
