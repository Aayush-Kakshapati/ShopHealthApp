export default {
  id: "missing-skus",
  category: "Products",
  severity: "Medium",
  async run(context) {
    return context.products
      .filter((p) => p.variants.some((v) => !v.sku))
      .map((p) => ({
        resourceType: "product",
        resourceId: p.id,
        title: `Missing SKU: ${p.title}`,
        description: `Product "${p.title}" has at least one variant with no SKU.`,
        image: p.images[0]?.url,
        recommendation: "Add SKUs to all variants for accurate inventory and fulfillment tracking.",
      }))
  },
};