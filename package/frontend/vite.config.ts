import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// ********************************************************************************
// REF: https://vite.dev/config/
export default defineConfig({
 plugins: [
  // REF: https://tanstack.com/router/v1/docs/framework/react/installation/with-vite
  tanstackRouter({
   autoCodeSplitting: true,
   target: 'react',
   routesDirectory: './src/route',
  }),

  react(),
 ],

 resolve: {
  alias: {
   '@': path.resolve(__dirname, './src'),
   'common': path.resolve(__dirname, '../../package/common/src'),
  },
 },
});
