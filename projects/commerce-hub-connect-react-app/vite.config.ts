import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const commerceHubProxyTarget = 'https://dev.openfx-nonprod.aws.fisv.cloud';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'commerce-hub-connect-web-sdk': path.join(
        projectRoot,
        '../commerce-hub-connect-web-sdk/src/public-api.ts',
      ),
    },
  },

  build: {
    rollupOptions: {
      input: {
        main: path.join(projectRoot, 'index.html'),
        fixture: path.join(projectRoot, 'fixture.html'),
      },
    },
  },
  server: {
    proxy: {
      '/commerce-hub-proxy': {
        target: commerceHubProxyTarget,
        changeOrigin: true,
        secure: false,
        rewrite: (requestPath) => requestPath.replace(/^\/commerce-hub-proxy\/(dev|qa|cat|prod)/, ''),
      },
    },
  },
});
