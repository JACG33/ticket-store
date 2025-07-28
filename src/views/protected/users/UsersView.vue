<script setup>
import LayoutView from '@/views/layout/LayoutView.vue';
import { reactive, onMounted, ref } from 'vue';
import supabase from '@/connection';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const users = reactive({
	users: []
})


const updaterol = ref("")
const userSelected = reactive({
	id_user: null,
})


async function getUsers() {
	const { data, error } = await supabase.from("users").select();

	if (!error) {
		users.users = data
	}

}

async function hdlPayment(user) {
	userSelected.id_user = user.id
}

async function submitChangeRol(e) {
	const { data, error } = await supabase.from("users").update({ "type_user": updaterol.value }).eq("id", userSelected.id_user)

	if (!error)
		getUsers()

	e.target.closest("[popover]").togglePopover()
}

onMounted(() => {
	getUsers()
})

</script>

<template>
	<LayoutView>
		<main class="bg-gray-900 h-screen px-2 py-1">
			<div class="text-white">
				<h1 class="text-4xl font-bold text-center text-white">Usuarios</h1>
			</div>

			<table class="w-full rounded-md rounded-md overflow-hidden max-w-[450px] m-auto">
				<thead class="bg-gray-800">
					<tr class="text-center">
						<td class="p-2">Usuario</td>
						<td class="p-2">Rol</td>
						<td class="p-2">Acciones</td>
					</tr>
				</thead>
				<tbody>
					<template v-if="users.users.length > 0" v-for="user in users.users">
						<tr>
							<td>{{ user.user_name }}</td>
							<td>{{ user.type_user }}</td>
							<td><button type="button" popovertarget="popover__payment" @click="hdlPayment(user)"
									class="px-2 py-1 bg-green-500 cursor-pointer rounded-md">
									Cambiar rol de usuario
								</button></td>
						</tr>
					</template>
					<template v-else>
						<tr class="text-center">
							<td colspan="5">No hay usuarios</td>
						</tr>
					</template>
				</tbody>
			</table>

			<div popover id="popover__payment" class="bg-gray-900 w-[90%] sm:w-[60%] m-auto rounded-md backdrop:bg-black/30">
				<div>
					<div class="text-center">
						<h3 class="text-2xl">Cambiar el rol del usuario</h3>
					</div>
					<form @submit.prevent="submitChangeRol($event)">
						<div class="flex flex-col gap-2">
							<label>Rol de Usuario</label>
							<select class="border border-1 rounded-md py-1 px-2 bg-gray-800" v-model="updaterol" required>
								<option value="">Eliga el rol</option>
								<option value="admin">Administrador</option>
								<option value="owner">Organizador</option>
								<option value="suscriber">Suscriptor</option>
							</select>
						</div>

						<div class="px-2 py-4 flex justify-center items-center">
							<button type="submit"
								class="py-1 px-2 cursor-pointer rounded-md bg-blue-500 hover:bg-blue-300 transition-all duration-300">
								Cambiar
							</button>
						</div>
					</form>
				</div>
			</div>
		</main>
	</LayoutView>
</template>
