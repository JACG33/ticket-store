<script setup>
import CopyIcon from '@/components/icons/CopyIcon.vue'
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const props = defineProps({
	dataToCopy: { type: String, required: false },
	dataRawToCopy: { tybe: Object, required: false },
	label: { type: String, required: true },
	value: { type: String, required: false }
})

const rawData = () => {
	let data = `\n`
	for (let ele in props.dataRawToCopy)
		data += `${props.dataRawToCopy[ele]}\n`
	return data;
}

async function copyLink() {
	try {
		let data = props.dataToCopy
		if (props.dataRawToCopy)
			data = rawData()
		await navigator.clipboard.writeText(data)
		setTimeout(() => {
			toast.add({ severity: 'success', summary: 'Datos Copiados', detail: `Se copio ${data} a tu portapapeles.`, life: 6000, closable: true })
		}, 500);
	} catch (error) {
		console.log(error);
	} finally {
	}
}

</script>

<template>
	<div class="flex justify-between items-center py-2">
		<div>
			<span>{{ label }}</span>
		</div>
		<div class="flex items-center justify-end gap-2">
			<span>{{ value }}</span>
			<button type="button" class="cursor-pointer" title="copy" @click="copyLink">
				<CopyIcon />
			</button>
		</div>
	</div>
</template>