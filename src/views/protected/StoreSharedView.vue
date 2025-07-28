<script setup>
import { ref } from "vue"
import LayoutView from '@/views/layout/LayoutView.vue';
import LoaderCircleIcon from '@/components/icons/LoaderCircleIcon.vue';
import supabase from '@/connection';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { onMounted } from "vue";

const pending = ref(false)
const auth = useAuthStore()
const router = useRoute();
const toast = useToast();
let id_store = null

async function joinStore() {
	pending.value = true

	const { data, error } = await supabase.from("store_user_ref").select().eq("id_user", auth.user_data.id).eq("id_store", id_store)

	console.log(data.length)

	if (data.length >= 1) {
		toast.add({ severity: 'error', summary: 'Unido', detail: 'Ya Te haz unido a esta store', life: 6000, closable: true });
		pending.value = false
	} else {
		const { data, error } = await supabase.from("store_user_ref").insert({
			id_user: auth.user_data.id,
			id_store: id_store,
		}).select()

		if (!error) {
			toast.add({ severity: 'success', summary: 'Unido', detail: 'Te haz unido a la store', life: 6000, closable: true });
			pending.value = false
		}
	}

	if (error) {
		toast.add({ severity: 'warnig', summary: 'Error', detail: 'Ocurrio un error al unirte a la store', life: 6000, closable: true });
		pending.value = false
	}
}

onMounted(async () => {
	const { data, error } = await supabase.from("store").select().eq("store_name", router.params.name_store)

	if (!error) {
		id_store = data[0].id
		console.log(id_store)
	}
})

</script>

<template>

	<LayoutView>
		<main class="bg-gray-900 h-screen px-2 py-1">
			<div class="h-full flex justify-center items-center">
				<div class="m-auto" v-if="router.params.user == auth.user_data.id">
					<h1 class="text-4xl font-bold text-center text-white">No te puedes unir a una store creada por ti</h1>
				</div>
				<div class="m-auto" v-else>
					<h1>Unete a la store {{ router.params.name_store }}</h1>
					<form @submit.prevent="joinStore">
						<template v-if="pending">
							<button type="submit" :disabled="pending"
								class="px-2 py-1 bg-blue-500 rounded-sm text-white cursor-pointer">
								<LoaderCircleIcon class="animate-spin" />
							</button>
						</template>
						<template v-else>
							<button type="submit" class="px-2 py-1 bg-blue-500 rounded-sm text-white cursor-pointer">
								unirse
							</button>
						</template>
					</form>
				</div>
			</div>
		</main>
	</LayoutView>
</template>