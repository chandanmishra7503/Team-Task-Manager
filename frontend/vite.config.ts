import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  preview: {
    host: true,
    port: 8000,
    allowedHosts: ["precious-victory-production-ac4d.up.railway.app"],
  },
});