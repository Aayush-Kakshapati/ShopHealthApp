export function getAdminResourceUrl(shop, resourceType, resourceId) {
  const numericId = resourceId?.split("/").pop();
  if (!numericId) return null;

  const pathByType = {
    product: "products",
    collection: "collections",
  };

  const path = pathByType[resourceType];
  if (!path) return null;

  return `https://${shop}/admin/${path}/${numericId}`;
}