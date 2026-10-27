import { chromium } from 'playwright';
import AxeBuilderModule from '@axe-core/playwright';
// Robust ESM/CJS constructor resolution
const AxeBuilder = AxeBuilderModule.default || AxeBuilderModule;
export async function runAccessibilityScan(url, options) {
    const browser = await chromium.launch({ headless: true });
    // Explicitly initialize an isolated browser context
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        // Inject and execute Axe audit
        const axeResults = await new AxeBuilder({ page })
            .withTags(options.wcagStandards)
            .analyze();
        const violations = axeResults.violations.map((v) => ({
            id: v.id,
            impact: (v.impact || 'minor'),
            description: v.description,
            help: v.help,
            helpUrl: v.helpUrl,
            tags: v.tags,
            nodes: v.nodes.map((n) => ({
                target: n.target,
                html: n.html,
                failureSummary: n.failureSummary,
            })),
        }));
        const violationsByImpact = {
            critical: 0,
            serious: 0,
            moderate: 0,
            minor: 0,
        };
        let containsBlockingBreach = false;
        for (const v of violations) {
            if (violationsByImpact[v.impact] !== undefined) {
                violationsByImpact[v.impact]++;
            }
            if (options.failOnImpact.includes(v.impact)) {
                containsBlockingBreach = true;
            }
        }
        return {
            url,
            timestamp: new Date().toISOString(),
            wcagTags: options.wcagStandards,
            totalViolations: violations.length,
            violationsByImpact,
            violations,
            passed: !containsBlockingBreach,
        };
    }
    finally {
        await context.close();
        await browser.close();
    }
}
