export default {
  id: "zero-stock",
  category: "Products",
  severity: "Critical",
  async run(context) {
    return context.products
      .filter((p) =>
        p.variants.every(
          (v) => v.inventoryQuantity === 0 || v.inventoryQuantity == null,
        ),
      )
      .map((p) => ({
        resourceType: "product",
        resourceId: p.id,
        title: `Zero Stock: ${p.title}`,
        image: p.images[0]?.url,
        description: `Product "${p.title}" has zero stock.`,
        recommendation: `Add product to the inventory to improve your revenue`,
      }));
  },
};
