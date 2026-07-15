export default {
  id: "empty-collection",
  category: "Collections",
  severity: "Medium",
  async run(context) {
    return context.collections
      .filter((c) => c.productCount === 0)
      .map((c) => ({
        resourceType: "collection",
        resourceId: c.id,
        title: `Empty collection: ${c.title}`,
        description: `Collection "${c.title}" has no products in it.`,
        recommendation:
          "Add products to this collection or remove it if no longer needed.",
      }));
  },
};
