<script setup>
import Toast from 'primevue/toast';
</script>
<template>
	<div class="flex justify-center items-center bg-gray-800 h-screen">
		<div class="w-[80%] max-w-[400px] rounded-lg shadow-lg p-4 bg-gray-700">
			<slot />
		</div>
	</div>
	<Toast position="bottom-right" />
</template>