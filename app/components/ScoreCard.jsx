/* eslint-disable react/prop-types */
const SEVERITY_ORDER = ["Critical", "High", "Medium", "Low"];
const SEVERITY_COLOR = {
  Critical: "#D82C0D",
  High: "#FFC453",
  Medium: "#8C9196",
  Low: "#4589FF",
};

function getScoreTone(score) {
  if (score >= 80) return { tone: "success", label: "Healthy" };
  if (score >= 50) return { tone: "warning", label: "Needs attention" };
  return { tone: "critical", label: "Critical" };
}

const RING_COLOR = { success: "#008060", warning: "#FFC453", critical: "#D82C0D" };

function ScoreGauge({ score }) {
  const size = 140;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const { tone, label } = getScoreTone(score);

  return (
    <s-stack direction="block" gap="small-200" alignItems="center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E3E5E7" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={RING_COLOR[tone]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="48%" textAnchor="middle" fontSize="32" fontWeight="700" fill="#1A1A1A">
          {score}
        </text>
        <text x="50%" y="66%" textAnchor="middle" fontSize="13" fill="#6D7175">
          / 100
        </text>
      </svg>
      <s-badge tone={tone}>{label}</s-badge>
    </s-stack>
  );
}

function SeverityBars({ counts }) {
  const maxCount = Math.max(...SEVERITY_ORDER.map((s) => counts[s] || 0), 1);

  return (
    <s-stack direction="block" gap="base">
      {SEVERITY_ORDER.map((severity) => {
        const count = counts[severity] || 0;
        const widthPercent = (count / maxCount) * 100;
        return (
          <s-stack key={severity} direction="inline" gap="base" alignItems="center">
            <div style={{ width: "70px", flexShrink: 0 }}>
              <s-text fontWeight="bold">{severity}</s-text>
            </div>
            <div style={{ flex: 1, background: "#F1F2F3", borderRadius: "4px", height: "20px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${widthPercent}%`,
                  background: SEVERITY_COLOR[severity],
                  height: "100%",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div style={{ width: "24px", flexShrink: 0, textAlign: "right" }}>
              <s-text>{count}</s-text>
            </div>
          </s-stack>
        );
      })}
    </s-stack>
  );
}

export default function ScoreCard({ score, counts }) {
  return (
    <s-section heading="Store Health">
      <s-grid gridTemplateColumns="auto 1fr" gap="large" alignItems="center">
        <ScoreGauge score={score} />
        <SeverityBars counts={counts} />
      </s-grid>
    </s-section>
  );
}