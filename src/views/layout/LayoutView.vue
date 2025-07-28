<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomeIcon from '@/components/icons/HomeIcon.vue'
import LogOutIcon from '@/components/icons/LogOutIcon.vue'
import UsersIcon from '@/components/icons/UsersIcon.vue'
import AdminSlotView from '@/components/protected_slot/AdminSlotView.vue'
import Toast from 'primevue/toast';

const auth = useAuthStore()
const router = useRouter()

async function logout() {
	try {
		await auth.logout()
		router.replace("/login")
	} catch (e) {
		console.log(e)
	}
}


</script>
<template>
	<div class="grid grid-cols-[120px_1fr] h-screen">
		<aside class="bg-gray-800 w-full grid grid-rows-[60px_1fr_60px] justify-center gap-2 px-2">
			<img alt="App logo" class="rounded-full m-auto" src="@/assets/logo.webp" width="60" height="60" loading="lazy" />

			<nav class="w-full flex flex-col items-center gap-2 text-white">
				<RouterLink :to="`/${auth?.user_data?.user_metadata.user_name} `"
					class="w-full flex items-center gap-1 px-3 py-1 bg-blue-500 rounded-sm text-white cursor-pointer">
					<HomeIcon /> Home
				</RouterLink>
				<AdminSlotView>
					<RouterLink to="/users"
						class="w-full flex items-center gap-1 px-3 py-1 bg-blue-500 rounded-sm text-white cursor-pointer">
						<UsersIcon /> Usuarios
					</RouterLink>
				</AdminSlotView>
			</nav>
			<div>
				<button @click="logout" type="button"
					class="w-full flex items-center gap-1 px-3 py-1 bg-red-500 rounded-sm text-white cursor-pointer">
					<LogOutIcon /> salir
				</button>

				<footer class="bg-gray-800 text-center text-white flex justify-center items-center">
					<small>
						<a href="https://jacg.pages.dev" target="_blank">powered @jacg33</a>
					</small>
				</footer>
			</div>
		</aside>

		<Toast position="bottom-right" />
		<slot />

	</div>
</template>