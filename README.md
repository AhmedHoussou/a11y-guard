# ♿ a11y-guard

[![CI](https://github.com/AhmedHoussou/a11y-guard/actions/workflows/ci.yml/badge.svg)](https://github.com/AhmedHoussou/a11y-guard/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> Automated WCAG Accessibility Scanner & CI Compliance Gate powered by Playwright and Axe-core.

`a11y-guard` navigates target web pages in a headless Chromium context, injects the enterprise Axe-core audit engine, evaluates DOM structures against WCAG 2.0, 2.1, and 2.2 Level A/AA standards, and provides automated quality gating for CI/CD pipelines to block regressions before production release.

---

## 🎯 The Problem

Digital accessibility (WCAG 2.1 AA) is a strict legal mandate across the US (ADA Title III) and the EU (European Accessibility Act). Despite this, teams often treat accessibility as an afterthought—running manual screen-reader spot-checks right before deployment, allowing critical barriers (unlabeled form fields, zero-contrast text, missing ARIA tags) to reach production.

`a11y-guard` shifts accessibility audits left into everyday pull requests.

---

## 🏗️ Architecture

```text
[Target URL / Staging Deployment]
                │
                ▼
      [a11y-guard Engine]
                │
                ├─► Launches Headless Chromium & Isolated Browser Context
                ├─► Injects @axe-core/playwright runtime into active DOM
                ├─► Evaluates WCAG 2.0 / 2.1 / 2.2 Level A & AA rule sets
                │
                ▼
    [Compliance Impact Evaluator]
                │
        ┌───────┴───────┐
        ▼               ▼
  [Critical/Serious]  [Moderate/Minor]
  - Missing labels    - Color contrast subtleties
  - Empty buttons     - Heading hierarchy skips
  - Images missing alt│
        │               │
        ▼               ▼
  [Exit Code 1: FAIL] [Exit Code 0: PASS / WARN]
```

---

## 🚀 Quick Start

### Installation

```bash
git clone [https://github.com/AhmedHoussou/a11y-guard.git](https://github.com/AhmedHoussou/a11y-guard.git)
cd a11y-guard
npm install
npx playwright install chromium
npm run build
```

### Run Locally with Built-in Mock Server

```bash
# Audits compliant mock page (PASS)
node dist/cli.js --mock --accessible

# Audits intentionally flawed mock page (CATCHES VIOLATIONS & FAILS)
node dist/cli.js --mock
```

### Run Against Live / Staging Environments

```bash
node dist/cli.js \
  --url [https://staging.example.com](https://staging.example.com) \
  --tags wcag2a,wcag2aa,wcag21aa \
  --fail-on critical,serious
```

---

## ⚙️ CLI Options

| Flag | Argument | Description | Default |
| :--- | :--- | :--- | :--- |
| `-u, --url` | `<url>` | Target web page URL to audit | `http://localhost:8085` |
| `-t, --tags` | `<tags>` | Comma-separated WCAG standard tags | `wcag2a,wcag2aa,wcag21aa` |
| `-f, --fail-on` | `<levels>` | Impact levels that trigger CI exit failure | `critical,serious` |
| `--mock` | *None* | Starts internal mock server for zero-setup runs | `false` |
| `--accessible` | *None* | Audits accessible benchmark route under `--mock` | `false` |

---

## 🔄 CI/CD Pipeline Integration

Add `a11y-guard` to `.github/workflows/a11y-gate.yml` to enforce accessibility standards on every pull request:

```yaml
name: Accessibility Compliance Gate

on:
  pull_request:
    branches: [ main ]

jobs:
  accessibility-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci
      - name: Install Playwright Chromium & OS Dependencies
        run: npx playwright install --with-deps chromium

      - run: npm run build

      - name: Enforce WCAG Standards
        run: node dist/cli.js --mock --accessible --fail-on critical,serious
```

---

## 📄 License

MIT