import { PRODUCTS_QUERY } from "../graphql/queries/products.graphql";

export async function loadProducts(admin) {
  const products = [];
  let cursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await admin.graphql(PRODUCTS_QUERY, {
      variables: { first: 50, after: cursor },
    });
    const data = await response.json();
    const edges = data.data.products.edges;

    for (const { node } of edges) {
      products.push({
        id: node.id,
        title: node.title,
        vendor: node.vendor,
        productType: node.productType,
        status: node.status,
        seoTitle: node.seo?.title ?? null,
        seoDescription: node.seo?.description ?? null,
        images: node.images.edges.map((e) => e.node),
        variants: node.variants.edges.map((e) => ({
          id: e.node.id,
          sku: e.node.sku,
          barcode: e.node.barcode,
          price: e.node.price,
          inventoryQuantity: e.node.inventoryQuantity,
          weight: e.node.inventoryItem?.measurement?.weight?.value ?? null,
          weightUnit: e.node.inventoryItem?.measurement?.weight?.unit ?? null,
        })),
      });
    }
    hasNextPage = data.data.products.pageInfo.hasNextPage;
    cursor = data.data.products.pageInfo.endCursor;
  }
  return products;
}
