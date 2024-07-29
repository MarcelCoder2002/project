import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 8001,
		strictPort: true,
		host: "localhost",
		hmr: {
			clientPort: 8001,
			port: 8002,
		},
	},
	base: "/marcel-project/",
});
