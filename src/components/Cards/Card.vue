<script setup>
import { RouterLink } from 'vue-router';
import StoreIcon from '@/components/icons/StoreIcon.vue'
import TicketIcon from '@/components/icons/TicketIcon.vue'
import BanknoteIcon from '@/components/icons/BanknoteIcon.vue'

const props = defineProps({
	url: { type: String, required: true },
	store_name: { type: String, required: true },
	quantity_tickets: { type: Number, required: true },
	ticket_price: { type: Number, required: true },
	cssClass: { type: String, required: false }
})

</script>
<template>
	<RouterLink :to="url"
		:class="`${cssClass} flex flex-col justify-center items-center gap-4 p-4 rounded-md bg-gray-800 text-white cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-700/30 hover:bg-blue-600 focus:shadow-xl focus:shadow-blue-700/30 focus:bg-blue-600`"
		:title="store_name">

		<span class="flex flex-col items-center">
			<StoreIcon />
			{{ store_name }}
		</span>
		<div class="flex items-center justify-evenly gap-6 w-full">
			<span class="flex flex-col items-center" title="Numero de Tickets">
				{{ quantity_tickets }}
				<TicketIcon />
			</span>
			<span class="flex flex-col items-center" title="Precio de Cada Ticket">
				{{ ticket_price }}
				<BanknoteIcon />
			</span>
		</div>
	</RouterLink>
</template>