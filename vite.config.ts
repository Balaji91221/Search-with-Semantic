
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Define environment variables that should be accessible in the client
  define: {
    // Ensure environment variables are properly stringified
    'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(process.env.VITE_GOOGLE_CLIENT_ID || "727850178991-teo8md2l5n78itm4jc47q821k4d1c3oo.apps.googleusercontent.com"),
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || "http://localhost:3001/api"),
    'import.meta.env.VITE_PINECONE_API_KEY': JSON.stringify(process.env.VITE_PINECONE_API_KEY || "pcsk_3DUAzC_EJXmpQ1VMPRbD1E2nZ4RKjrFYuEPgcVXY1SxPyKZYoNKQ7TQi9mxgNpQnHWe4G9"),
    'import.meta.env.VITE_PINECONE_ENVIRONMENT': JSON.stringify(process.env.VITE_PINECONE_ENVIRONMENT || "us-east1-gcp"),
    'import.meta.env.VITE_PINECONE_INDEX': JSON.stringify(process.env.VITE_PINECONE_INDEX || "lava"),
    'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(process.env.VITE_OPENAI_API_KEY),
  }
}));
