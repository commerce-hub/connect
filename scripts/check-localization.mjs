import {readdir, readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

import {IntlMessageFormat} from 'intl-messageformat';
import ts from 'typescript';

const catalogDirectory = new URL(
  '../src/internal/localization/catalogs/',
  import.meta.url
);
const catalogFiles = new Map(
  (await readdir(catalogDirectory))
    .filter((fileName) => fileName.endsWith('.ts'))
    .map((fileName) => [
      fileName.slice(0, -3),
      new URL(fileName, catalogDirectory),
    ])
);

const readCatalog = async ([locale, url]) => {
  const sourceText = await readFile(url, 'utf8');
  const source = ts.createSourceFile(
    fileURLToPath(url),
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  const messages = new Map();

  const visit = (node) => {
    if (ts.isPropertyAssignment(node)) {
      const key = ts.isStringLiteral(node.name) ? node.name.text : undefined;
      const value = ts.isStringLiteralLike(node.initializer)
        ? node.initializer.text
        : undefined;

      if (key && value !== undefined) {
        messages.set(key, value);
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(source);
  return [locale, messages];
};

const catalogs = new Map(
  await Promise.all([...catalogFiles.entries()].map(readCatalog))
);
const english = catalogs.get('en-US');
const errors = [];

const messageArguments = (message, locale) => {
  const argumentsFound = new Set();
  const visit = (nodes) => {
    for (const node of nodes) {
      if (node.type !== 0 && typeof node.value === 'string') {
        argumentsFound.add(node.value);
      }
      if (node.options) {
        for (const option of Object.values(node.options)) {
          visit(option.value ?? []);
        }
      }
      if (node.children) {
        visit(node.children);
      }
    }
  };
  visit(new IntlMessageFormat(message, locale).getAst());
  return [...argumentsFound].sort();
};

for (const [locale, messages] of catalogs) {
  for (const key of english.keys()) {
    if (!messages.has(key)) {
      errors.push(`${locale}: missing message ${key}`);
    }
  }

  for (const [key, message] of messages) {
    if (!english.has(key)) {
      errors.push(`${locale}: unknown message ${key}`);
    }

    try {
      const localizedArguments = messageArguments(message, locale);
      const englishMessage = english.get(key);
      const englishArguments = englishMessage
        ? messageArguments(englishMessage, 'en-US')
        : [];

      if (localizedArguments.join('\0') !== englishArguments.join('\0')) {
        errors.push(
          `${locale}: ICU arguments for ${key} are [${localizedArguments.join(
            ', '
          )}], expected [${englishArguments.join(', ')}]`
        );
      }
    } catch (error) {
      errors.push(`${locale}: invalid ICU message ${key}: ${error.message}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    `Localization catalogs are complete and valid (${english.size} messages).`
  );
}
