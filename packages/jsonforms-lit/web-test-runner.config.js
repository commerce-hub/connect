import {playwrightLauncher} from '@web/test-runner-playwright';
import {nodeResolve, rollupBundlePlugin} from '@web/dev-server-rollup';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

const browsers = {
  chromium: playwrightLauncher({product: 'chromium'}),
  firefox: playwrightLauncher({product: 'firefox'}),
  webkit: playwrightLauncher({product: 'webkit'}),
};

const noBrowser = (browser) => {
  throw new Error(`No browser configured named '${browser}'; using defaults`);
};

let commandLineBrowsers;
try {
  commandLineBrowsers = process.env.BROWSERS?.split(',').map(
    (browser) => browsers[browser] ?? noBrowser(browser)
  );
} catch (error) {
  console.warn(error);
}

export default {
  rootDir: '.',
  files: ['./test/**/*_test.js'],
  nodeResolve: true,
  preserveSymlinks: true,
  browsers: commandLineBrowsers ?? [browsers.chromium],
  testFramework: {
    config: {
      ui: 'tdd',
      timeout: '60000',
    },
  },
  plugins: [
    rollupBundlePlugin({
      rollupConfig: {
        input: [
          './test/jsonforms-lit-store_test.js',
          './test/jsonforms-lit-components_test.js',
        ],
        plugins: [
          nodeResolve({browser: true}),
          commonjs({transformMixedEsModules: true}),
          json(),
        ],
        output: {
          format: 'es',
        },
      },
    }),
  ],
};
