import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, unlinkSync, rmdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { verificationScope } from '../scripts/verification-scope.mjs';

const docs = { pure: false, build: false, browser: 'none', artifact: false, exhaustive: false };
const full = { pure: true, build: true, browser: 'all', artifact: true, exhaustive: true };

test('documentation and provenance PRs need only consistency checks, including an empty diff', () => {
  assert.deepEqual(verificationScope('pull_request', ['README.md', 'docs/new-guide.md', 'original-handoff/engine.ts', 'SHA256SUMS.txt']), docs);
  assert.deepEqual(verificationScope('pull_request', []), docs);
});
test('CSS and original assets select UI browsers, build and the existing artifact', () => {
  assert.deepEqual(verificationScope('pull_request', ['src/styles.css', 'public/favicon.svg']), { ...docs, pure: true, build: true, browser: 'ui', artifact: true });
});
test('app wiring and sessions retain all native platforms without unrelated exhaustive solving', () => {
  for (const file of ['src/app.ts', 'src/session.ts']) assert.deepEqual(verificationScope('pull_request', [file]), { ...full, exhaustive: false });
});
test('record implementation selects record and gameplay checks with the built artifact', () => {
  assert.deepEqual(verificationScope('pull_request', ['src/records.ts']), { ...docs, pure: true, build: true, browser: 'records', artifact: true });
});
test('rules, solver and fixtures retain the full independent gate', () => {
  for (const file of ['engine/core.ts', 'fixtures/rolls.json']) assert.deepEqual(verificationScope('pull_request', [file]), full);
});
test('oracle and exhaustive-verifier changes run independent solving without browser repetition', () => {
  for (const file of ['tests/oracle.mjs', 'scripts/verify-all.mjs']) assert.deepEqual(verificationScope('pull_request', [file]), { ...docs, pure: true, exhaustive: true });
});
test('pure tests and browser-only assertions run their affected commands', () => {
  assert.deepEqual(verificationScope('pull_request', ['tests/core.test.mjs']), { ...docs, pure: true });
  assert.deepEqual(verificationScope('pull_request', ['e2e/production.spec.ts']), { ...docs, pure: true, build: true, artifact: true });
  assert.deepEqual(verificationScope('pull_request', ['e2e/records.spec.ts']), { ...docs, pure: true, build: true, browser: 'records' });
});
test('dependencies, configuration and unknown paths fail conservatively to the full gate', () => {
  for (const file of ['package.json', 'pnpm-lock.yaml', 'vite.config.ts', 'playwright.config.ts', '.github/workflows/pages.yml', 'src/new-module.ts', 'unknown.txt']) {
    assert.deepEqual(verificationScope('pull_request', [file]), full);
  }
});
test('mixed edits combine checks, and renamed runtime files retain their deletion checks', () => {
  assert.deepEqual(verificationScope('pull_request', ['README.md', 'src/records.ts']), { ...docs, pure: true, build: true, browser: 'records', artifact: true });
  assert.deepEqual(verificationScope('pull_request', ['src/styles.css', 'src/records.ts']), { ...full, exhaustive: false });
  assert.deepEqual(verificationScope('pull_request', ['src/app.ts', 'docs/archived-app.md']), { ...full, exhaustive: false });
});
test('main pushes, manual runs and unknown events always use the complete release checks', () => {
  for (const event of ['push', 'workflow_dispatch', 'unknown']) assert.deepEqual(verificationScope(event, ['README.md']), full);
});
test('missing PR comparison information fails instead of silently selecting no checks', () => {
  assert.throws(() => execFileSync(process.execPath, ['scripts/verification-scope.mjs', 'pull_request'], {
    env: { ...process.env, ROLLMINO_BASE_SHA: '', ROLLMINO_HEAD_SHA: '' }, stdio: 'pipe',
  }), error => error.status !== 0 && error.stderr.toString().includes('Expected PR base/head SHAs'));
});
test('the CLI writes the exact flags consumed by workflow conditions', () => {
  const directory = mkdtempSync(join(tmpdir(), 'rollmino-scope-'));
  const output = join(directory, 'github-output');
  try {
    execFileSync(process.execPath, ['scripts/verification-scope.mjs', 'pull_request', 'src/records.ts'], {
      env: { ...process.env, GITHUB_OUTPUT: output }, stdio: 'pipe',
    });
    assert.equal(readFileSync(output, 'utf8'), 'pure=true\nbuild=true\nbrowser=records\nartifact=true\nexhaustive=false\n');
  } finally {
    unlinkSync(output);
    rmdirSync(directory);
  }
});
