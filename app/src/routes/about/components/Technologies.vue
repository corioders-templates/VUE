<template>
	<div class="technologies">
		<h3><slot></slot></h3>
		<Flex>
			<a v-for="technology in technologies" :key="technology.name" :href="technology.link" target="_blank" rel="noopener noreferrer">{{ technology.name }}</a>
		</Flex>
	</div>
</template>

<script lang="ts">
	import { defineComponent, PropType } from 'vue';

	import Flex from '@/layouts/Flex.vue';

	type Technology = {
		name: string;
		link: string;
	};
	type Technologies = Array<Technology> | [];

	export default defineComponent({
		name: 'Technologies',
		components: { Flex },
		props: {
			technologies: {
				type: Array as PropType<Technologies>,
				default: [],
			},
		},
	});
</script>
<style lang="scss" scoped>
	@use '@/scss/extensions/_link';

	a {
		@extend %a-link;
	}
</style>
