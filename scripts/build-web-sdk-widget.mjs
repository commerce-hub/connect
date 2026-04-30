import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { build as esbuild } from 'esbuild';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const widgetProjectDir = path.join(workspaceRoot, 'projects', 'commerce-hub-connect-web-sdk');
const sourceDir = path.join(widgetProjectDir, 'src');
const outputDir = path.join(widgetProjectDir, 'dist');
const outputBundleFile = path.join(outputDir, 'CommerceHubConnectSDK.js');
const outputTypesFile = path.join(outputDir, 'CommerceHubConnectSDK.d.ts');
const tmpTypesDir = path.join(widgetProjectDir, '.tmp-types');
const entryFile = path.join(sourceDir, 'main.ts');
const stylesheetFile = path.join(sourceDir, 'styles.css');
const inlineStylesFile = path.join(sourceDir, 'styles-inline.ts');
const projectPackageJson = path.join(widgetProjectDir, 'package.json');
const projectReadme = path.join(widgetProjectDir, 'README.md');

await resetDirectory(outputDir);
await fs.rm(tmpTypesDir, { recursive: true, force: true });

const inlinedCss = await fs.readFile(stylesheetFile, 'utf8');
await fs.writeFile(
  inlineStylesFile,
  `export const commerceHubConnectWebSdkInlineCss = ${JSON.stringify(inlinedCss)};\n`,
);

await esbuild({
  entryPoints: [entryFile],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['es2020'],
  logLevel: 'info',
  outfile: outputBundleFile,
  banner: {
    js: `globalThis.__commerceHubConnectWebSdkInlineCss = ${JSON.stringify(inlinedCss)};`,
  },
});

await runCommand(resolveBin('tsc'), ['-p', path.join(widgetProjectDir, 'tsconfig.build.json')]);
await copyDeclarationTree(tmpTypesDir, outputDir);
await fs.rename(path.join(outputDir, 'web-sdk.d.ts'), outputTypesFile);
await Promise.all([
  copyIfPresent(projectPackageJson, path.join(outputDir, 'package.json')),
  copyIfPresent(projectReadme, path.join(outputDir, 'README.md')),
]);
await fs.rm(tmpTypesDir, { recursive: true, force: true });

console.log(`Generated ${path.relative(workspaceRoot, outputBundleFile)}`);

function resolveBin(name) {
  return path.join(
    workspaceRoot,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? `${name}.cmd` : name,
  );
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

async function resetDirectory(directoryPath) {
  await fs.rm(directoryPath, { recursive: true, force: true });
  await fs.mkdir(directoryPath, { recursive: true });
}

async function copyDeclarationTree(sourceDir, destinationDir) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const destinationPath = path.join(destinationDir, entry.name);

    if (entry.isDirectory()) {
      await fs.mkdir(destinationPath, { recursive: true });
      await copyDeclarationTree(sourcePath, destinationPath);
      continue;
    }

    const fileBuffer = await fs.readFile(sourcePath);
    await fs.writeFile(destinationPath, fileBuffer);
  }
}

async function copyIfPresent(source, destination) {
  try {
    const fileBuffer = await fs.readFile(source);
    await fs.writeFile(destination, fileBuffer);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return;
    }

    throw error;
  }
}
