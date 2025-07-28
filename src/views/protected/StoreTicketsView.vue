<script setup>
import LayoutView from "@/views/layout/LayoutView.vue"
import supabase from "@/connection"
import { useRoute } from 'vue-router';
import { onMounted, reactive } from "vue"
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'primevue/usetoast';
import PaymentLabel from '@/components/Form/PaymentLabel.vue'

const toast = useToast();
const router = useRoute();
const auth = useAuthStore()

const paymentData = {
	bank: "bank",
	id: "000000",
	phone: "000000",
	amount: "10"
}

const store = reactive({
	store: {},
});

const form = reactive({
	number: 0,
	ref: 0
})

const selectedTickets = reactive({
	tickets: [],
	ticketsRelation: {},
	price: 1.2,
	amount: 0
})

const tickets = reactive({
	user: [],
	all: {},
	payment_status: false,
	payment_count: 0,

})

/**
 * Funcion para obtener info de la estore que esta visitando el usuario
 */
async function getDataOfStore() {
	const { data, error } = await supabase.from("store").select("*,store_user_ref(id_store),store_meta_data(*)").eq("id", router.params.id)
	// console.log(data)
	if (data) {
		store.store = data[0]
		store.users = data[0]?.store_user_ref.length || 0
		paymentData.amount = Number(tickets.payment_count * data[0].ticket_price).toFixed(2)
		data[0].store_meta_data.forEach(ele => {
			if (ele.key == "bank") {
				paymentData.bank = ele.value
			}
			if (ele.key == "id") {
				paymentData.id = ele.value
			}
			if (ele.key == "phone") {
				paymentData.phone = ele.value
			}
		})
	}
}

/**
 * Funcion para reservar los tickes elegidos
 */
async function reservTicket() {
	const tickets_numbers = [];

	selectedTickets.tickets.forEach(ele => {
		tickets_numbers.push(
			{ ticket_number: ele, id_user: auth.user_data.id, id_store: router.params.id, ticket_status: "pending" }
		)

	})


	const { data, error } = await supabase.from("tickets").insert(tickets_numbers)
	// console.log(data, error)

	if (error?.message.includes("duplicate key")) {
		alert("Ticket ya reservado, intenta con otro")
		return
	}

	form.number = 0
	selectedTickets.tickets = []
	selectedTickets.amount = 0
	getTicketsOfStore()
	getUserTickets()
}

/**
 * Funcion para obtener los tickets del usuario logueado
 */
async function getUserTickets() {
	const { data, error } = await supabase.from("tickets").select("*").eq("id_user", auth.user_data.id).eq("id_store", router.params.id)

	console.log(data, error)
	let countPayment = 0
	if (data) {
		data.forEach(ele => {
			if (ele.ticket_status == "pending") {
				countPayment++
			}
		})

		if (countPayment > 0) {
			tickets.payment_count = countPayment
			tickets.payment_status = false
		} else {
			tickets.payment_status = true
		}

		console.log({ countPayment })
		tickets.user = data
	}
	if (!error && data.length == 0) {
		tickets.payment_status = true
	}
}

/**
 * Funcion para obtener los tickes de la store que esta viendo el usuario
 */
async function getTicketsOfStore() {
	const { data, error } = await supabase.from("tickets").select("ticket_number").eq("id_store", router.params.id)

	// console.log(data, error)
	if (data) {
		data.forEach(tick => {
			tickets.all[tick.ticket_number] = tick.ticket_number
		})
	}
}

async function payment(e) {
	if (form.ref == 0) {
		toast.add({ severity: 'error', summary: 'Numero de referencia', detail: 'El numero de referencia no puede ser 0.', life: 6000, closable: true });
		return
	}

	const payment = []
	const ids = []

	tickets.user.forEach(ticket => {
		if (ticket.ticket_status == "pending") {
			ids.push(ticket.id)
			payment.push(
				{
					id_user: auth.user_data.id,
					id_store: router.params.id,
					id_ticket: ticket.id,
					amount_pay: Number(tickets.payment_count * store.store.ticket_price).toFixed(2),
					voucher_ref: form.ref
				}
			)
		}
	})

	const { data, error } = await supabase.from("payments").insert(payment).select()
	const { data2, error2 } = await supabase.from("tickets").update({ "ticket_status": "on-review" }).in("id", ids)

	// console.log(data, error)

	if (!error) {
		getUserTickets()
		e.target.closest("[popover]").togglePopover()
		toast.add({ severity: 'success', summary: 'Pago registrado', detail: 'El pago se ha registrado, espera a que sea aprovado.', life: 6000, closable: true });
	}

}

function hdlSelectTicket(tick) {
	const find = selectedTickets.tickets.find(ele => ele == tick)
	if (!find) {
		selectedTickets.tickets.push(tick)
		selectedTickets.ticketsRelation[tick] = tick
	} else {
		const filter = selectedTickets.tickets.filter(ele => ele != tick)
		selectedTickets.tickets = filter
		delete selectedTickets.ticketsRelation[tick]
	}
	form.number = selectedTickets.tickets.join(",")
	selectedTickets.amount = Number(selectedTickets.tickets.length * store.store.ticket_price
	).toFixed(2)
}


onMounted(() => {
	getDataOfStore()
	getUserTickets()
	getTicketsOfStore()
})

</script>

<template>
	<LayoutView>

		<main class="bg-gray-900 h-screen p-2 overflow-y-auto grid md:grid-cols-2">
			<div class="flex justify-center flex-col gap-4">
				<div>
					<span>Mis Tickets</span>

					<table class="w-[90%] md:w-[60%] m-auto rounded-md rounded-md overflow-hidden">
						<thead class="bg-gray-800">
							<tr class="text-center">
								<td class="p-2"> Numero de ticket</td>
								<td class="p-2">Estado</td>
							</tr>
						</thead>
						<tbody>
							<template v-if="tickets.user.length > 0" v-for="ticket in tickets.user">
								<tr>
									<td>{{ ticket.ticket_number }}</td>
									<template v-if="ticket.ticket_status == 'pending'">
										<td>Pago Pendiente</td>
									</template>
									<template v-if="ticket.ticket_status == 'on-review'">
										<td>En revision</td>
									</template>
									<template v-if="ticket.ticket_status == 'approved'">
										<td>Reservado</td>
									</template>
									<template v-if="ticket.ticket_status == 'failed'">
										<td>Fallido</td>
									</template>
								</tr>
							</template>
							<template v-else>
								<tr class="text-center">
									<td colspan="2">No haz reservado tickets</td>
								</tr>
							</template>
							<tr v-if="tickets.payment_status == false">
								<td colspan="2" class="text-center">
									<div class="flex justify-evenly items-center">
										Monto a pagar {{ Number(tickets.payment_count * store.store.ticket_price).toFixed(2) }}
										<button type="button" popovertarget="payment__modal"
											class="py-1 px-2 cursor-pointer rounded-md bg-green-500 hover:bg-green-300 transition-all duration-300">Pagar</button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>

					<template v-if="tickets.payment_status == false">
						<div popover id="payment__modal"
							class="bg-gray-900 w-[90%] sm:w-[60%] m-auto rounded-md backdrop:bg-black/30">
							<div class="p-4">
								<div class="text-center">
									<h3 class="text-2xl">Formulario de pago</h3>
									<small>Realiza el pago con los datos suministrados y coloca la referencia en el <label
											for="referencia" class="underline">campo</label>.</small>
								</div>
								<form @submit.prevent="payment($event)">
									<div class="rounded-md p-2 border-1 my-2">
										<div>
											<PaymentLabel :data-raw-to-copy="paymentData" label="Datos de Pago" />
											<PaymentLabel :data-to-copy="paymentData.bank" label="Banco" :value="paymentData.bank" />
											<PaymentLabel :data-to-copy="paymentData.id" label="Identificacion" :value="paymentData.id" />
											<PaymentLabel :data-to-copy="paymentData.phone" label="Telefono" :value="paymentData.phone" />
											<PaymentLabel :data-to-copy="paymentData.amount" label="Monto"
												:value="Number(tickets.payment_count * store.store.ticket_price).toFixed(2)" />
										</div>
									</div>
									<div class="flex flex-col gap-2">
										<label for="referencia">Referencia</label>
										<input class="border border-1 rounded-md py-1 px-2" type="number" name="referencia" id="referencia"
											v-model="form.ref" required>
									</div>
									<div class="px-2 py-4 flex justify-center items-center">
										<button type="submit"
											class="py-1 px-2 cursor-pointer rounded-md bg-blue-500 hover:bg-blue-300 transition-all duration-300">Pagar</button>
									</div>
								</form>
							</div>
						</div>
					</template>

				</div>

				<h2 class="text-center">Tickets disponibles</h2>
				<div class="max-w-[70%] m-auto text-center">
					<small>
						Selecciona los tickets para hacer una reserva y pagarlos despues, <strong>pero no demores en pagarlos o
							seran
							puestos a disposicion de otros usuarios</strong>.
					</small>
				</div>

				<div class="board grid grid-cols-[repeat(auto-fit,minmax(20px,50px))] gap-4 m-auto w-full max-w-[600px]">
					<template v-for="num in store.store.quantity_tickets">
						<button type="button" v-if="tickets.all[num]" class="reserved" inert="true">
							{{ num }}
						</button>

						<button type="button" v-else-if="selectedTickets.ticketsRelation[num]" @click="hdlSelectTicket(num)" class="selected">
							{{ num }}
						</button>

						<button type="button" v-else @click="hdlSelectTicket(num)">
							{{ num }}
						</button>
					</template>
				</div>
			</div>
			<div>
				<form class="bg-gray-800 p-2 shadow-md rounded-md flex flex-col justify-center items-center w-fit m-auto"
					v-if="selectedTickets.tickets.length > 0" @submit.prevent="reservTicket">
					<h2>Reservar tickets</h2>
					<div class="flex flex-col justify-center items-center">
						<div class="w-full">
							<span>Tickets seleccionado</span>

							<table class="w-full rounded-md rounded-md overflow-hidden">
								<thead class="bg-gray-600">
									<tr class="text-center">
										<td class="p-2"> Numero de ticket</td>
										<td class="p-2">Precio del ticket</td>
										<td class="p-2">Acciones</td>
									</tr>
								</thead>
								<tbody>
									<template v-for="tick in selectedTickets.tickets">
										<tr>
											<td>{{ tick }}</td>
											<td>${{ store.store.ticket_price }}</td>
											<td>
												<button type="button"
													class="cursor-pointer rounded-md px-2 py-1 border-1 border-red-500 hover:bg-red-500 transition-all text-white"
													@click="hdlSelectTicket(tick)">
													Quitar
												</button>
											</td>
										</tr>
									</template>
								</tbody>
							</table>
						</div>
						<div>
							<span>Monto que deberas pagar ${{ selectedTickets.amount }}</span>
						</div>
					</div>

					<div class="flex justify-center items-center">
						<button type="submit" class="px-2 py-1 rounded-md bg-blue-500 text-white cursor-pointer">Reservar</button>
					</div>
				</form>
			</div>
		</main>
	</LayoutView>
</template>

<style scoped>
@reference "../../assets/main.css";

.wrapp__tickets {
	@apply flex items-center flex-wrap p-2 gap-2
}

.board {

	& button {
		@apply bg-gray-500 p-2 rounded-sm cursor-pointer text-center text-white
	}

	& .reserved {
		opacity: .4;
		user-select: none;
		pointer-events: none;
	}

	& .selected {
		@apply bg-blue-500
	}
}
</style>
