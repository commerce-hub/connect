#!/usr/bin/env node
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';

const SECTION_HEADING = '## Codex Learnings';
const MAX_LEARNING_LENGTH = 240;

const readStdin = () =>
  new Promise((resolve) => {
    let input = '';

    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      input += chunk;
    });
    process.stdin.on('end', () => resolve(input));
  });

const parseHookInput = async () => {
  try {
    const input = await readStdin();
    return input.trim() ? JSON.parse(input) : null;
  } catch (error) {
    console.error(
      `append-agents-learning: ignored invalid hook input: ${error.message}`
    );
    return null;
  }
};

const findRepoRoot = (cwd) => {
  const result = spawnSync('git', ['rev-parse', '--show-toplevel'], {
    cwd,
    encoding: 'utf8',
  });

  if (result.status === 0) {
    return result.stdout.trim();
  }

  return cwd;
};

const normalizeWhitespace = (value) => value.replace(/\s+/g, ' ').trim();

const stripMarkdown = (value) =>
  value
    .replace(/^[-*]\s+/, '')
    .replace(/^#+\s+/, '')
    .replace(/\*\*/g, '')
    .replace(/`([^`]+)`/g, '$1');

const sentenceCase = (value) => {
  if (!value) {
    return value;
  }

  return value[0].toUpperCase() + value.slice(1);
};

const formatCommands = (value) =>
  value
    .replace(
      /\b((?:[A-Z_][A-Z0-9_]*=[^\s`]+\s+)*(?:npm|npx|node|pnpm|yarn|git|tsc|wtr|eslint|prettier|rollup)\s+[^.?!;\n]+)/g,
      '`$1`'
    )
    .replace(
      /`([^`]*?)\s+(when|unless|if|after|before|for)\s+([^`]*)`/g,
      '`$1` $2 $3'
    );

const cleanupLearning = (value) => {
  const withoutPrefix = stripMarkdown(value)
    .replace(
      /^(?:learned|learning|discovered|found|found out|turns out|note for future|remember|important)\s*[:,-]\s*/i,
      ''
    )
    .replace(/^(?:that\s+)?/i, '');

  let cleaned = sentenceCase(normalizeWhitespace(withoutPrefix));

  if (cleaned && !/[.?!]$/.test(cleaned)) {
    cleaned += '.';
  }

  return formatCommands(cleaned);
};

const splitCandidates = (message) =>
  message
    .split(/\n|(?<=[.?!])\s+(?=[A-Z])/)
    .map((candidate) => normalizeWhitespace(candidate))
    .filter(Boolean);

const hasLearningSignal = (candidate) =>
  /\b(learned|learning|discovered|found out|turns out|note for future|remember|important)\b/i.test(
    candidate
  ) ||
  (/\b(this repo|the repo|repository|sdk|browser tests?|tests?|build|lint|generated files?|docs)\b/i.test(
    candidate
  ) &&
    /\b(requires?|needs?|must|should|only|avoid|do not|regenerate|run|use)\b/i.test(
      candidate
    ));

const isTaskSummary = (candidate) =>
  /^(implemented|updated|added|fixed|changed|ran|verified|created|completed)\b/i.test(
    stripMarkdown(candidate)
  );

const isSecretLike = (candidate) =>
  /\b(?:api[_-]?key|token|secret|password|passwd|authorization|bearer)\b/i.test(
    candidate
  ) ||
  /\b(?:sk|pk)_(?:live|test)_[A-Za-z0-9_=-]{8,}\b/.test(candidate) ||
  /\b[A-Za-z0-9+/]{32,}={0,2}\b/.test(candidate);

const extractLearning = (message) => {
  if (!message) {
    return null;
  }

  for (const candidate of splitCandidates(message)) {
    if (isTaskSummary(candidate) || !hasLearningSignal(candidate)) {
      continue;
    }

    const learning = cleanupLearning(candidate);

    if (
      learning.length >= 20 &&
      learning.length <= MAX_LEARNING_LENGTH &&
      !isSecretLike(learning)
    ) {
      return learning;
    }
  }

  return null;
};

const normalizeForDeduplication = (value) =>
  value
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/^\s*-\s*\d{4}-\d{2}-\d{2}:\s*/, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const appendLearning = (agentsPath, learning) => {
  const existing = readFileSync(agentsPath, 'utf8');
  const normalizedLearning = normalizeForDeduplication(learning);

  if (normalizeForDeduplication(existing).includes(normalizedLearning)) {
    return false;
  }

  const date = new Date().toISOString().slice(0, 10);
  const entry = `- ${date}: ${learning}`;

  let next;

  if (existing.includes(`\n${SECTION_HEADING}\n`)) {
    next = existing.replace(
      new RegExp(`\\n${SECTION_HEADING}\\n`),
      `\n${SECTION_HEADING}\n\n${entry}\n`
    );
  } else {
    const trimmed = existing.trimEnd();
    next = `${trimmed}\n\n${SECTION_HEADING}\n\n${entry}\n`;
  }

  writeFileSync(agentsPath, next);
  return true;
};

const main = async () => {
  const hookInput = await parseHookInput();

  if (!hookInput || hookInput.hook_event_name !== 'Stop') {
    return;
  }

  const cwd = hookInput.cwd || process.cwd();
  const agentsPath = join(findRepoRoot(cwd), 'AGENTS.md');

  if (!existsSync(agentsPath)) {
    return;
  }

  const learning = extractLearning(hookInput.last_assistant_message || '');

  if (!learning) {
    return;
  }

  appendLearning(agentsPath, learning);
};

main().catch((error) => {
  console.error(`append-agents-learning: ${error.message}`);
});
