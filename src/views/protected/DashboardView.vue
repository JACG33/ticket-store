<script setup>
import LayoutView from '@/views/layout/LayoutView.vue';
import { RouterLink } from 'vue-router';
import supabase from '@/connection';
import { reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import PlusIcon from '@/components/icons/PlusIcon.vue'
import EllipsisVerticalIcon from '@/components/icons/EllipsisVerticalIcon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'
import LinkIcon from '@/components/icons/LinkIcon.vue'
import OwnerSlotView from '@/components/protected_slot/OwnerSlotView.vue'
import { useToast } from 'primevue/usetoast';
import Card from '@/components/Cards/Card.vue'

const toast = useToast();

const auth = useAuthStore()
const stores = reactive({
	stores: [],
	joined: []
})

async function getStores() {
	const { data, error } = await supabase.from("store").select().eq("id_user", auth.user_data.id)

	if (data) {
		stores.stores = data
	}
}

async function getStoresJoined() {
	const { data, error } = await supabase.from("store_user_ref").select("id_store").eq("id_user", auth.user_data.id)

	if (data) {
		const ids = data.map(ele => ele.id_store)

		const { data: joined, error } = await supabase.from("store").select().in("id", ids)
		if (joined) {
			console.log(joined)
			stores.joined = joined
		}
	}
}

async function deleteStore(id, e) {
	const res = await supabase.from("store").delete().eq("id", id)
	if (res.status == 204) {
		e.target.closest("[popover]").togglePopover()
		toast.add({ severity: 'success', summary: 'Store eliminado', detail: 'El store se ha eliminado existosamente', life: 6000, closable: true });
		getStores()
	}
}

async function copyLink(namestore, e) {
	try {
		await navigator.clipboard.writeText(`${location.origin}/shared/store/${namestore}/by/${auth.user_data.id}`)
		setTimeout(() => {
			toast.add({ severity: 'success', summary: 'Link Copiado', detail: 'Se ha copiado el link del Store', life: 6000, closable: true })
		}, 500);
	} catch (error) {
		console.log(error);
	} finally {
		e.target.closest("[popover]").togglePopover()
	}
}

onMounted(() => {
	getStores()
	getStoresJoined()
})

</script>

<template>
	<LayoutView>
		<main class="bg-gray-900 h-screen px-4 py-2 pb-4 overflow-y-auto">

			<OwnerSlotView>
				<div class="flex justify-center items-center py-3">
					<RouterLink :to="`/${auth?.user_data?.user_metadata.user_name}/store/create`"
						class="flex gap-2 items-center p-4 rounded-md bg-gray-800 text-white cursor-pointer hover:bg-blue-600 transition-all duration-350 hover:shadow-lg hover:shadow-blue-900/30">
						Crear nueva store
						<PlusIcon />
					</RouterLink>
				</div>

				<!-- Stores creadas por el usuario -->
				<div class="mb-4">
					<h2 class="text-xl text-white">Stores Creadas</h2>
					<div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] justify-items-center gap-4 py-2">
						<div v-for="store in stores.stores" key="store.id" class="wrapp__store__btn relative">
							<Card :url="`/${auth?.user_data?.user_metadata.user_name}/store/${store.id}`"
								:store_name="store.store_name" :quantity_tickets="store.quantity_tickets"
								:ticket_price="store.ticket_price" css-class="link__card" />

							<!-- Button actions -->
							<button type="button" :popovertarget="`popover__store__${store.store_name}`"
								class="btn__card absolute flex justify-center items-center border-1 border-blue-600/40 cursor-pointer top-0 right-0 transition-all duration-300 hover:bg-blue-600 hover:shadow-sm hover:shadow-blue-700/30 focus:bg-blue-600 focus:shadow-sm focus:shadow-blue-700/30">
								<EllipsisVerticalIcon />
							</button>

							<div popover :id="`popover__store__${store.store_name}`" class="m-auto rounded-md backdrop:bg-black/30">
								<div class="p-4">
									<h1>Acciones {{ store.store_name }}</h1>
									<button @click="deleteStore(store.id, $event)" type="button"
										class="flex justify-evenly items-center px-4 py-2 bg-red-600 text-white rounded-md cursor-pointer transition-all duration-300 hover:bg-red-400">
										<TrashIcon />
										Eliminar
									</button>

									<button @click="copyLink(store.store_name, $event)"
										class="flex justify-evenly items-center px-4 py-2 bg-green-600 text-white rounded-md cursor-pointer transition-all duration-300 hover:bg-green-400"
										type="button">
										<LinkIcon />
										Copiar link
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</OwnerSlotView>


			<!-- Stores a las que se ha unido el usuario -->
			<div class="mb-4">
				<h2 class="text-xl text-white">Stores a la que te has unido</h2>
				<div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] justify-items-center gap-4 py-2">
					<div v-for="store in stores.joined" key="store.id" class="wrapp__store__btn relative">

						<Card :url="`/${auth?.user_data?.user_metadata.user_name}/store/tickets/${store.id}`"
							:store_name="store.store_name" :quantity_tickets="store.quantity_tickets"
							:ticket_price="store.ticket_price" />

					</div>
				</div>
			</div>
		</main>
	</LayoutView>
</template>

<style scoped>
.wrapp__store__btn {
	width: 200px;

	& .btn__card {
		width: 45px;
		height: 30px;
		z-index: 1;
		right: 0px;
		top: 0px;
		border-bottom-left-radius: 5px;
		border-top-right-radius: 10px;
	}

	& .link__card {
		clip-path: path("M 0,0 L 150,0 L 150,25 A 10,10 0,0,0 160,35 L 200,35 L 200,200 L 0,200  Z");
		border-radius: 10px;
	}
}
</style>