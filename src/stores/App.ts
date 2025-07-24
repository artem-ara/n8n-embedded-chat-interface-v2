import { createGlobalState } from "@vueuse/core";

export const useApp = createGlobalState(() => {
	const show = ref(true);
	const isMaximized = ref(false);
	const appConfig = ref({
		label: "",
		description: "",
		hostname: "",
		mode: "",
		initialMessage: "",
	});
	return { isMaximized, show, appConfig };
});
