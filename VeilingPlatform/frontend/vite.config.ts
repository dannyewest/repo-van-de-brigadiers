// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@api": path.resolve(__dirname, "src/api"),
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@src": path.resolve(__dirname, "src"),
      "@style": path.resolve(__dirname, "src/style"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
});