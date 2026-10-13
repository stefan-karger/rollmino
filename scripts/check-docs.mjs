import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' })
  .split('\0').filter(file => file.endsWith('.md') && !/^(original-handoff|research-archive)\//.test(file) && existsSync(resolve(root, file)));
const scripts = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')).scripts;
const errors = [];
let links = 0;
for (const file of files) {
  const path = resolve(root, file);
  const source = readFileSync(path, 'utf8');
  for (const match of source.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)) {
    const target = match[1];
    if (/^[a-z][a-z\d+.-]*:/i.test(target)) continue;
    links++;
    const [name, fragment] = target.split('#');
    const destination = name ? resolve(dirname(path), decodeURIComponent(name)) : path;
    if (!existsSync(destination)) {
      errors.push(`${file}: missing ${target}`);
      continue;
    }
    if (fragment && destination.endsWith('.md')) {
      const headings = [...readFileSync(destination, 'utf8').matchAll(/^#+\s+(.+)$/gm)].map(heading =>
        heading[1].toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-'));
      if (!headings.includes(decodeURIComponent(fragment))) errors.push(`${file}: missing anchor ${target}`);
    }
  }
  for (const match of source.matchAll(/pnpm run ([a-z][\w:-]*)/g)) {
    if (!Object.hasOwn(scripts, match[1])) errors.push(`${file}: unknown script ${match[1]}`);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Checked ${files.length} maintained/historical Markdown files, ${links} local links and documented pnpm scripts.`);
}
