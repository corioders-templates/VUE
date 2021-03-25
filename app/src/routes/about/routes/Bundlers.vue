<template>
	<Technologies :technologies="bundlers">Bundlers</Technologies>
</template>

<script lang="ts">
	import Technologies from '@about/components/Technologies.vue';
	import { useTechnologiesStore } from '@about/store/technologies';
	import { defineComponent } from 'vue';

	export default defineComponent({
		name: 'Bundlers',
		components: {
			Technologies,
		},
		setup() {
			const { technologies } = useTechnologiesStore();
			const { bundlers } = technologies;
			return { bundlers };
		},
	});
</script>
