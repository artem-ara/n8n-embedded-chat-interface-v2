<template>
	<!-- Фиксированная кнопка чата -->
	<div class="fixed bottom-4 right-4 cursor-pointer rounded-full bg-primary z-[999999] chat-button-top-level shadow-lg hover:shadow-xl transition-all duration-200" 
		:class="[
			// Responsive button sizing
			'size-12 sm:size-14',
			// Ensure button is always visible and accessible
			'min-w-[48px] min-h-[48px]',
			// Add safe area for mobile devices
			'mb-safe mr-safe',
			// Hover effects
			'hover:scale-105 active:scale-95'
		]"
		@click="show = !show">
		<span class="flex h-full select-none items-center justify-center text-white transition-transform duration-200" 
			:class="[
				// Responsive icon sizing
				'text-lg sm:text-xl',
				// Ensure icon is always visible
				'[&>*]:size-6 sm:[&>*]:size-8',
				// Rotation animation for close icon
				show ? 'rotate-90' : 'rotate-0'
			]">
			<Question v-if="!show" />
			<Close v-else />
		</span>
	</div>

	<!-- Chat interface overlay -->
	<Transition name="chat-slide" appear>
		<div v-if="show" :class="[
			'shadow-main-ui rounded-md border fixed overflow-hidden bg-white dark:bg-neutral-950 z-[999998] chat-interface-top-level',
			// Mobile responsive sizing with better viewport handling
			'h-[calc(100vh-140px)] w-[calc(100vw-32px)] max-h-[600px] max-w-[480px]',
			'sm:h-[552px] sm:w-[480px]',
			'min-h-[400px] min-w-[320px]',
			// Better mobile positioning to avoid overlap with button
			'bottom-[88px] right-4 sm:bottom-20 sm:right-4',
			'left-4 sm:left-auto',
			// Add safe area padding for mobile
			'mb-safe mr-safe ml-safe sm:ml-0'
		]">
			<!-- Header -->
			<div class="flex h-10 items-center justify-between bg-primary p-2">
				<h1 class="text-sm font-medium text-white truncate">{{ appConfig.label }}</h1>
				<div class="flex items-center space-x-2">
					<!-- Optional: Add minimize/maximize buttons here -->
				</div>
			</div>
			
			<!-- Chat content -->
			<div class="h-[calc(100%-40px)] overflow-auto">
				<template v-if="appConfig.mode === 'n8n'">
					<ChatN8n />
				</template>
			</div>
		</div>
	</Transition>



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
import { onBeforeMount, onMounted, onUnmounted } from "vue";

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

type Mode = "n8n";

const parseMode = (input?: string): Mode => {
	console.log("input", input);
	if (input && input === "n8n") {
		return input;
	} else {
		return "n8n";
	}
};

const parsedMode = parseMode(props.mode);

// Handle escape key to close chat
const handleEscape = (event: KeyboardEvent) => {
	if (event.key === 'Escape' && show.value) {
		show.value = false;
	}
};

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

onMounted(() => {
	// Add escape key listener
	window.addEventListener('keydown', handleEscape);
	
	// Prevent body scroll when chat is open on mobile
	const preventScroll = () => {
		if (show.value && window.innerWidth < 640) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	};
	
	// Watch for show changes
	const unwatch = watch(show, preventScroll);
	
	// Cleanup on unmount
	onUnmounted(() => {
		window.removeEventListener('keydown', handleEscape);
		document.body.style.overflow = '';
		unwatch();
	});
});
</script>

<style scoped>
/* Chat slide animation */
.chat-slide-enter-active,
.chat-slide-leave-active {
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-slide-enter-from {
	opacity: 0;
	transform: translateY(20px) scale(0.95);
}

.chat-slide-leave-to {
	opacity: 0;
	transform: translateY(20px) scale(0.95);
}



/* Safe area support for mobile devices */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
	.mb-safe {
		margin-bottom: env(safe-area-inset-bottom, 1rem);
	}
	.mr-safe {
		margin-right: env(safe-area-inset-right, 1rem);
	}
	.ml-safe {
		margin-left: env(safe-area-inset-left, 1rem);
	}
}

/* Ensure button is always clickable */
.chat-button-top-level {
	pointer-events: auto;
}

/* Smooth transitions for all interactive elements */
.chat-button-top-level,
.chat-interface-top-level {
	will-change: transform, opacity;
}

/* Mobile specific improvements */
@media (max-width: 639px) {
	.chat-interface-top-level {
		border-radius: 0.75rem 0.75rem 0 0;
		border-bottom: none;
	}
}
</style>