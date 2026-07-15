export default {
  id: "zero-price",
  category: "Pricing",
  severity: "Critical",
  async run(context) {
    return context.products
      .filter((p) => p.variants.some((v) => Number(v.price) === 0))
      .map((p) => ({
        resourceType: "product",
        resourceId: p.id,
        title: `Zero price: ${p.title}`,
        description: `Product "${p.title}" has at least one variant priced at $0.`,
        image: p.images[0]?.url,
        recommendation:
          "Set a real price — a $0 variant can be added to cart and checked out for free.",
      }));
  },
};
