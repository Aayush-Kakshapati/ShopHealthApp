export default {
  id: "duplicate-skus",
  category: "Products",
  severity: "Critical",
  async run(context) {
    const skuMap = new Map();

    for (const product of context.products) {
      for (const variant of product.variants) {
        if (!variant.sku) continue;
        if (!skuMap.has(variant.sku)) skuMap.set(variant.sku, []);
        skuMap.get(variant.sku).push(product);
      }
    }

    const issues = [];
    for (const [sku, products] of skuMap.entries()) {
      if (products.length > 1) {
        issues.push({
          resourceType: "product",
          resourceId: products[0].id,
          title: `Duplicate SKU: ${sku}`,
          description: `SKU "${sku}" is used by ${products.length} different products: ${products.map((p) => p.title).join(", ")}.`,
          image: products.images[0]?.url,
          recommendation:
            "Ensure every SKU is unique to avoid inventory and fulfillment errors.",
        });
      }
    }
    return issues;
  },
};
