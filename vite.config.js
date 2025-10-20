import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 2000, // en kB
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          react: ["react"],
        },
      },
    },
  },
  plugins: [react(), tailwindcss()],
});
