import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 8999,
  },

  build: {
    lib: {
      entry: resolve(__dirname, "src/lib/index.ts"),
      fileName: "my-components",
      formats: ["es"],
    },

    sourcemap: true,

    rollupOptions: {
      // Библиотека, которую мы хотим использовать в качестве внешней зависимости
      external: ["vue"],
    },
  },

  plugins: [vue()],

  resolve: {
    alias: [
      { find: "@", replacement: resolve(__dirname, "./src") },
      {
        find: "my-components",
        replacement: resolve(__dirname, "./src/lib/index.ts"),
      },
    ],
  },
});
