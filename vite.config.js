import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { spawn, execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function killPort3000() {
  try {
    const output = execSync('netstat -aon').toString();
    const lines = output.split('\n');
    const targetPids = new Set();
    for (const line of lines) {
      if (line.includes(':3000')) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0' && !isNaN(pid)) {
          targetPids.add(pid);
        }
      }
    }
    
    if (targetPids.size > 0) {
      console.log(`[Auto-Fix] Port 3000 is occupied by processes: ${Array.from(targetPids).join(', ')}. Terminating them...`);
      for (const pid of targetPids) {
        try {
          execSync(`taskkill /F /PID ${pid}`);
        } catch (e) {}
      }
      // Sleep for 3 seconds to let port release completely
      execSync('ping 127.0.0.1 -n 4 > nul');
    }
  } catch (err) {
    console.log('[Auto-Fix] Checking port 3000...');
  }
}

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    killPort3000();

    const serverPath = path.resolve(__dirname, 'server/server.js');
    console.log(`Starting backend server: node ${serverPath}`);
    const server = spawn('node', [serverPath], {
      stdio: 'inherit',
      shell: true
    });

    process.on('exit', () => server.kill());
    process.on('SIGINT', () => {
      server.kill();
      process.exit();
    });
    process.on('SIGTERM', () => {
      server.kill();
      process.exit();
    });
  }

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
        '/ask-ai': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        }
      }
    }
  };
});
