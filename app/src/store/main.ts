import { defineStore } from 'pinia';

export const useMainStore = defineStore({
	id: 'main',
	state: () => ({
		author: 'corioders',
	}),
	getters: {
		getAuthor(): string {
			return `Created with ❤️ by ${this.author}`;
		},
	},
	actions: {},
});
