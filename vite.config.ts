import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => ({
  base: mode === 'pages' ? '/AI-Explorer/' : '/',
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    // Use separate outDirs to avoid EBUSY locks on Windows/OneDrive
    outDir: mode === 'pages' ? 'dist-pages' : 'dist',
    emptyOutDir: true,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
