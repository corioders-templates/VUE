<template>
	<Technologies :technologies="frontend">Frontend</Technologies>
</template>

<script lang="ts">
	import Technologies from '@about/components/Technologies.vue';
	import { useTechnologiesStore } from '@about/store/technologies';
	import { defineComponent } from 'vue';

	export default defineComponent({
		name: 'Frontend',
		components: {
			Technologies,
		},
		setup() {
			const { technologies } = useTechnologiesStore();
			const { frontend } = technologies;
			return { frontend };
		},
	});
</script>
