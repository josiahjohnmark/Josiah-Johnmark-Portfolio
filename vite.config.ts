import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { fileURLToPath } from 'url';

const root = path.dirname(fileURLToPath(import.meta.url));

/**
 * In production Vercel rewrites /admin to /admin.html (see vercel.json).
 * The dev server needs the same rewrite so the panel opens at the same
 * address locally as it does live.
 */
function adminRoute(): Plugin {
  return {
    name: 'admin-route',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/admin' || req.url === '/admin/') req.url = '/admin.html';
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), adminRoute()],
  resolve: {
    alias: { '@': path.resolve(root, '.') },
  },
  build: {
    target: 'es2020',
    cssMinify: 'lightningcss',
    rollupOptions: {
      input: {
        // The public site and the admin panel are separate entries, so none of
        // the admin code is ever shipped to a visitor.
        main: path.resolve(root, 'index.html'),
        admin: path.resolve(root, 'admin.html'),
      },
    },
  },
});
