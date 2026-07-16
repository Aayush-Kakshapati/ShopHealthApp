/* eslint-disable react/prop-types */

import { useState, useMemo, useRef } from "react";
import FixIssueModal from "./FixIssueModal";

const SEVERITY_TONE = {
  Critical: "critical",
  High: "warning",
  Medium: "attention",
  Low: "info",
};

const SEVERITY_OPTIONS = ["Critical", "High", "Medium", "Low"];

export default function IssueList({ issues, shop }) {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [issueFilter, setIssueFilter] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);

  const modalRef = useRef(null);

  const issueOptions = useMemo(
    () => [...new Set(issues.map((issue) => issue.checkId))],
    [issues],
  );

  const categoryOptions = useMemo(
    () => [...new Set(issues.map((issue) => issue.category))],
    [issues],
  );

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesCategory =
        !categoryFilter || issue.category === categoryFilter;

      const matchesSeverity =
        !severityFilter || issue.severity === severityFilter;

      const matchesIssue = !issueFilter || issue.checkId === issueFilter;

      return matchesCategory && matchesSeverity && matchesIssue;
    });
  }, [issues, categoryFilter, severityFilter, issueFilter]);

  const openFixModal = (issue) => {
    setSelectedIssue(issue);

    setTimeout(() => {
      modalRef.current?.showOverlay();
    }, 0);
  };

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
      <s-stack direction="inline" gap="base" alignItems="center">
        <s-button commandFor="issue-filter">
          {issueFilter || "Filter by Issue"}
        </s-button>

        <s-menu id="issue-filter" accessibilityLabel="Issue Filter">
          {issueOptions.map((checkId) => (
            <s-button key={checkId} onClick={() => setIssueFilter(checkId)}>
              {checkId}
            </s-button>
          ))}
        </s-menu>

        <s-button commandFor="category-filter">
          {categoryFilter || "Filter by Category"}
        </s-button>

        <s-menu id="category-filter" accessibilityLabel="Category Filter">
          {categoryOptions.map((cat) => (
            <s-button key={cat} onClick={() => setCategoryFilter(cat)}>
              {cat}
            </s-button>
          ))}
        </s-menu>

        <s-button commandFor="severity-filter">
          {severityFilter || "Filter by Severity"}
        </s-button>

        <s-menu id="severity-filter" accessibilityLabel="Severity Filter">
          {SEVERITY_OPTIONS.map((sev) => (
            <s-button key={sev} onClick={() => setSeverityFilter(sev)}>
              {sev}
            </s-button>
          ))}
        </s-menu>

        {(categoryFilter || severityFilter || issueFilter) && (
          <s-button
            tone="critical"
            onClick={() => {
              setCategoryFilter("");
              setSeverityFilter("");
              setIssueFilter("");
            }}
          >
            Clear Filters
          </s-button>
        )}
      </s-stack>

      <s-table padding="4px">
        <s-table-header-row>
          <s-table-header>Image</s-table-header>

          <s-table-header listSlot="primary">Issue</s-table-header>

          <s-table-header>Category</s-table-header>

          <s-table-header>Severity</s-table-header>

          <s-table-header>Recommendation</s-table-header>

          <s-table-header>Shopify</s-table-header>
        </s-table-header-row>

        <s-table-body>
          {filteredIssues.map((issue) => {
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
                  <s-button border="1px" onClick={() => openFixModal(issue)}>
                    Fix Issue
                  </s-button>
                </s-table-cell>
              </s-table-row>
            );
          })}
        </s-table-body>
      </s-table>

      <FixIssueModal issue={selectedIssue} shop={shop} modalRef={modalRef} />
    </s-section>
  );
}
