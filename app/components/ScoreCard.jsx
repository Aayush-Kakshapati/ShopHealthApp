const SEVERITY_ORDER = ["Critical", "High", "Medium", "Low"];

// eslint-disable-next-line react/prop-types
export default function ScoreCard({ score, counts }) {
  return (
    <s-section heading="Health Score">
      <s-stack direction="block" gap="base">
        <s-heading>{score}</s-heading>
        <s-grid gridTemplateColumns="repeat(4, 1fr)" gap="base">
          {SEVERITY_ORDER.map((severity) => (
            <s-stack key={severity} direction="block" gap="small-200">
              <s-text tone="subdued">{severity}</s-text>
              <s-text fontWeight="bold">{counts[severity] || 0}</s-text>
            </s-stack>
          ))}
        </s-grid>
      </s-stack>
    </s-section>
  );
}