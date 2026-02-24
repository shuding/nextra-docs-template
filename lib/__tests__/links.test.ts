/**
 * Link validation tests using lychee against running dev server
 *
 * Prerequisites:
 * - lychee installed: brew install lychee
 * - Dev server running: pnpm dev
 *
 * Run with: pnpm test:links
 */

import { spawnSync } from 'child_process';
import * as path from 'path';

export {}; // Make this a module for TypeScript

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const DEV_SERVER_URL = 'http://localhost:3000';

function isLycheeInstalled(): boolean {
  const result = spawnSync('which', ['lychee'], { encoding: 'utf-8' });
  return result.status === 0;
}

function isServerRunning(): Promise<boolean> {
  return new Promise((resolve) => {
    const http = require('http');
    const req = http.get(DEV_SERVER_URL, (res: { statusCode: number }) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function runLychee(args: string[]): { success: boolean; output: string } {
  const result = spawnSync('lychee', args, {
    cwd: PROJECT_ROOT,
    encoding: 'utf-8',
    timeout: 300000, // 5 minute timeout
  });

  return {
    success: result.status === 0,
    output: (result.stdout || '') + (result.stderr || ''),
  };
}

describe('Link Validation', () => {
  const lycheeAvailable = isLycheeInstalled();

  beforeAll(() => {
    if (!lycheeAvailable) {
      console.warn(
        '\n⚠️  lychee is not installed. Link validation tests will be skipped.\n' +
          '   Install with: brew install lychee\n'
      );
    }
  });

  describe('Site Links', () => {
    test('all links are valid', async () => {
      if (!lycheeAvailable) {
        console.warn('lychee not installed - skipping');
        return;
      }

      const serverRunning = await isServerRunning();
      if (!serverRunning) {
        console.warn(
          '\n⚠️  Dev server not running. Link validation test skipped.\n' +
            '   Start with: pnpm dev\n' +
            '   Then run: pnpm test:links\n'
        );
        return;
      }

      const result = runLychee([
        DEV_SERVER_URL,
        '--no-progress',
        '--format',
        'detailed',
        '--timeout',
        '30',
        '--max-retries',
        '2',
        // Exclude flaky/dynamic URLs
        '--exclude',
        'github.com/.*/edit',
        '--exclude',
        'github.com/.*/issues/new', // Dynamic issue creation links
      ]);

      // Log summary
      const summaryMatch = result.output.match(
        /📝 Summary[\s\S]*?(?=\n\nErrors|\n\nRedirects|\n*$)/
      );
      if (summaryMatch) {
        console.log('\n' + summaryMatch[0]);
      }

      if (!result.success) {
        // Extract just the errors
        const errorsMatch = result.output.match(/Errors in [\s\S]*/);
        if (errorsMatch) {
          console.error('\nBroken links found:\n', errorsMatch[0]);
        }
      }

      expect(result.success).toBe(true);
    }, 300000); // 5 minute timeout
  });
});
