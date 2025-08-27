<template>
	<div class="flex h-full flex-col justify-between gap-2">
		<div class="h-full overflow-hidden">
			<div class="h-full overflow-y-auto bg-neutral-50 p-3 pb-0 dark:bg-neutral-900" id="chat-messages-container">
				<h3 v-if="messages.length === 0" class="flex h-full items-center justify-center font-semibold">
					{{ t("helpPrompt") }}
				</h3>
				<div v-else>
					<div v-for="(msg, idx) in messages" :key="idx" class="mb-3">
						<div :class="msg.role === 'user' ? 'text-right' : 'text-left'">
							<span v-if="msg.role === 'user'" class="inline-block max-w-[80%] rounded-2xl bg-primary px-4 py-2 text-white shadow-sm">
								{{ msg.content }}
							</span>
							<div v-else class="inline-block max-w-[90%] rounded-xl border border-neutral-200 bg-white p-4 text-left shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
								<Renderer :content="msg.content" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="bg-neutral-50 p-3 pt-0 dark:bg-neutral-900">
			<div :class="{ '!border-primary': focused }" class="relative mx-auto w-full max-w-[666px] rounded-md border bg-white p-2 duration-200 hover:border-primary/40 dark:border-zinc-700 dark:bg-zinc-900">
				<!-- chat input with side send button; hidden when loading -->
				<div v-if="!isLoading" class="flex items-end gap-2">
					<Textarea :disabled="isLoading" @keydown.enter.exact.prevent="handleSend()" v-model="userInput" :class="focused ? 'h-[84px]' : 'h-[40px]'" class="flex-1 resize-none transition-all duration-200" @blur="focused = false" :placeholder="t('askAnything')" @click="focused = true" />
					<div class="flex items-center gap-2">
						<Button :disabled="!userInput" class="size-9 rounded-full p-0" @click="handleSend()">
							<PaperPlaneIcon class="text-lg" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import PaperPlaneIcon from "~icons/fluent/send-24-regular";
import Renderer from "@/components/markdown/Renderer.vue";
import { useI18n } from "vue-i18n";
import { onMounted, nextTick, watch } from "vue";

const { t } = useI18n();
const { messages, userInput, sendMessage, isLoading, initializeChat } = useN8n();
const focused = ref(false);

const handleSend = async () => {
    const value = userInput.value;
    if (!value || !value.trim()) return;
    userInput.value = "";
    await sendMessage(value);
};

// Auto-scroll to the latest message whenever the list changes
watch(
    () => messages.value.length,
    async () => {
        await nextTick();
        const container = document.getElementById("chat-messages-container");
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    },
    { immediate: true }
);

onMounted(() => {
	initializeChat();
});
</script>
