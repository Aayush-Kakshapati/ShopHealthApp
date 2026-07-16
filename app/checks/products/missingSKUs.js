export default {
  id: "missing-sku",
  category: "Products",
  severity: "Medium",
  async run(context) {
    return context.products.flatMap((p) =>
      p.variants
        .filter((v) => !v.sku)
        .map((v) => ({
          resourceType: "product",
          resourceId: p.id,
          title: `Missing SKU: ${p.title}`,
          description: `This variant has no SKU set.`,
          image: p.images[0]?.url,
          recommendation: "Add a SKU for accurate inventory and fulfillment tracking.",
          metadata: { productTitle: p.title, variantId: v.id },
        }))
    );
  },
};