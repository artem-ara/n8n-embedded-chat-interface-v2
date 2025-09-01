<template>
	<div class="flex items-center justify-center py-3">
		<div class="flex items-center space-x-1.5">
			<div 
				v-for="i in 3" 
				:key="i"
				class="w-2 h-2 bg-primary/60 rounded-full thinking-dot"
				:style="{ animationDelay: `${(i - 1) * 0.2}s` }"
			></div>
		</div>
	</div>
</template>

<script setup lang="ts">
// No additional logic needed for this simple animation component
</script>

<style scoped>
@keyframes thinking-bounce {
	0%, 80%, 100% {
		transform: translateY(0) scale(1);
		opacity: 0.6;
	}
	40% {
		transform: translateY(-12px) scale(1.1);
		opacity: 1;
	}
}

.thinking-dot {
	animation: thinking-bounce 1.4s infinite ease-in-out;
}

/* Dark mode support */
.dark .thinking-dot {
	background-color: rgb(59 130 246 / 0.7);
}

/* Light mode optimization */
.light .thinking-dot {
	background-color: rgb(59 130 246 / 0.6);
}
</style>