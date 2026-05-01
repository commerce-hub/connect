import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const commerceHubProxyTarget = 'https://dev.openfx-nonprod.aws.fisv.cloud';
const webSdkSourceEntry = path.join(projectRoot, '../commerce-hub-connect-web-sdk/src/public-api.ts');

export default defineConfig(({ mode }) => {
  const isLibraryBuild = mode === 'library';

  return {
    plugins: [react()],
    publicDir: isLibraryBuild ? false : path.join(projectRoot, 'public'),
    resolve: isLibraryBuild
      ? undefined
      : {
          alias: {
            'commerce-hub-connect-web-sdk': webSdkSourceEntry,
          },
        },

    build: isLibraryBuild
      ? {
          outDir: path.join(projectRoot, 'dist'),
          emptyOutDir: true,
          lib: {
            entry: path.join(projectRoot, 'src/index.tsx'),
            formats: ['es'],
            fileName: 'index',
          },
          rollupOptions: {
            external: ['react', 'react/jsx-runtime', 'commerce-hub-connect-web-sdk'],
          },
        }
      : {
          outDir: path.join(projectRoot, 'dist-example'),
          emptyOutDir: true,
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
          rewrite: (requestPath) =>
            requestPath.replace(/^\/commerce-hub-proxy\/(dev|qa|cat|prod)/, ''),
        },
      },
    },
  };
});
