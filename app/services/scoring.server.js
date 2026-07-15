const DEDUCTIONS = {
  Critical: 12,
  High: 8,
  Medium: 4,
  Low: 1,
};

export function calculateScore(issues) {
  const totalDeduction = issues.reduce(
    (sum, issue) => sum + (DEDUCTIONS[issue.severity] || 0),
    0
  );
  return Math.max(0, 100 - totalDeduction);
}