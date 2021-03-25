import { defineStore } from 'pinia';

export const useTechnologiesStore = defineStore({
	id: 'technologies',
	state: () => ({
		technologies: {
			frontend: [
				{
					name: 'Vue 3',
					link: 'https://v3.vuejs.org/',
				},
				{
					name: 'Typescript',
					link: 'https://www.typescriptlang.org/',
				},
				{
					name: 'SCSS',
					link: 'https://sass-lang.com/',
				},
			],
			bundlers: [
				{
					name: 'Webpack 5',
					link: 'https://webpack.js.org/',
				},
			],
			communication: [
				{
					name: 'gRPC-web',
					link: 'https://github.com/improbable-eng/grpc-web',
				},
			],
			backend: [
				{
					name: 'Go',
					link: 'https://golang.org/',
				},
			],
		},
	}),
	getters: {
		getTypes(): Array<string> {
			return Object.getOwnPropertyNames(this.technologies);
		},
	},
});
