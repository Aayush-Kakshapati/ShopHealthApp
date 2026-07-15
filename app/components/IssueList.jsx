/* eslint-disable react/prop-types */

import { getAdminResourceUrl } from "../lib/adminLinks";

const SEVERITY_TONE = {
  Critical: "critical",
  High: "warning",
  Medium: "attention",
  Low: "info",
};


export default function IssueList({ issues, shop }) {

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
      

      <s-table padding="4px">
        <s-table-header-row>
          <s-table-header>Image</s-table-header>
          <s-table-header listSlot="primary">Issue</s-table-header>
          <s-table-header>Category</s-table-header>
          <s-table-header>Severity</s-table-header>
          <s-table-header>Recommendation</s-table-header>
          <s-table-header>Fix Issue</s-table-header>
        </s-table-header-row>
        <s-table-body>
          {issues.map((issue) => {
            const adminUrl = getAdminResourceUrl(
              shop,
              issue.resourceType,
              issue.resourceId,
            );
            return (
              <s-table-row key={issue.id}>
                <s-table-cell>
                  {issue.image ? (
                    <s-thumbnail
                      src={issue.image}
                      alt={issue.title}
                      size="base"
                      loading="lazy"
                      objectFit="cover"
                    />
                  ) : (
                    <s-thumbnail alt="No Image" />
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
                <s-table-cell>
                  {adminUrl ? (
                    <s-button border="1px" href={adminUrl} target="_blank">
                      Fix Issue
                    </s-button>
                  ) : (
                    <s-button disabled border="1px">
                      No Path
                    </s-button>
                  )}
                </s-table-cell>
              </s-table-row>
            );
          })}
        </s-table-body>
      </s-table>
    </s-section>
  );
}
