import { PRODUCT_DETAIL_QUERY } from "../graphql/queries/productdetail.graphql";

export async function loadProductDetail(admin, gid) {
  const response = await admin.graphql(PRODUCT_DETAIL_QUERY, {
    variables: {
      id: gid,
    },
  });

  const { data } = await response.json();

  const product = data?.product;

  if (!product) {
    return null;
  }

  return {
    id: product.id,
    title: product.title ?? "",
    handle: product.handle ?? "",
    description: product.descriptionHtml ?? "",
    vendor: product.vendor ?? "",
    productType: product.productType ?? "",
    status: product.status,
    tags: product.tags ?? [],
    seoTitle: product.seo?.title ?? "",
    seoDescription: product.seo?.description ?? "",
    media:
      product.media?.nodes?.map((media) => ({
        id: media.id,
        url: media.image?.url ?? "",
        alt: media.alt ?? "",
      })) ?? [],
    variants:
      product.variants?.nodes?.map((variant) => ({
        id: variant.id,
        title: variant.title,
        sku: variant.sku ?? "",
        barcode: variant.barcode ?? "",
        price: variant.price,
        inventoryQuantity: variant.inventoryQuantity,
        weight: {
          value: variant.inventoryItem?.measurement?.weight?.value ?? "",
          unit: variant.inventoryItem?.measurement?.weight?.unit ?? "",
        },
      })) ?? [],
  };
}
