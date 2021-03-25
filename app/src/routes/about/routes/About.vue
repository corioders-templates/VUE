<template>
	<Flex>
		<router-link v-for="type in types" :key="type" :to="`/about/${type}`">{{ type }}</router-link>
	</Flex>
</template>

<script lang="ts">
	import { useTechnologiesStore } from '@about/store/technologies';
	import { defineComponent } from 'vue';

	import Flex from '@/layouts/Flex.vue';

	export default defineComponent({
		name: 'About',
		components: { Flex },
		setup() {
			const { getTypes } = useTechnologiesStore();
			return { types: getTypes };
		},
	});
</script>
<style lang="scss" scoped>
	@use '@/scss/extensions/_link';
	
	a {
		@extend %a-link;
	}
</style>
