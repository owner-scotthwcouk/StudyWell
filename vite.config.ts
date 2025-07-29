
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Expose environment variables to the client.
      // IMPORTANT: Be careful not to expose sensitive information.
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      // Alias configuration removed as it's no longer needed.
    },
    server: {
      // This is crucial for single-page applications (SPAs) with client-side routing.
      historyApiFallback: true,
      port: 3000, 
    }
  };
});