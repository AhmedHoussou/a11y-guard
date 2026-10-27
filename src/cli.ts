#!/usr/bin/env node
import { Command } from 'commander';
import { runAccessibilityScan } from './scanner.js';
import { printAuditReport } from './reporter.js';
import { startDemoServer } from './fixtures.js';
import { A11yImpact } from './types.js';
import * as http from 'http';

const program = new Command();

program
  .name('a11y-guard')
  .description('Automated WCAG Accessibility Compliance Gate for CI/CD Pipelines')
  .version('1.0.0')
  .option('-u, --url <url>', 'Target URL to audit', 'http://localhost:8085')
  .option(
    '-t, --tags <tags>',
    'Comma-separated WCAG tags',
    'wcag2a,wcag2aa,wcag21aa'
  )
  .option(
    '-f, --fail-on <levels>',
    'Comma-separated impact levels that trigger pipeline exit failure',
    'critical,serious'
  )
  .option('--mock', 'Spins up internal demo server for zero-setup execution', false)
  .option('--accessible', 'When used with --mock, audits the compliant accessible demo page', false)
  .action(async (options) => {
    let demoServer: http.Server | null = null;

    try {
      let targetUrl = options.url;

      if (options.mock) {
        demoServer = startDemoServer(8085);
        targetUrl = options.accessible ? 'http://localhost:8085/accessible' : 'http://localhost:8085';
      }

      console.log(`[a11y-guard] Auditing: ${targetUrl}...`);

      const wcagStandards = options.tags.split(',').map((s: string) => s.trim());
      const failOnImpact = options.failOn['split'](',').map((lvl: string) => lvl.trim()) as A11yImpact[];

      const report = await runAccessibilityScan(targetUrl, {
        wcagStandards,
        failOnImpact,
      });

      printAuditReport(report);

      if (demoServer) {
        demoServer.close();
      }

      process.exit(report.passed ? 0 : 1);
    } catch (err: any) {
      if (demoServer) {
        demoServer.close();
      }
      console.error(`[a11y-guard] Execution failed: ${err.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);