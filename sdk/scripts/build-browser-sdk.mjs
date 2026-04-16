import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sdkRoot = join(__dirname, '..');
const repositoryRoot = join(sdkRoot, '..');
const sourceFile = join(sdkRoot, 'browser-sdk', 'commercehub-connect-sdk.js');
const distDir = join(sdkRoot, 'dist');
const distFile = join(distDir, 'commercehub-connect-sdk.js');
const demoFile = join(repositoryRoot, 'demo', 'commercehub-connect-sdk.js');

mkdirSync(distDir, { recursive: true });

const banner = '/* Generated from sdk/browser-sdk/commercehub-connect-sdk.js. Do not edit demo copy directly. */\n';
const source = readFileSync(sourceFile, 'utf8');

writeFileSync(distFile, banner + source);
writeFileSync(demoFile, banner + source);

console.log('Created:', distFile);
console.log('Copied:', demoFile);
