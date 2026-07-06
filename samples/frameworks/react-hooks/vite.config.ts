import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		basicSsl(), // Provides self-signed certificates for HTTPS
	],
	server: {
		host: "0.0.0.0",
		forwardConsole: true,
	},
});
