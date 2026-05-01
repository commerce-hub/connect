import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectRoot = path.join(workspaceRoot, 'projects', 'commerce-hub-connect-react-app');
const distRoot = path.join(projectRoot, 'dist');

await fs.rm(distRoot, { recursive: true, force: true });

await runCommand(resolveProjectBin('vite'), ['build', '--mode', 'library']);
await runCommand(resolveProjectBin('tsc'), ['-p', 'tsconfig.build.json']);

function resolveProjectBin(name) {
  return path.join(
    projectRoot,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? `${name}.cmd` : name,
  );
}

async function runCommand(command, args) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} exited with code ${code ?? 'unknown'}.`));
    });
  });
}
