<script setup>
import { reactive, watch } from 'vue';
import AuthLayout from '@/views/layout/AuthLayout.vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth.js";
import LoaderCircleIcon from '@/components/icons/LoaderCircleIcon.vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const auth = useAuthStore()
const router = useRouter()
const form = reactive({
	email: "",
	pass: ""
})

async function hdlSubmit() {

	if (form.email.trim() == "") {
		toast.add({ severity: 'error', summary: 'Error', detail: 'El correo es necesario.', life: 6000, closable: true });
		return
	}

	if (form.pass.trim() == "") {
		toast.add({ severity: 'error', summary: 'Error', detail: 'La Contraseña es necesaria.', life: 6000, closable: true });
		return
	}

	try {
		await auth.authenticate({ email: form.email, password: form.pass })
	} catch (e) {
		console.log(e)
	}
}

watch(auth, () => {
	if (auth.user) {
		router.replace(`/${auth?.user_data.user_metadata.user_name}`)
	}
})
</script>

<template>
	<AuthLayout>
		<form class="flex flex-col gap-2 px-2" @submit.prevent="hdlSubmit">
			<h1 class="text-4xl font-bold text-center text-white">Iniciar sesión</h1>
			<div class="flex flex-col gap-2">
				<label class="text-white font-bold">Correo</label>
				<input type="email" name="email" id="email" class="px-2 py-1 border-1 border-gray-600 rounded-lg text-white"
					v-model="form.email">
			</div>

			<div class="flex flex-col gap-2">
				<label class="text-white font-bold">Contraseña</label>
				<input type="password" name="pass" id="pass" class="px-2 py-1 border-1 border-gray-600 rounded-lg text-white"
					v-model="form.pass">
			</div>

			<div class="mt-4">
				<RouterLink to="/signup" class="underline">No tienes cuenta crea una</RouterLink>
			</div>

			<div class="flex justify-end py-2">
				<template v-if="auth.pending">
					<button type="submit" :disabled="auth.pending"
						class="px-2 py-1 bg-blue-500 rounded-sm text-white cursor-pointer">
						<LoaderCircleIcon class="animate-spin" />
					</button>
				</template>
				<template v-else>
					<button type="submit" class="px-2 py-1 bg-blue-500 rounded-sm text-white cursor-pointer">
						Iniciar sesion
					</button>
				</template>
			</div>

			<div class="text-center text-sm">
				<RouterLink to="/">Pagina de inicio</RouterLink>
			</div>
		</form>
	</AuthLayout>
</template>