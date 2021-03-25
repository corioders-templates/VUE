<template>
	<Technologies :technologies="communication">Communication</Technologies>
</template>

<script lang="ts">
	import Technologies from '@about/components/Technologies.vue';
	import { useTechnologiesStore } from '@about/store/technologies';
	import { defineComponent } from 'vue';

	export default defineComponent({
		name: 'Communication',
		components: {
			Technologies,
		},
		setup() {
			const { technologies } = useTechnologiesStore();
			const { communication } = technologies;
			return { communication };
		},
	});
</script>
