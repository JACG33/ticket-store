<script setup>
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore()
</script>

<template>
	<template v-if="auth?.user_data?.type_user == 'admin' || auth?.user_data?.type_user == 'owner'">
		<slot />
	</template>
</template>