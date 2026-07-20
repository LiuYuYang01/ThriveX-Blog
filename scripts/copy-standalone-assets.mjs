import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';

function copy(src, dest) {
  if (statSync(src).isDirectory()) {
    mkdirSync(dest, { recursive: true });
    for (const name of readdirSync(src)) copy(join(src, name), join(dest, name));
    return;
  }
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
}

const standalone = '.next/standalone';
if (!existsSync(standalone)) process.exit(0);

copy('.next/static', join(standalone, '.next/static'));
if (existsSync('public')) copy('public', join(standalone, 'public'));
