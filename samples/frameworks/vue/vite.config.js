import { fileURLToPath, URL } from "node:url";
import basicSSL from "@vitejs/plugin-basic-ssl";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), basicSSL()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	server: {
		host: "0.0.0.0",
		forwardConsole: true,
	},
});
