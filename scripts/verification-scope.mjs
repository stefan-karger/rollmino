import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const full = () => ({ pure: true, build: true, browser: 'all', artifact: true, exhaustive: true });

/** Known paths narrow PR checks; releases and unknown paths keep the full gate. */
export function verificationScope(event, files) {
  if (event !== 'pull_request') return full();
  const scope = { pure: false, build: false, browser: 'none', artifact: false, exhaustive: false };
  function browser(group) {
    scope.pure = scope.build = true;
    scope.browser = scope.browser === 'none' || scope.browser === group ? group : 'all';
  }
  for (const file of files) {
    if (file.endsWith('.md') || /^(original-handoff|research-archive)\//.test(file) || file === 'SHA256SUMS.txt') continue;
    if (/^(engine|fixtures)\//.test(file)) return full();
    if (file === 'tests/oracle.mjs' || file === 'scripts/verify-all.mjs') {
      scope.pure = scope.exhaustive = true;
    } else if (/^tests\/.+\.test\.mjs$/.test(file)) {
      scope.pure = true;
    } else if (file === 'src/app.ts' || file === 'src/session.ts' || file === 'e2e/helpers.ts') {
      browser('all');
      scope.artifact = true;
    } else if (file === 'src/records.ts') {
      browser('records');
      scope.artifact = true;
    } else if (['src/styles.css', 'src/tray-geometry.ts', 'index.html'].includes(file) || file.startsWith('public/')) {
      browser('ui');
      scope.artifact = true;
    } else if (file === 'e2e/production.spec.ts') {
      scope.pure = scope.build = scope.artifact = true;
    } else if (file === 'e2e/records.spec.ts') {
      browser('records');
    } else if (['e2e/input.spec.ts', 'e2e/accessibility.spec.ts', 'e2e/play.spec.ts'].includes(file)) {
      browser('ui');
    } else {
      return full();
    }
  }
  return scope;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [event, ...paths] = process.argv.slice(2);
  if (!event) throw Error('Usage: node scripts/verification-scope.mjs EVENT [changed paths...]');
  let files = paths;
  if (event === 'pull_request' && paths.length === 0) {
    const base = process.env.ROLLMINO_BASE_SHA, head = process.env.ROLLMINO_HEAD_SHA;
    if (![base, head].every(sha => /^[a-f\d]{40}$/i.test(sha ?? ''))) throw Error('Expected PR base/head SHAs.');
    // Count both sides of renames so a runtime deletion cannot become a docs-only change.
    files = execFileSync('git', ['diff', '--name-only', '--no-renames', '-z', `${base}...${head}`, '--'], { encoding: 'utf8' }).split('\0').filter(Boolean);
  }
  const scope = verificationScope(event, files);
  console.log(JSON.stringify({ event, files, scope }));
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, Object.entries(scope).map(([key, value]) => `${key}=${value}\n`).join(''));
  }
}
