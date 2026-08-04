import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { session } = await authenticate.public.appProxy(request);

  if (!session) {
    return new Response("Unauthorized Access", { status: 401 });
  }

  const store = await prisma.store.findUnique({
    where: { shop: session.shop },
  });

  if (!store) {
    return Response.json({ score: null, lastScanDate: null, issues: [] });
  }

  const latestScan = await prisma.scan.findFirst({
    where: {
      storeId: store.id,
      finishedAt: { not: null },
    },
    orderBy: { finishedAt: "desc" },
    include: {
      issues: {
        where: { status: "Open" },
        orderBy: { severity: "asc" },
      },
    },
  });

  return Response.json({
    score: latestScan?.score ?? null,
    lastScanDate: latestScan?.finishedAt ?? null,
    issues: latestScan?.issues ?? [],
  });
}