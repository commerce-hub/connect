import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)));

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
});
