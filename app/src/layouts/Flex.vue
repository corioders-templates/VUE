<template>
	<div class="flex"><slot></slot></div>
</template>

<style lang="scss" scoped>
	.flex {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
