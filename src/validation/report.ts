export interface ValidationIssue {
  code: string;
  message: string;
  path: string;
  severity: 'error' | 'warning';
}

export interface ValidationReport {
  valid: boolean;
  issues: ValidationIssue[];
}

export function createValidationReport(issues: ValidationIssue[]): ValidationReport {
  const sorted = [...issues].sort((a, b) =>
    a.path.localeCompare(b.path) || a.code.localeCompare(b.code) || a.message.localeCompare(b.message),
  );
  return { valid: !sorted.some((issue) => issue.severity === 'error'), issues: sorted };
}
