<template>
	<Technologies :technologies="backend">Backend</Technologies>
</template>

<script lang="ts">
	import Technologies from '@about/components/Technologies.vue';
	import { useTechnologiesStore } from '@about/store/technologies';
	import { defineComponent } from 'vue';

	export default defineComponent({
		name: 'Backend',
		components: {
			Technologies,
		},
		setup() {
			const { technologies } = useTechnologiesStore();
			const { backend } = technologies;
			return { backend };
		},
	});
</script>
