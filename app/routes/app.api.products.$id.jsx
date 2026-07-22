import { authenticate } from "../shopify.server";
import { loadProductDetail } from "../services/productDetailLoader.server";
import {
  saveProductChanges,
  createStagedUpload,
  attachProductImage,
} from "../services/productMutations.server";

export const loader = async ({ request, params }) => {
  const { admin } = await authenticate.admin(request);
  const gid = `gid://shopify/Product/${params.id}`;
  const product = await loadProductDetail(admin, gid);
  return { product };
};

export const action = async ({ request, params }) => {
  const { admin } = await authenticate.admin(request);
  const gid = `gid://shopify/Product/${params.id}`;
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "stagedUpload") {
      const target = await createStagedUpload(admin, {
        filename: formData.get("filename"),
        mimeType: formData.get("mimeType"),
        fileSize: formData.get("fileSize"),
      });
      return { success: true, target };
    }

    if (intent === "attachImage") {
      await attachProductImage(admin, gid, formData.get("resourceUrl"), formData.get("alt"));
      return { success: true };
    }

    const payload = JSON.parse(formData.get("payload"));
    await saveProductChanges(admin, { original: payload.original, updated: payload.updated });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};