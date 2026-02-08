import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "apps/index.html"),
        edit: resolve(__dirname, "apps/edit/index.html"),
      },
    },
  },
  server: {
    allowedHosts: ['.loca.lt'],
  },
});