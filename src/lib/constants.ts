
// API endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

// Google OAuth configuration
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "727850178991-teo8md2l5n78itm4jc47q821k4d1c3oo.apps.googleusercontent.com";

// File types that can be processed
export const SUPPORTED_MIME_TYPES = [
  "text/plain",
  "text/markdown",
  "application/vnd.google-apps.document"
];

// Vector database configuration
export const PINECONE_API_KEY = import.meta.env.VITE_PINECONE_API_KEY || "pcsk_3DUAzC_EJXmpQ1VMPRbD1E2nZ4RKjrFYuEPgcVXY1SxPyKZYoNKQ7TQi9mxgNpQnHWe4G9";
export const PINECONE_ENVIRONMENT = import.meta.env.VITE_PINECONE_ENVIRONMENT || "us-east1-gcp";
export const PINECONE_INDEX = import.meta.env.VITE_PINECONE_INDEX || "lava";

// OpenAI configuration
export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";
