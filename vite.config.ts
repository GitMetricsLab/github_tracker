import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],

  // Speedier, quieter builds
  build: {
    target: "es2020",
    sourcemap: false,               // no source maps in prod build
    cssCodeSplit: true,             // keep CSS split for better caching
    minify: "esbuild",
    reportCompressedSize: false,    // avoid gzip size computation in logs
    chunkSizeWarningLimit: 1024,    // raise warning threshold to 1 MB
    rollupOptions: {
      output: {
        // Use function form to control vendor chunking (avoids Vite warning)
        manualChunks(id: string) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react";
            if (id.includes("react-router")) return "router";
            return "vendor";
          }
        },
      },
    },
  },

  // Helpful when running on LAN / different ports during dev previews
  server: {
    host: true,
    // If the error overlay is too noisy during dev, flip this to `false`.
    hmr: {
      overlay: true,
    },
  },

  // Ensure the preview server behaves like dev for hosting on LAN
  preview: {
    host: true,
  },

  resolve: {
    dedupe: ["react", "react-dom"],
  },

  // Ensure fast cold starts during dev
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
});
