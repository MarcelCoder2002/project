import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import config from "./src/config/config.json";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: config?.server?.port,
		strictPort: true,
		host: config?.server?.host,
	},
	base: config?.server?.base,
});
