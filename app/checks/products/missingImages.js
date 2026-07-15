export default {
  id: "missing-images",
  category: "Products",
  severity: "High",
  async run(context) {
    return context.products
      .filter((p) => !p.images || p.images.length === 0)
      .map((p) => ({
        resourceType: "Product",
        resourceId: p.id,
        title: `Missing image: ${p.title}`,
        description: `Product "${p.title}" has no images.`,
        recommendation: "Add at least one product image to improve conversion.",
      }));
  },
};
