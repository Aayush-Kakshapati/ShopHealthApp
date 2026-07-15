import { useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import ScoreCard from "../components/ScoreCard";
import IssueList from "../components/IssueList";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  const store = await prisma.store.findUnique({ where: { shop: session.shop } });
  if (!store) return { scan: null, issues: [], counts: {} };

  const scan = await prisma.scan.findFirst({
    where: { storeId: store.id, score: { not: null } },
    orderBy: { startedAt: "desc" },
    include: { issues: true },
  });

  if (!scan) return { scan: null, issues: [], counts: {} };

  const counts = scan.issues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {});

  return { scan, issues: scan.issues, counts };
};

const EmptyState = () => (
  <s-section heading="No scans yet">
    <s-grid gap="base" justifyItems="center" paddingBlock="large-400">
      <s-heading>Run your first scan</s-heading>
      <s-paragraph>
        See your store&apos;s health score and issues once a scan completes.
      </s-paragraph>
      <s-button href="/app/scan" variant="primary">Go to Scan</s-button>
    </s-grid>
  </s-section>
);

export default function Dashboard() {
  const { scan, issues, counts } = useLoaderData();

  return (
    <s-page heading="Store Health Dashboard">
      <s-link slot="secondary-actions" href="/app/scan">Run New Scan</s-link>
      {!scan ? (
        <EmptyState />
      ) : (
        <>
          <ScoreCard score={scan.score} counts={counts} />
          <IssueList issues={issues} />
        </>
      )}
    </s-page>
  );
}

export const headers = (headersArgs) => boundary.headers(headersArgs);