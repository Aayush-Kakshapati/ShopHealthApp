import prisma from "../db.server";
import { authenticate } from "../shopify.server";

// PLACEHOLDER — replace these with your real checkId values from
// your CheckDefinition rows / checkRunner.server registry
const CHECK_MAP = {
  Images: ["missing-image", "low-res-image"],
  Description: ["missing-description", "short-description"],
  Price: ["missing-price", "invalid-price"],
  SKU: ["missing-sku"],
  Inventory: ["out-of-stock", "no-inventory-tracking"],
};

export async function loader({ request }) {
  const { session } = await authenticate.public.appProxy(request);
  if (!session) {
    return new Response("Unauthorized Access", { status: 401 });
  }

  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");
  if (!productId) {
    return new Response("Missing productId", { status: 400 });
  }

  const store = await prisma.store.findUnique({ where: { shop: session.shop } });
  if (!store) {
    return Response.json({ score: null, checks: [] });
  }

  const latestScan = await prisma.scan.findFirst({
    where: { storeId: store.id, finishedAt: { not: null } },
    orderBy: { finishedAt: "desc" },
    include: { issues: true },
  });

  if (!latestScan) {
    return Response.json({ score: null, checks: [] });
  }

  const productIssues = latestScan.issues.filter(
    (issue) => issue.resourceId === productId && issue.status === "Open"
  );

  const openCheckIds = new Set(productIssues.map((i) => i.checkId));

  const checks = Object.entries(CHECK_MAP).map(([label, checkIds]) => ({
    label,
    passed: !checkIds.some((id) => openCheckIds.has(id)),
  }));

  const passedCount = checks.filter((c) => c.passed).length;
  const productHealthPercent = Math.round((passedCount / checks.length) * 100);

  return Response.json({
    score: productHealthPercent,
    checks,
  });
}