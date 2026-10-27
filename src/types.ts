export type A11yImpact = 'critical' | 'serious' | 'moderate' | 'minor';

export interface ViolationNode {
  target: string[];
  html: string;
  failureSummary?: string;
}

export interface A11yViolation {
  id: string;
  impact: A11yImpact;
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  nodes: ViolationNode[];
}

export interface AuditReport {
  url: string;
  timestamp: string;
  wcagTags: string[];
  totalViolations: number;
  violationsByImpact: Record<A11yImpact, number>;
  violations: A11yViolation[];
  passed: boolean;
}

export interface ScannerOptions {
  wcagStandards: string[];
  failOnImpact: A11yImpact[];
}