<template>
	<div class="fixed bottom-4 right-4 cursor-pointer rounded-full bg-primary z-[999999] chat-button-top-level shadow-lg hover:shadow-xl transition-shadow duration-200" 
		:class="[
			// Responsive button sizing
			'size-12 sm:size-14',
			// Ensure button is always visible on mobile
			'min-w-[48px] min-h-[48px]'
		]"
		@click="show = !show">
		<span class="flex h-full select-none items-center justify-center text-white transition-colors duration-200" 
			:class="[
				// Responsive icon sizing
				'text-lg sm:text-xl',
				// Ensure icon is always visible
				'[&>*]:size-6 sm:[&>*]:size-8'
			]">
			<Question v-if="!show" />
			<Close v-else />
		</span>
	</div>

	<div v-if="show" :class="[
		'shadow-main-ui rounded-md border fixed overflow-hidden bg-white dark:bg-neutral-950 z-[999999] chat-interface-top-level',
		// Mobile responsive sizing
		'h-[calc(100vh-120px)] w-[calc(100vw-32px)] max-h-[600px] max-w-[480px]',
		'sm:h-[552px] sm:w-[480px]',
		'min-h-[400px] min-w-[280px]',
		// Mobile responsive positioning
		'bottom-20 right-4 sm:bottom-20 sm:right-4',
		'left-4 sm:left-auto'
	]">
		<div class="flex h-10 items-center justify-between bg-primary p-2">
			<h1 class="text-sm text-white">{{ appConfig.label }}</h1>
			<div class="flex items-center">
			</div>
		</div>
		<div class="h-[calc(100%-40px)] overflow-auto">
			<!-- Render content based on mode prop -->
			<template v-if="appConfig.mode === 'n8n'">
				<ChatN8n />
			</template>
		</div>
	</div>
	<Toaster />
</template>

<script setup lang="ts">
import Toaster from "@/components/ui/toast/Toaster.vue";
import Maximize from "~icons/flowbite/expand-outline";
import Question from "~icons/proicons/question";
import Close from "~icons/material-symbols/close-rounded";
import ShrinkIcon from "~icons/lucide/shrink";

import ChatN8n from "@/components/chat/n8n/Index.vue";

import { useDark, useToggle } from "@vueuse/core";
import { useApp } from "@/stores/App";
import { onBeforeMount } from "vue";

// import SunIcon from "~icons/mdi/weather-sunny";
// import MoonIcon from "~icons/mdi/weather-night";
// import SettingsIcon from "~icons/ic/round-settings";

const { isMaximized, show, appConfig } = useApp();

const props = defineProps({ 
	label: String, 
	description: String, 
	token: String, 
	organisationId: String, 
	assistant: String, 
	hostname: String, 
	mode: String, 
	openOnStart: String,
	initialMessage: String,
	// Custom color scheme props (max 10 colors)
	primaryColor: String,
	secondaryColor: String,
	backgroundColor: String,
	textColor: String,
	accentColor: String,
	surfaceColor: String,
	borderColor: String,
	successColor: String,
	warningColor: String,
	errorColor: String
});

const isDark = useDark();
const toggleDark = useToggle(isDark);

type Mode = "n8n"; // to be extended later

const parseMode = (input?: string): Mode => {
	console.log("input", input);
	if (input && input === "n8n") {
		return input;
	} else {
		return "n8n";
	}
};
const parsedMode = parseMode(props.mode);

onBeforeMount(() => {
	show.value = props.openOnStart === "true";
	appConfig.value = {
		label: props.label ?? "",
		description: props.description ?? "",
		hostname: props.hostname ?? "",
		mode: parsedMode,
		initialMessage: props.initialMessage ?? "",
	};
	console.log("appConfig", JSON.stringify(appConfig.value, null, 2));
});
</script>
