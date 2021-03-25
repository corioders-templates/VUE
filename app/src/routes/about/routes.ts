import { Component } from 'vue';
import { RouteRecordRaw } from 'vue-router';

const getRoutes = (rootPath: string): RouteRecordRaw[] => [
	{
		path: `${rootPath}about`,
		component: (): Promise<Component> => import('@about/AboutApp.vue'),
		children: [
			{
				path: '',
				name: 'about',
				component: (): Promise<Component> => import('@about/routes/About.vue'),
			},
			{
				path: 'frontend',
				name: 'frontend',
				component: (): Promise<Component> => import('@about/routes/Frontend.vue'),
			},
			{
				path: 'bundlers',
				name: 'bundlers',
				component: (): Promise<Component> => import('@about/routes/Bundlers.vue'),
			},
			{
				path: 'communication',
				name: 'communication',
				component: (): Promise<Component> => import('@about/routes/Communication.vue'),
			},
			{
				path: 'backend',
				name: 'backend',
				component: (): Promise<Component> => import('@about/routes/Backend.vue'),
			},
		],
	},
];

export default getRoutes;
