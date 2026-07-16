export default {
  id: "draft-products",
  category: "Products",
  severity: "Critical",
  async run(context) {
    return context.products
      .filter((p) => p.status === "DRAFT")
      .map((p) => ({
        resourceType: "product",
        resourceId: p.id,
        title: `Draft product: ${p.title}`,
        image: p.images[0]?.url,
        description: `Product ${p.title} has not been listed in store.`,
        recommendation: "List the product in store to start earning.",
      }));
  },
};
