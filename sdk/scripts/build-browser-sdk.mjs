import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sdkRoot = join(__dirname, '..');
const repositoryRoot = join(sdkRoot, '..');
const templateFile = join(sdkRoot, 'browser-sdk', 'commercehub-connect-sdk.template.js');
const sourceFile = join(sdkRoot, 'browser-sdk', 'commercehub-connect-sdk.js');
const distDir = join(sdkRoot, 'dist');
const distFile = join(distDir, 'commercehub-connect-sdk.js');
const browserFrameDir = join(distDir, 'browser-sdk-frame');
const browserFrameBrowserDir = join(browserFrameDir, 'browser');
const frameIndexFile = join(browserFrameBrowserDir, 'index.html');
const demoFile = join(repositoryRoot, 'demo', 'commercehub-connect-sdk.js');
const demoBrowserFrameDir = join(repositoryRoot, 'demo', 'browser-sdk-frame');

mkdirSync(distDir, { recursive: true });

const banner =
  '/* Generated from sdk/browser-sdk/commercehub-connect-sdk.template.js. Do not edit demo copy directly. */\n';
const template = readFileSync(templateFile, 'utf8');
const frameDocument = buildInlineFrameDocument();
const source = template.replace('__FRAME_DOCUMENT__', JSON.stringify(frameDocument));

writeFileSync(sourceFile, banner + source);
writeFileSync(distFile, banner + source);
writeFileSync(demoFile, banner + source);
rmSync(demoBrowserFrameDir, { recursive: true, force: true });
rmSync(browserFrameDir, { recursive: true, force: true });

console.log('Generated:', sourceFile);
console.log('Created:', distFile);
console.log('Copied:', demoFile);

function buildInlineFrameDocument() {
  let html = readFileSync(frameIndexFile, 'utf8');

  html = html.replace(
    /<script\b([^>]*)\bsrc="([^"]+)"([^>]*)><\/script>/g,
    (_match, beforeSrc, src, afterSrc) => {
      const attributes = `${beforeSrc}${afterSrc}`.trim();
      const sourcePath = join(browserFrameBrowserDir, src);
      const scriptContent = readFileSync(sourcePath, 'utf8').replaceAll('</script', '<\\/script');
      const attributeText = attributes ? ` ${attributes}` : '';
      return `<script${attributeText}>${scriptContent}</script>`;
    },
  );

  html = html.replace(
    /<link\b([^>]*)rel="stylesheet"([^>]*)href="([^"]+)"([^>]*)>/g,
    (_match, beforeRel, afterRel, href, tail) => {
      const attributes = `${beforeRel}${afterRel}${tail}`
        .replace(/\s*href="[^"]+"/g, '')
        .trim();
      const sourcePath = join(browserFrameBrowserDir, href);
      const styleContent = readFileSync(sourcePath, 'utf8');
      const attributeText = attributes ? ` ${attributes}` : '';
      return `<style${attributeText}>${styleContent}</style>`;
    },
  );

  if (!html.includes('__INSTANCE_ID__')) {
    html = html.replace('</head>', '<script>window.name="__INSTANCE_ID__";</script></head>');
  }

  return html;
}
