<template>
	<div class="nav">
		<router-link to="/">Home</router-link> |
		<router-link to="/about">About</router-link>
	</div>
</template>

<style lang="scss" scoped>
	@use '@/scss/extensions/_link';

	.nav {
		padding: 30px;
		margin-bottom: 50px;

		a {
			@extend %router-link;
		}
	}
</style>
