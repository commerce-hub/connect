import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

const packageJson = readJson('package.json');

test('published package metadata does not expose local file dependencies', () => {
  assert.notEqual(
    packageJson.dependencies?.['@jsonforms/lit'],
    'file:packages/jsonforms-lit'
  );
});

test('built SDK imports the internal JSONForms Lit binding', () => {
  const builtSdk = readFileSync('commerce-hub-connect.js', 'utf8');

  assert.doesNotMatch(builtSdk, /from ['"]@jsonforms\/lit['"]/);
  assert.match(
    builtSdk,
    /from ['"]\.\/internal\/jsonforms-lit\/index\.js['"]/
  );
});

test('npm package includes internal JSONForms Lit output only', () => {
  const packOutput = execFileSync('npm', ['pack', '--dry-run', '--json'], {
    encoding: 'utf8',
  });
  const [pack] = JSON.parse(packOutput);
  const files = pack.files.map((file) => file.path);

  assert.ok(
    files.some((file) => file.startsWith('internal/jsonforms-lit/')),
    'expected internal/jsonforms-lit output in package'
  );
  assert.ok(
    files.every((file) => !file.startsWith('packages/jsonforms-lit/')),
    'expected packages/jsonforms-lit output to stay private'
  );
});
