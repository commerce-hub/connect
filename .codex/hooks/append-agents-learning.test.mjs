import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

const scriptPath = fileURLToPath(
  new URL('./append-agents-learning.mjs', import.meta.url)
);

const runHook = (cwd, lastAssistantMessage) =>
  spawnSync(process.execPath, [scriptPath], {
    cwd,
    input: JSON.stringify({
      hook_event_name: 'Stop',
      cwd,
      last_assistant_message: lastAssistantMessage,
      session_id: 'test-session',
      turn_id: 'test-turn',
      stop_hook_active: false,
      transcript_path: null,
      model: 'test-model',
      permission_mode: 'default',
    }),
    encoding: 'utf8',
  });

const withTempRepo = (fn) => {
  const cwd = mkdtempSync(join(tmpdir(), 'agents-learning-'));

  try {
    writeFileSync(
      join(cwd, 'AGENTS.md'),
      '# Repository Guidelines\n\n## Testing Guidelines\n\nRun the tests.\n'
    );

    fn(cwd);
  } finally {
    rmSync(cwd, {force: true, recursive: true});
  }
};

test('appends a durable test command learning to AGENTS.md', () => {
  withTempRepo((cwd) => {
    const result = runHook(
      cwd,
      'Learned: this repo requires BROWSERS=chromium npm run test:dev when iterating on browser tests.'
    );

    assert.equal(result.status, 0, result.stderr);

    const agents = readFileSync(join(cwd, 'AGENTS.md'), 'utf8');
    assert.match(agents, /## Codex Learnings/);
    assert.match(
      agents,
      /- \d{4}-\d{2}-\d{2}: This repo requires `BROWSERS=chromium npm run test:dev` when iterating on browser tests\./
    );
  });
});

test('does not append the same learning twice', () => {
  withTempRepo((cwd) => {
    const message =
      'Learned: this repo requires BROWSERS=chromium npm run test:dev when iterating on browser tests.';

    assert.equal(runHook(cwd, message).status, 0);
    assert.equal(runHook(cwd, message).status, 0);

    const agents = readFileSync(join(cwd, 'AGENTS.md'), 'utf8');
    const matches = agents.match(/BROWSERS=chromium npm run test:dev/g) ?? [];
    assert.equal(matches.length, 1);
  });
});

test('ignores task-specific summaries without durable repo learnings', () => {
  withTempRepo((cwd) => {
    const result = runHook(
      cwd,
      'Implemented the component update and ran npm test successfully.'
    );

    assert.equal(result.status, 0, result.stderr);

    const agents = readFileSync(join(cwd, 'AGENTS.md'), 'utf8');
    assert.doesNotMatch(agents, /## Codex Learnings/);
  });
});

test('skips secret-like learnings', () => {
  withTempRepo((cwd) => {
    const result = runHook(
      cwd,
      'Learned: use API token sk_live_1234567890abcdef for local wallet tests.'
    );

    assert.equal(result.status, 0, result.stderr);

    const agents = readFileSync(join(cwd, 'AGENTS.md'), 'utf8');
    assert.doesNotMatch(agents, /sk_live_/);
    assert.doesNotMatch(agents, /## Codex Learnings/);
  });
});
