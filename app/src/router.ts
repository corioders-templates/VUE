import { createRouter, createWebHashHistory } from 'vue-router';
import { RouteRecordRaw } from 'vue-router';

import home from '@/routes/home.vue';
import aboutRoutes from '@about/routes';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'home',
		component: home,
	},
	...aboutRoutes('/'),
];

const router = createRouter({
	routes,
	history: createWebHashHistory(),
});

export default router;
