<script setup>
import AuthLayout from '@/views/layout/AuthLayout.vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { watch, reactive } from 'vue';
import LoaderCircleIcon from '@/components/icons/LoaderCircleIcon.vue'
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const auth = useAuthStore()
const router = useRouter()
const form = reactive({
	email: "",
	pass: "",
	user: ""
})

async function hdlSubmit() {

	if (form.email.trim() == "") {
		toast.add({ severity: 'error', summary: 'Error', detail: 'El correo es necesario.', life: 6000, closable: true });
		return
	}

	if (form.user.trim() == "") {
		toast.add({ severity: 'error', summary: 'Error', detail: 'El usuario es necesario.', life: 6000, closable: true });
		return
	}

	if (form.pass.trim() == "") {
		toast.add({ severity: 'error', summary: 'Error', detail: 'La Contraseña es necesaria.', life: 6000, closable: true });
		return
	}

	try {
		await auth.singUp({ email: form.email, password: form.pass, user: form.user })
		console.log(error)
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
			<h1 class="text-4xl font-bold text-center text-white">Crear Cuenta</h1>
			<div class="flex flex-col gap-2">
				<label class="text-white font-bold">Correo</label>
				<input type="email" name="email" id="email" class="px-2 py-1 border-1 border-gray-600 rounded-lg text-white"
					v-model="form.email">
			</div>

			<div class="flex flex-col gap-2">
				<label class="text-white font-bold">Usuario</label>
				<input type="text" name="username" id="username"
					class="px-2 py-1 border-1 border-gray-600 rounded-lg text-white" v-model="form.user">
			</div>

			<div class="flex flex-col gap-2">
				<label class="text-white font-bold">Contraseña</label>
				<input type="password" name="pass" id="pass" class="px-2 py-1 border-1 border-gray-600 rounded-lg text-white"
					v-model="form.pass">
			</div>

			<div class="mt-4">
				<RouterLink to="/login" class="underline">Ya tienes cuenta inicia sesión</RouterLink>
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
						Crear cuenta
					</button>
				</template>
			</div>

			<div class="text-center text-sm">
				<RouterLink to="/">Pagina de inicio</RouterLink>
			</div>
		</form>
	</AuthLayout>
</template>