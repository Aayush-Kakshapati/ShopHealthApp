import prisma from "../db.server";
import { loadProducts } from "../services/productLoader.server";
import { loadCollections } from "../services/collectionLoader.server";
import { runChecks } from "../services/checkRunner.server";
import { calculateScore } from "../services/scoring.server";

export async function runScan({ admin, shop }) {
  const store = await prisma.store.findUnique({ where: { shop } });
  if (!store) {
    throw new Error(`No Store record found for ${shop}`);
  }

  const scan = await prisma.scan.create({
    data: { storeId: store.id },
  });

  try {
    const products = await loadProducts(admin);
    const collections = await loadCollections(admin)
    const context = { products, collections };

    const issues = await runChecks(context);
    const score = calculateScore(issues);

    if (issues.length > 0) {
      await prisma.issue.createMany({
        data: issues.map((issue) => ({
          scanId: scan.id,
          checkId: issue.checkId,
          severity: issue.severity,
          category: issue.category,
          resourceType: issue.resourceType,
          resourceId: issue.resourceId,
          title: issue.title,
          description: issue.description,
          image: issue.image ?? null,
          recommendation: issue.recommendation,
          metadata: issue.metadata ?? null
        })),
      });
    }

    const finishedAt = new Date();
    const duration = finishedAt.getTime() - scan.startedAt.getTime();

    const finishedScan = await prisma.scan.update({
      where: { id: scan.id },
      data: { score, finishedAt, duration },
    });

    await prisma.history.create({
      data: { storeId: store.id, score },
    });

    return finishedScan;
  } catch (error) {
    // leave a record that this scan failed rather than a row stuck
    // forever with finishedAt: null and no explanation
    await prisma.scan.update({
      where: { id: scan.id },
      data: { finishedAt: new Date(), score: null },
    });
    throw error;
  }
}