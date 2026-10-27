import pc from 'picocolors';
function getImpactBadge(impact) {
    switch (impact) {
        case 'critical':
            return pc.bgRed(pc.white(pc.bold(' CRITICAL ')));
        case 'serious':
            return pc.bgMagenta(pc.white(pc.bold(' SERIOUS ')));
        case 'moderate':
            return pc.bgYellow(pc.black(pc.bold(' MODERATE ')));
        case 'minor':
            return pc.bgBlue(pc.white(pc.bold(' MINOR ')));
    }
}
export function printAuditReport(report) {
    console.log('\n' + pc.bold(pc.cyan('━'.repeat(80))));
    console.log(pc.bold(pc.cyan(' ♿ A11Y-GUARD: Automated WCAG Accessibility Compliance Report')));
    console.log(pc.bold(pc.cyan('━'.repeat(80))) + '\n');
    console.log(` ${pc.bold('Target:')} ${pc.white(report.url)}`);
    console.log(` ${pc.bold('Standards:')} ${pc.dim(report.wcagTags.join(', '))}`);
    console.log(` ${pc.bold('Violations:')} ` +
        `Critical: ${report.violationsByImpact.critical > 0 ? pc.red(String(report.violationsByImpact.critical)) : pc.green('0')} | ` +
        `Serious: ${report.violationsByImpact.serious > 0 ? pc.magenta(String(report.violationsByImpact.serious)) : pc.green('0')} | ` +
        `Moderate: ${report.violationsByImpact.moderate > 0 ? pc.yellow(String(report.violationsByImpact.moderate)) : pc.green('0')} | ` +
        `Minor: ${pc.blue(String(report.violationsByImpact.minor))}\n`);
    if (report.violations.length === 0) {
        console.log(pc.green(' ✔ No accessibility violations detected across evaluated WCAG tags.'));
    }
    else {
        console.log(pc.bold(' Violation Breakdown:'));
        console.log(pc.dim(' ─'.repeat(40)));
        report.violations.forEach((v, index) => {
            console.log(`\n ${index + 1}. ${getImpactBadge(v.impact)} ${pc.bold(v.help)} ${pc.dim(`(${v.id})`)}`);
            console.log(`    ${pc.dim('Rule info:')} ${pc.underline(pc.cyan(v.helpUrl))}`);
            v.nodes.slice(0, 3).forEach((node) => {
                console.log(`    ${pc.red('↳ Element:')} ${pc.yellow(node.target.join(' ' || 'unknown'))}`);
                console.log(`      ${pc.dim('HTML:')} ${pc.dim(node.html.trim().slice(0, 90))}`);
            });
            if (v.nodes.length > 3) {
                console.log(`    ${pc.dim(`...and ${v.nodes.length - 3} more matching element(s)`)}`);
            }
        });
    }
    console.log('\n' + pc.bold(pc.cyan('━'.repeat(80))));
    const verdictBadge = report.passed
        ? pc.bgGreen(pc.black(pc.bold(' COMPLIANCE STATUS: PASSED ')))
        : pc.bgRed(pc.white(pc.bold(' COMPLIANCE STATUS: FAILED (CRITICAL/SERIOUS VIOLATIONS) ')));
    console.log(` ${verdictBadge}`);
    console.log(pc.bold(pc.cyan('━'.repeat(80))) + '\n');
}
