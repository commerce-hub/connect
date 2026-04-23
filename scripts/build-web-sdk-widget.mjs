import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { build as esbuild } from 'esbuild';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const widgetProjectDir = path.join(workspaceRoot, 'projects', 'commerce-hub-connect-web-sdk');
const widgetBuildDir = path.join(widgetProjectDir, 'dist-widget');
const widgetBrowserDir = path.join(widgetBuildDir, 'browser');
const outputDir = path.join(widgetProjectDir, 'dist');
const rawEntryFile = path.join(widgetBrowserDir, 'main.js');
const rawStylesFile = path.join(widgetBrowserDir, 'styles.css');
const typeDefinitionFile = path.join(widgetProjectDir, 'web-sdk.d.ts');
const licenseFile = path.join(widgetBuildDir, '3rdpartylicenses.txt');
const outputBundleFile = path.join(outputDir, 'CommerceHubConnectSDK.js');
const outputTypesFile = path.join(outputDir, 'CommerceHubConnectSDK.d.ts');
const outputLicenseFile = path.join(outputDir, '3rdpartylicenses.txt');

await runAngularBuild();
await fs.mkdir(outputDir, { recursive: true });

const inlinedCss = await inlineCssAssets(rawStylesFile, widgetBrowserDir);

await esbuild({
  entryPoints: [rawEntryFile],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['es2020'],
  logLevel: 'info',
  logOverride: {
    'empty-import-meta': 'silent',
  },
  outfile: outputBundleFile,
  banner: {
    js: `globalThis.__commerceHubConnectWebSdkInlineCss = ${JSON.stringify(inlinedCss)};`,
  },
});

await Promise.all([
  fs.copyFile(typeDefinitionFile, outputTypesFile),
  copyIfPresent(licenseFile, outputLicenseFile),
]);

console.log(`Generated ${path.relative(workspaceRoot, outputBundleFile)}`);

async function runAngularBuild() {
  const angularCli = path.join(
    workspaceRoot,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'ng.cmd' : 'ng',
  );

  await runCommand(angularCli, ['build', 'commerce-hub-connect-web-sdk-widget']);
}

async function runCommand(command, args) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: workspaceRoot,
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} exited with code ${code ?? 'unknown'}.`));
    });
  });
}

async function inlineCssAssets(stylesheetFile, assetRootDir) {
  const stylesheet = await fs.readFile(stylesheetFile, 'utf8');
  const urlPattern = /url\(([^)]+)\)/g;
  let inlinedStylesheet = '';
  let lastIndex = 0;

  for (const match of stylesheet.matchAll(urlPattern)) {
    const [fullMatch, rawUrl] = match;
    const start = match.index ?? 0;
    const assetUrl = rawUrl.trim().replace(/^['"]|['"]$/g, '');
    const assetPath = resolveAssetPath(assetRootDir, assetUrl);

    inlinedStylesheet += stylesheet.slice(lastIndex, start);
    inlinedStylesheet += assetPath
      ? `url(${JSON.stringify(await toDataUrl(assetPath))})`
      : fullMatch;

    lastIndex = start + fullMatch.length;
  }

  inlinedStylesheet += stylesheet.slice(lastIndex);
  return inlinedStylesheet;
}

function shouldInlineAsset(assetUrl) {
  return (
    assetUrl &&
    !assetUrl.startsWith('data:') &&
    !assetUrl.startsWith('http://') &&
    !assetUrl.startsWith('https://') &&
    !assetUrl.startsWith('//') &&
    !assetUrl.startsWith('#')
  );
}

function resolveAssetPath(assetRootDir, assetUrl) {
  if (!shouldInlineAsset(assetUrl)) {
    return null;
  }

  const [pathname] = assetUrl.split(/[?#]/, 1);
  return path.join(assetRootDir, pathname);
}

async function toDataUrl(assetPath) {
  const fileBuffer = await fs.readFile(assetPath);
  const extension = path.extname(assetPath).toLowerCase();
  const mimeType = resolveMimeType(extension);
  return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
}

function resolveMimeType(extension) {
  switch (extension) {
    case '.css':
      return 'text/css';
    case '.eot':
      return 'application/vnd.ms-fontobject';
    case '.svg':
      return 'image/svg+xml';
    case '.ttf':
      return 'font/ttf';
    case '.woff':
      return 'font/woff';
    case '.woff2':
      return 'font/woff2';
    default:
      return 'application/octet-stream';
  }
}

async function copyIfPresent(source, destination) {
  try {
    await fs.copyFile(source, destination);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return;
    }

    throw error;
  }
}
