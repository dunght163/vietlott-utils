import { execSync } from 'node:child_process';
import { env } from '../config/env.js';

if (env.NODE_ENV === 'production') {
  console.error('db:reset is disabled in production.');
  process.exit(1);
}

function run(cmd: string): void {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

run('npm run db:migrate:undo:all');
run('npm run db:migrate');
run('npm run db:seed');
