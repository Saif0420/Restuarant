import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward Socket.IO traffic, including the WebSocket upgrade, to Flask
      '/socket.io': {
        target: 'http://localhost:5173',
        ws: true,
      },
    },
  },
});