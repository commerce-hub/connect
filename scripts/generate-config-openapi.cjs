#!/usr/bin/env node

const {execFileSync} = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const yaml = require('js-yaml');

const repoRoot = path.resolve(__dirname, '..');
const sourcePath = '/v1/party/configuration-inquiry';
const clientPath = '/party/configuration-inquiry';
const sourceFile = path.join(repoRoot, 'config-swagger.yaml');
const outputFile = path.join(repoRoot, 'src/generated/config-openapi.ts');

const sourceSpec = yaml.load(fs.readFileSync(sourceFile, 'utf8'));
const sourcePathItem = sourceSpec.paths?.[sourcePath];

if (!sourcePathItem) {
  throw new Error(`Missing ${sourcePath} in ${sourceFile}`);
}

const sourceSchemas = sourceSpec.components?.schemas ?? {};
const selectedSchemas = {};
const pendingSchemas = [];

const collectRefs = (value) => {
  if (!value || typeof value !== 'object') {
    return;
  }

  if (typeof value.$ref === 'string') {
    const schemaName = value.$ref.match(/^#\/components\/schemas\/(.+)$/)?.[1];

    if (schemaName && !selectedSchemas[schemaName]) {
      pendingSchemas.push(schemaName);
    }
  }

  for (const child of Object.values(value)) {
    collectRefs(child);
  }
};

collectRefs(sourcePathItem);

while (pendingSchemas.length > 0) {
  const schemaName = pendingSchemas.pop();

  if (!schemaName || selectedSchemas[schemaName]) {
    continue;
  }

  const schema = sourceSchemas[schemaName];

  if (!schema) {
    throw new Error(`Missing schema ${schemaName} referenced by ${sourcePath}`);
  }

  selectedSchemas[schemaName] = schema;
  collectRefs(schema);
}

const configSpec = {
  openapi: sourceSpec.openapi,
  info: {
    title: 'CommerceHub Party Configuration APIs',
    version: sourceSpec.info?.version ?? 'v0',
  },
  paths: {
    [clientPath]: sourcePathItem,
  },
  components: {
    schemas: selectedSchemas,
  },
};

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'commercehub-config-openapi-'));
const tempSpecFile = path.join(tempDir, 'config-openapi.json');
const openapiTypescriptBin = path.join(
  repoRoot,
  'node_modules/.bin/openapi-typescript'
);

try {
  fs.writeFileSync(tempSpecFile, JSON.stringify(configSpec, null, 2));
  execFileSync(openapiTypescriptBin, [tempSpecFile, '-o', outputFile], {
    cwd: repoRoot,
    stdio: 'inherit',
  });
} finally {
  fs.rmSync(tempDir, {recursive: true, force: true});
}
