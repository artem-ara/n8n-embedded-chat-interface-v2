import { createGlobalState } from "@vueuse/core";
import { useToast } from "@/components/ui/toast/use-toast";
import type { N8nMessageResponse } from "@/types/chat";
import i18n from "@/i18n";

export const useN8n = createGlobalState(() => {
	const { appConfig } = useApp();
	const { toast } = useToast();

	const messages = ref<{ role: "user" | "assistant"; content: string }[]>([]);
	const userInput = ref("");
	const isLoading = ref(false);
	const sessionId = ref<string | null>(null);

	const sendMessage = async (chatInput: string) => {
		if (chatInput.trim() === "") {
			userInput.value = "";
			toast({ title: "Please enter a message" });
			return;
		}

		messages.value.push({ role: "user", content: chatInput });
		messages.value.push({ role: "assistant", content: (i18n as any).global.t("thinking") as string });

		isLoading.value = true;

		try {
			const body: Record<string, any> = { chatInput };
			if (sessionId.value) body.sessionId = sessionId.value;

			const response = await fetch(appConfig.value.hostname, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (!response.ok) throw new Error(await response.text());
			const data: N8nMessageResponse = await response.json();
			const answer = typeof data === "string" ? data : data.output;
			if (data.sessionId) sessionId.value = data.sessionId;
			messages.value[messages.value.length - 1] = { role: "assistant", content: answer };
			userInput.value = "";
		} catch (error) {
			messages.value[messages.value.length - 1] = { role: "assistant", content: "Ошибка: " + (error as any).message };
			toast({ title: "Ошибка запроса", variant: "destructive" });
		} finally {
			isLoading.value = false;
		}
	};

	const initializeChat = () => {
		if (appConfig.value.initialMessage && appConfig.value.initialMessage.trim() !== "") {
			messages.value = [{ role: "assistant", content: appConfig.value.initialMessage }];
		} else {
			messages.value = [];
		}
	};

	const clearChat = () => {
		userInput.value = "";
		isLoading.value = false;
		sessionId.value = null;
		initializeChat();
	};

	return { messages, userInput, sendMessage, isLoading, clearChat, initializeChat };
});
