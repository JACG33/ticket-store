<script setup>
import LayoutView from '@/views/layout/LayoutView.vue';
import supabase from "@/connection"
import { useRoute } from 'vue-router';
import { onMounted, reactive, ref } from "vue"
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRoute();
const store = reactive({
	store: {},
	users: 0,
	payments: []
});

const updatePayment = ref("")

const userSelected = reactive({
	id_user: null,
	id_store: null,
	id_tickets: null
})

async function getStore() {
	const { data, error } = await supabase.from("store").select("*,store_user_ref(id_store,id_user)").eq("id", router.params.id)

	if (data.length > 0) {
		store.store = data[0]
		store.users = data[0]?.store_user_ref.length || 0

		const { data: payments, error: paymentserror } = await supabase.from("payments").select("*,users(user_name)").eq("id_store", router.params.id)

		if (payments.length > 0) {
			let tmpPayments = {}
			let mount = 0

			// Agrupar los pagos en uno solo de acuerdo al voucher_ref
			payments.forEach(ele => {
				if (tmpPayments[ele.voucher_ref]) {
					tmpPayments[ele.voucher_ref].id_tickets.push(ele.id_ticket)
				} else {
					tmpPayments[ele.voucher_ref] = { ...ele, id_tickets: [ele.id_ticket] }
				}
			})

			let maped = []

			// Extraer los objetos
			for (let pay in tmpPayments) {
				mount += tmpPayments[pay].amount_pay
				maped.push(tmpPayments[pay])
			}

			store.payments = maped
			store.store.accumulated = mount
		}
	}
}

async function hdlPayment(user) {
	userSelected.id_user = user.id_user
	userSelected.id_store = user.id_store
	userSelected.id_tickets = user.id_tickets
}

async function submitPayment(e) {

	console.log(userSelected.id_tickets)
	if (userSelected.id_tickets.length > 0) {

		const { data, error } = await supabase.from("payments").update({ "payment_status": updatePayment.value }).in("id_ticket", userSelected.id_tickets)

		if (!error) {
			const { data, error } = await supabase.from("tickets").update({ "ticket_status": updatePayment.value }).in("id", userSelected.id_tickets)

			toast.add({ severity: 'success', summary: 'Estado Cambiado', detail: 'El estado de la factura se a Cambiado', life: 6000, closable: true });
		}
	}

	e.target.closest("[popover]").togglePopover()
	getStore()
}


onMounted(() => {
	getStore()
})

</script>

<template>
	<LayoutView>
		<main class="bg-gray-900 h-screen overflow-y-auto px-2 py-1 flex flex-col pb-4">
			<div class="text-white mb-8">
				<h1 class="text-4xl font-bold text-center text-white">Store {{ store?.store?.store_name }}</h1>
			</div>

			<div class="w-[90%] m-auto">
				<div class="flex flex-col gap-1">
					<span><strong>Nombre de la Store</strong> {{ store?.store?.store_name }}</span>
					<span><strong>Numero de tickets</strong> {{ store?.store?.quantity_tickets }}</span>
					<span><strong>Precio de cada ticket</strong> ${{ store?.store?.ticket_price }}</span>
					<span><strong>Fecha de creacion</strong> {{ new Date(store?.store?.created_at).toLocaleDateString()
					}}</span>
					<span><strong>Numero de participantes</strong> {{ store?.users }}</span>
					<span><strong>Dinero acumulado ${{ store?.store?.accumulated || 0 }}</strong></span>
				</div>

				<br>

				<div>
					<div>
						<h3 class="text-center text-2xl">Facturas Realizadas</h3>
					</div>
					<table class="w-full rounded-md rounded-md overflow-hidden">
						<thead class="bg-gray-800">
							<tr class="text-center">
								<td class="p-2">Usuario</td>
								<td class="p-2">Referencia</td>
								<td class="p-2">Monto</td>
								<td class="p-2">Estado</td>
								<td class="p-2">Acciones</td>
							</tr>
						</thead>
						<tbody>
							<template v-if="store.payments.length > 0" v-for="payment in store.payments">
								<tr>
									<td>{{ payment.users.user_name }}</td>
									<td>{{ payment.voucher_ref }}</td>
									<td>{{ payment.amount_pay }}</td>
									<template v-if="payment.payment_status == 'approved'">
										<td>Pagado</td>
									</template>
									<template v-if="payment.payment_status == 'pending'">
										<td>Pendiente</td>
									</template>
									<template v-if="payment.payment_status == 'failed'">
										<td>En revision</td>
									</template>
									<td>
										<template v-if="payment.payment_status == 'approved'">
											<span>sin accion</span>
										</template>
										<template v-else>
											<button type="button" popovertarget="popover__payment" @click="hdlPayment(payment)"
												class="px-2 py-1 bg-green-500 cursor-pointer rounded-md">
												Cambiar estatus
											</button>
										</template>
									</td>
								</tr>
							</template>
							<template v-else>
								<tr class="text-center">
									<td colspan="5">No se han realizado pagos</td>
								</tr>
							</template>
						</tbody>
					</table>

					<div popover id="popover__payment"
						class="bg-gray-900 w-[90%] sm:w-[60%] m-auto rounded-md backdrop:bg-black/30">
						<div>
							<div class="text-center">
								<h3 class="text-2xl">Cambiar el estado de la factura</h3>
							</div>
							<form @submit.prevent="submitPayment($event)">
								<div class="flex flex-col gap-2">
									<label>Estaus del pago</label>
									<select class="border border-1 rounded-md py-1 px-2 bg-gray-800" v-model="updatePayment" required>
										<option value="">Eliga el estado del pago</option>
										<!-- <option value="pending">Pendiente</option> -->
										<option value="approved">Pagado</option>
										<option value="failed">Fallido</option>
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
				</div>
			</div>
		</main>
	</LayoutView>
</template>