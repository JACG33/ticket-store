<script setup>
import LayoutView from '@/views/layout/LayoutView.vue';
import { reactive } from 'vue';
import supabase from '@/connection';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import LoaderCircleIcon from '@/components/icons/LoaderCircleIcon.vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const router = useRouter()
const auth = useAuthStore()
const form = reactive({
	name: "",
	quantity: 0,
	price: 0,
	bank: "",
	id: "",
	phone: "",
	pending: false
})

const show = ({ type = "" }) => {
	if (type == "error")
		toast.add({ severity: 'error', summary: 'Error', detail: 'Ya existe una store con ese nombre, intenta con otro', life: 6000, closable: true });
	if (type == "success")
		toast.add({ severity: 'success', summary: 'Store creado', detail: 'El store se ha creado existosamente', life: 6000, closable: true });
};

async function hdlSubmit() {
	form.pending = true
	const { data, error } = await supabase.from("store").insert({
		id_user: auth.user_data.id,
		store_name: form.name,
		quantity_tickets: form.quantity,
		ticket_price: form.price
	}).select()

	console.log(data, error)


	if (error?.message.includes("duplicate key")) {
		show({ type: "error" })
		form.pending = false
		return
	}

	if (!error) {


		const metadata = [
			{ id_store: data[0].id, key: "bank", value: form.bank },
			{ id_store: data[0].id, key: "id", value: form.id },
			{ id_store: data[0].id, key: "phone", value: form.phone },
		]

		const { datameta, error } = await supabase.from("store_meta_data").insert(metadata).select()

		form.name = ""
		form.quantity = 0
		form.price = 0
		form.bank = ""
		form.id = ""
		form.phone = ""
		show({ type: "success" })
		// router.replace(`/${auth?.user_data.user_metadata.user_name}`)
	}
	form.pending = false
}
</script>

<template>
	<LayoutView>
		<main class="bg-gray-900 h-screen px-2 py-1">
			<div class="text-white">
				<h1 class="text-4xl font-bold text-center text-white">Crear nueva Store</h1>
			</div>

			<form class="flex flex-col gap-2 px-2" @submit.prevent="hdlSubmit">
				<h1 class="text-2xl text-center text-white">Datos de la Store</h1>
				<div class="flex flex-col gap-2">
					<label class="text-white">Nombre</label>
					<input type="text" name="name_store" id="name_store"
						class="px-2 py-1 border-1 border-gray-600 rounded-lg text-white" v-model="form.name">
				</div>

				<div class="flex flex-col gap-2">
					<label class="text-white">Cantidad de Tickets</label>
					<input type="number" min="10" name="" id="" class="px-2 py-1 border-1 border-gray-600 rounded-lg text-white"
						v-model="form.quantity">
				</div>

				<div class="flex flex-col gap-2">
					<label class="text-white">Precio de Tickets</label>
					<input type="number" step="0.01" min="0.01" name="" id=""
						class="px-2 py-1 border-1 border-gray-600 rounded-lg text-white" v-model="form.price">
				</div>

				<hr>

				<div class="flex flex-col gap-2">
					<label class="text-white">Banco</label>
					<input type="text" name="" id="" class="px-2 py-1 border-1 border-gray-600 rounded-lg text-white"
						v-model="form.bank">
				</div>

				<div class="flex flex-col gap-2">
					<label class="text-white">Identificacion</label>
					<input type="text" name="" id="" class="px-2 py-1 border-1 border-gray-600 rounded-lg text-white"
						v-model="form.id">
				</div>


				<div class="flex flex-col gap-2">
					<label class="text-white">Telefono</label>
					<input type="tel" name="" id="" class="px-2 py-1 border-1 border-gray-600 rounded-lg text-white"
						v-model="form.phone">
				</div>

				<div class="flex justify-center py-2">
					<template v-if="form.pending">
						<button type="submit" :disabled="form.pending"
							class="px-2 py-1 bg-blue-500 rounded-sm text-white cursor-pointer">
							<LoaderCircleIcon class="animate-spin" />
						</button>
					</template>
					<template v-else>
						<button type="submit" class="px-2 py-1 bg-blue-500 rounded-sm text-white cursor-pointer">
							Crear
						</button>
					</template>
				</div>

			</form>
		</main>
	</LayoutView>
</template>