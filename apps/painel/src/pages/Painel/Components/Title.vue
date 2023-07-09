<template>
	<q-card :square="!dense" :bordered="dense" class="overflow-hidden" :class="{ 'rounded-borders': true }">
		<div class="row items-center q-col-gutter-sm" :class="dense ? 'q-pa-sm' : 'q-pa-lg text-primary'">
			<div class="col-xs-12 col-sm">
				<div>
					<div class="row no-wrap q-gutter-md items-center" :class="dense ? 'q-pl-sm' : ''">
						<template v-if="icon">
							<q-icon :name="icon" :size="dense ? 'xs' : 'sm'" />
							<q-separator vertical />
						</template>

						<div class="text-h5 text-weight-medium" :class="dense ? 'text-18' : 'text-22'">
							{{ title }}
						</div>
					</div>
				</div>
			</div>

			<slot />
		</div>
		<q-separator v-if="!dense" />
	</q-card>
</template>

<script setup lang="ts">
defineProps<{
	title: string;
	icon?: string;
	dense?: boolean;
}>();

defineSlots<{
	default(props: {}): any;
}>();
</script>
