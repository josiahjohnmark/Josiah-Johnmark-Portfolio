import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { fileURLToPath } from 'url';

const root = path.dirname(fileURLToPath(import.meta.url));

/**
 * In production Vercel rewrites /admin to /admin.html (see vercel.json).
 * In local development, this plugin serves /admin.html and provides lightweight
 * local handlers for /api/ routes so the admin panel is 100% usable without Vercel CLI.
 */
function adminRoute(): Plugin {
  let localSignedIn = true; // In local dev, grant easy access

  return {
    name: 'admin-route',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] || '';

        // Rewrite /admin route to admin.html
        if (url === '/admin' || url === '/admin/') {
          req.url = '/admin.html';
          return next();
        }

        // Local development mock for /api/auth
        if (url === '/api/auth') {
          res.setHeader('Content-Type', 'application/json');
          if (req.method === 'GET') {
            res.end(JSON.stringify({ signedIn: localSignedIn }));
            return;
          }
          if (req.method === 'POST') {
            localSignedIn = true;
            res.end(JSON.stringify({ signedIn: true }));
            return;
          }
          if (req.method === 'DELETE') {
            localSignedIn = false;
            res.end(JSON.stringify({ signedIn: false }));
            return;
          }
        }

        // Local development mock for /api/status
        if (url === '/api/status') {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              env: {
                LOCAL_DEV: true,
                ADMIN_PASSWORD: true,
                SESSION_SECRET: true,
                GITHUB_TOKEN: true,
              },
              github: { ok: true, repo: 'Josiah-Johnmark-Portfolio (local)' },
            })
          );
          return;
        }

        // Local development mock for /api/content
        if (url === '/api/content') {
          const contentFilePath = path.resolve(root, 'src/data/content.json');

          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            try {
              const fileContent = fs.readFileSync(contentFilePath, 'utf-8');
              res.end(JSON.stringify({ content: JSON.parse(fileContent), sha: 'local-dev' }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: (err as Error).message }));
            }
            return;
          }

          if (req.method === 'PUT') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body);
                if (parsed.content) {
                  fs.writeFileSync(contentFilePath, JSON.stringify(parsed.content, null, 2) + '\n', 'utf-8');
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ sha: 'local-dev', commit: 'local-saved' }));
                } else {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Missing content payload' }));
                }
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: (err as Error).message }));
              }
            });
            return;
          }
        }

        // Local development mock for /api/upload
        if (url === '/api/upload' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { folder, name, data } = JSON.parse(body);
              const targetDir = path.resolve(root, 'public', folder || 'images');
              fs.mkdirSync(targetDir, { recursive: true });
              const targetFile = path.resolve(targetDir, name);
              const buffer = Buffer.from(data, 'base64');
              fs.writeFileSync(targetFile, buffer);
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  path: `/${folder || 'images'}/${name}`,
                  bytes: buffer.byteLength,
                  commit: 'local',
                })
              );
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: (err as Error).message }));
            }
          });
          return;
        }

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
        main: path.resolve(root, 'index.html'),
        admin: path.resolve(root, 'admin.html'),
      },
    },
  },
});
