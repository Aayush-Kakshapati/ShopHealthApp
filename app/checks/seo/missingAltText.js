export default {
  id: "missing-alt-text",
  category: "SEO",
  severity: "Low",
  async run(context) {
    return context.products
      .filter(
        (p) => p.images.length > 0 && p.images.some((img) => !img.altText),
      )
      .map((p) => ({
        resourceType: "product",
        resourceId: p.id,
        title: `Missing image alt text: ${p.title}`,
        image: p.images[0]?.url,
        description: `Product ${p.title} does not have image altText`,
        recommendation:
          "Add descriptive alt text to all product images to improve accessibility and SEO.",
      }));
  },
};
