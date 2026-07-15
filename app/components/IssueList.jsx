/* eslint-disable react/prop-types */
const SEVERITY_TONE = {
  Critical: "critical",
  High: "warning",
  Medium: "attention",
  Low: "info",
};

export default function IssueList({ issues }) {
  if (issues.length === 0) {
    return (
      <s-section heading="Issues">
        <s-paragraph>
          No issues found — your store is in great shape.
        </s-paragraph>
      </s-section>
    );
  }

  return (
    <s-section padding="2px" heading="Issues">
      <s-table>
        <s-table-header-row>
          <s-table-header>Image</s-table-header>
          <s-table-header listSlot="primary">Issue</s-table-header>
          <s-table-header>Category</s-table-header>
          <s-table-header>Severity</s-table-header>
          <s-table-header>Recommendation</s-table-header>
        </s-table-header-row>
        <s-table-body>
          {issues.map((issue) => (
            <s-table-row key={issue.id}>
              <s-table-cell>
                {issue.image ? (
                  <s-image src={issue.image} loading="lazy" objectFit="cover" />
                ) : (
                  <s-text tone="subdued">No image</s-text>
                )}
              </s-table-cell>
              <s-table-cell>
                <s-stack direction="block" gap="small-200">
                  <s-text fontWeight="bold">{issue.title}</s-text>
                  <s-text tone="subdued">{issue.description}</s-text>
                </s-stack>
              </s-table-cell>
              <s-table-cell>{issue.category}</s-table-cell>
              <s-table-cell>
                <s-badge tone={SEVERITY_TONE[issue.severity]}>
                  {issue.severity}
                </s-badge>
              </s-table-cell>
              <s-table-cell>{issue.recommendation}</s-table-cell>
            </s-table-row>
          ))}
        </s-table-body>
      </s-table>
    </s-section>
  );
}
