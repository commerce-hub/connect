import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

await assertMissing('scripts/generate-react-ts-app.mjs');
await assertMissing('scripts/generate-web-sdk.mjs');
await assertMissing('projects/commerce-hub-connect-react-app/src/generated/api-models.ts');
await assertMissing('projects/commerce-hub-connect-react-app/src/generated/sdk-models.ts');
await assertMissing('projects/commerce-hub-connect-react-app/src/sdk-loader.ts');

await assertFileExcludes('package.json', ['build:sdk', 'generate:react-app', 'generate:web-sdk-client']);
await assertFileExcludes('projects/commerce-hub-connect-sdk/src/public-api.ts', [
  'capture-payment.component',
  'commerce-hub-connect-sdk.service',
  'commerce-hub-pci-vault.service',
]);
await assertFileExcludes('projects/commerce-hub-connect-react-app/README.md', [
  'starter app',
  'public/sdk/commerce-hub-connect-sdk.js',
]);

console.log('Framework binding wiring verified.');

async function assertMissing(relativePath) {
  const targetPath = path.join(workspaceRoot, relativePath);

  try {
    await fs.access(targetPath);
  } catch {
    return;
  }

  throw new Error(`Expected ${relativePath} to be removed.`);
}

async function assertFileExcludes(relativePath, disallowedSnippets) {
  const filePath = path.join(workspaceRoot, relativePath);
  const content = await fs.readFile(filePath, 'utf8');

  for (const snippet of disallowedSnippets) {
    if (content.includes(snippet)) {
      throw new Error(`Unexpected stale reference "${snippet}" found in ${relativePath}.`);
    }
  }
}
