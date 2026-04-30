import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stylesheetPath = path.join(workspaceRoot, 'projects', 'commerce-hub-connect-web-sdk', 'src', 'styles.css');
const outputPath = path.join(workspaceRoot, 'projects', 'commerce-hub-connect-web-sdk', 'src', 'styles-inline.ts');

const css = await fs.readFile(stylesheetPath, 'utf8');
const output = `export const commerceHubConnectWebSdkInlineCss = ${JSON.stringify(css)};
`;
await fs.writeFile(outputPath, output);
console.log(`Synced ${path.relative(workspaceRoot, outputPath)}`);
