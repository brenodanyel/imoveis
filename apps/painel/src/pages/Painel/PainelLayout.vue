<template>
	<q-layout view="LHH LpR fFf">
		<q-header bordered>
			<PlanoWarning />
		</q-header>

		<q-drawer v-model="menu.visible" :mini="!menu.expanded" :breakpoint="$q.screen.sizes.sm + 16" bordered :mini-width="72" class="q-pa-md">
			<Sidebar :expanded="menu.expanded" @onToggle="toggleMenu()" />
		</q-drawer>

		<q-page-container>
			<q-page>
				<router-view v-slot="{ Component }">
					<component :is="Component" />
					<q-ajax-bar position="bottom" color="primary" size="2px" />
				</router-view>
			</q-page>
		</q-page-container>
	</q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { reactive } from 'vue';

import PlanoWarning from './Components/PlanoWarning.vue';
import Sidebar from './Components/Sidebar/Index.vue';

const $q = useQuasar();

const menu = reactive({
	visible: true,
	expanded: false,
});

function toggleMenu() {
	if ($q.screen.lt.sm) {
		menu.visible = !menu.visible;
		return;
	}

	menu.expanded = !menu.expanded;
}
</script>
