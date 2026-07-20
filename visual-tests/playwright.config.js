import {defineConfig} from 'playwright/test';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const configDirectory = path.dirname(fileURLToPath(import.meta.url));
const chromiumExecutablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?.trim();

export default defineConfig({
  testDir: configDirectory,
  testMatch: 'visual.spec.js',
  outputDir: path.resolve(configDirectory, '../tmp/visual-tests'),
  snapshotPathTemplate: '{testDir}/snapshots/{arg}{ext}',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['line']] : 'line',
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
      threshold: 0.25,
      maxDiffPixelRatio: 0.02,
    },
  },
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    colorScheme: 'light',
    deviceScaleFactor: 1,
    locale: 'en-US',
    reducedMotion: 'reduce',
    timezoneId: 'UTC',
    viewport: {width: 900, height: 760},
    launchOptions: chromiumExecutablePath
      ? {executablePath: chromiumExecutablePath}
      : undefined,
  },
  webServer: {
    command: 'npm run serve -- --hostname 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173/visual-tests/fixture.html?scenario=list',
    cwd: path.resolve(configDirectory, '..'),
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
