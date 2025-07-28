<script setup>
const props = defineProps({
	cssClass: { type: String, required: false }
})
</script>

<template>
	<table :class="cssClass">
		<slot />
	</table>
</template>

<style scoped>
	@reference "../assets/main.css";

	table{
	}

	tbody tr:nth-child(odd) {
		background-color: red;
		@apply bg-gray-700
	}

	tbody tr:nth-child(even) {
		@apply bg-gray-600
	}

	table td {
		@apply p-1
	}
</style>