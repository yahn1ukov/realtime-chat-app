import reactOxc from '@vitejs/plugin-react-oxc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [reactOxc()],
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
      },
    },
  },
});
