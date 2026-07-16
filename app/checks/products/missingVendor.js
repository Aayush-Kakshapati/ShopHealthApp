export default {
  id: "missing-vendor",
  category: "Products",
  severity: "Low",
  async run(context) {
    return context.products
      .filter((p) => !p.vendor)
      .map((p) => ({
        resourceType: "product",
        resourceId: p.id,
        title: `Missing vendor: ${p.title}`,
        description: `This product has no vendor set.`,
        image: p.images[0]?.url,
        recommendation: "Set a vendor to improve filtering and reporting.",
        metadata: { productTitle: p.title },
      }))
  }
};